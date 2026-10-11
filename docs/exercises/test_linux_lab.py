"""Meaningful data/path tests; real Linux permission tests are never simulated.

Run: python3 -B -m unittest discover -s docs/exercises -p test_linux_lab.py -v
No sudo, networking or external processes are used by these tests.
"""
import base64
import contextlib
import hashlib
import io
import json
import os
from pathlib import Path
import re
import stat
import tempfile
import unittest
from unittest import mock

import linux_lab


FLAG_RE = re.compile(rb"FLAG\{linux_[a-z0-9]+_[0-9a-f]{32}\}")
REAL_LINUX_USER = linux_lab.is_linux() and os.geteuid() != 0


class LinuxLabTests(unittest.TestCase):
    def setUp(self):
        # Explicit local test workspace, owned by the test user. Nothing external.
        self.fixture = tempfile.TemporaryDirectory(prefix="lab-test-", dir=Path(__file__).parent)
        self.parent = Path(self.fixture.name)
        self.addCleanup(self.fixture.cleanup)

    def make(self, name=None):
        lab = linux_lab.create_lab(self.parent, name)
        # Restore only OUR fixture's owner-locked file for test-harness cleanup.
        self.addCleanup(self.unlock_fixture, lab)
        return lab

    @staticmethod
    def unlock_fixture(lab):
        locked = lab / "permissions/owner-locked.txt"
        if locked.exists() and not locked.is_symlink():
            locked.chmod(0o600)

    def test_repeated_default_runs_are_new_and_have_manifest(self):
        first, second = self.make(), self.make()
        self.assertNotEqual(first, second)
        manifests = [json.loads((lab / "manifest.json").read_text(encoding="utf-8")) for lab in (first, second)]
        self.assertNotEqual(manifests[0]["lab_id"], manifests[1]["lab_id"])
        for lab, manifest in zip((first, second), manifests):
            self.assertEqual(manifest["schema"], linux_lab.SCHEMA)
            self.assertEqual(manifest["directory"], lab.name)
            self.assertRegex(manifest["lab_id"], r"^[0-9a-f]{16}$")
            self.assertEqual(manifest["permission_tasks_enabled"], linux_lab.is_linux())
            self.assertFalse((lab / "root-vault.txt").exists())
            self.assertEqual(manifest["root_task"]["status"], "needs-teacher-setup")
            self.assertNotIn("FLAG{", (lab / "manifest.json").read_text(encoding="utf-8"))
            self.assertTrue((lab / "README.en.md").is_file())
            self.assertEqual(len(manifest["files"]), 49)
            self.assertEqual(sum(path.is_file() for path in lab.rglob("*")), 50)
            if REAL_LINUX_USER:
                self.assertEqual(stat.S_IMODE(lab.stat().st_mode), 0o700)

    def test_logs_contain_one_flag_amid_real_noise(self):
        lab = self.make()
        data = (lab / "logs/app.log").read_bytes()
        lines = data.splitlines()
        self.assertEqual(len(lines), 3000)
        self.assertEqual(len(FLAG_RE.findall(data)), 1)
        self.assertGreater(sum(b"ERROR" in line for line in lines), 100)
        self.assertTrue(all(b"lab=" in line and b"actor=student-demo-" in line for line in lines))
        record = json.loads((lab / "manifest.json").read_text(encoding="utf-8"))["files"]["logs/app.log"]
        self.assertEqual(record["sha256"], hashlib.sha256(data).hexdigest())

    def test_forty_distractors_are_in_manifest_without_flag_data(self):
        lab = self.make()
        manifest = json.loads((lab / "manifest.json").read_text(encoding="utf-8"))
        paths = [f"logs/archive-{number:02}.log" for number in range(1, 25)]
        paths += [f"service/note-{number:02}.txt" for number in range(1, 17)]
        self.assertEqual(len(paths), 40)
        for name in paths:
            data = (lab / name).read_bytes()
            self.assertNotIn(b"FLAG{", data)
            self.assertEqual(manifest["files"][name]["bytes"], len(data))
            self.assertEqual(manifest["files"][name]["sha256"], hashlib.sha256(data).hexdigest())

    def test_binary_flag_is_printable_not_executable_code(self):
        lab = self.make()
        data = (lab / "challenge").read_bytes()
        strings = re.findall(rb"[\x20-\x7e]{4,}", data)
        flags = [value for value in strings if FLAG_RE.fullmatch(value)]
        self.assertEqual(len(flags), 1)
        self.assertIn(b"NOT_AN_EXECUTABLE", strings)
        self.assertIn(b"\x00", data)
        self.assertGreater(len(data), 32000)
        self.assertFalse(data.startswith(b"\x7fELF"))

    def test_base64_decodes_and_hidden_file_has_distinct_flag(self):
        lab = self.make()
        encoded = (lab / "encoded/message.b64").read_bytes()
        decoded = base64.b64decode(b"".join(encoded.split()), validate=True)
        flags = FLAG_RE.findall(decoded)
        self.assertEqual(len(flags), 1)
        self.assertIn(b"linux_base64_", flags[0])
        hidden = FLAG_RE.findall((lab / ".hidden-note").read_bytes())
        self.assertEqual(len(hidden), 1)
        self.assertNotEqual(flags[0], hidden[0])

    def test_root_flag_not_in_readme_manifest_or_other_files(self):
        lab = self.make()
        root_flag = FLAG_RE.findall((lab / linux_lab.ROOT_SOURCE).read_bytes())[0]
        # The plaintext setup source is intentionally temporary; no answer key.
        for name in ("README.md", "README.en.md", "manifest.json", "logs/app.log", "challenge", "encoded/message.b64", ".hidden-note", "service/README.txt"):
            self.assertNotIn(root_flag, (lab / name).read_bytes(), name)
        for name in ("README.md", "README.en.md"):
            text = (lab / name).read_text(encoding="utf-8")
            self.assertIn("--root-plan", text)
            self.assertIn("--finish-root-setup", text)
            self.assertIn("root-setup/root-source.txt root-vault.txt", text)

    def test_existing_destination_unchanged(self):
        target = self.parent / "awdp-linux-existing"
        target.mkdir()
        sentinel = target / "keep.txt"
        sentinel.write_bytes(b"do not replace")
        with self.assertRaises(linux_lab.LabError):
            self.make("awdp-linux-existing")
        self.assertEqual(sentinel.read_bytes(), b"do not replace")
        self.assertEqual(sorted(item.name for item in target.iterdir()), ["keep.txt"])

    def test_cli_prints_directory_and_refuses_existing_name(self):
        output, errors = io.StringIO(), io.StringIO()
        name = "awdp-linux-cli"
        with contextlib.redirect_stdout(output), contextlib.redirect_stderr(errors):
            self.assertEqual(linux_lab.main(["--parent", str(self.parent), "--name", name]), 0)
            self.addCleanup(self.unlock_fixture, self.parent / name)
            self.assertEqual(linux_lab.main(["--parent", str(self.parent), "--name", name]), 2)
        self.assertIn("LAB DIRECTORY: " + str(self.parent / name), output.getvalue())
        self.assertIn("README.en.md", output.getvalue())
        self.assertIn("already exists", errors.getvalue())
        self.assertNotIn("FLAG{", output.getvalue() + errors.getvalue())

    def test_dangerous_names_parent_traversal_and_drive_root_refused(self):
        before = list(self.parent.iterdir())
        for name in ("../escape", "awdp-linux-../escape", "/tmp/escape", "C:\\escape", "awdp-linux-a/b", "awdp-linux-", "awdp-linux-中文", ".", ".."):
            with self.subTest(name=name), self.assertRaises(linux_lab.LabError):
                self.make(name)
        with self.assertRaises(linux_lab.LabError):
            linux_lab.create_lab(str(self.parent / ".."))
        with self.assertRaises(linux_lab.LabError):
            linux_lab.create_lab(Path(self.parent.anchor))
        self.assertEqual(list(self.parent.iterdir()), before)
        if os.name == "nt":
            with self.assertRaises(linux_lab.LabError):
                linux_lab.create_lab(r"\\fictional-host\share\practice")

    def test_symlink_parent_and_dangling_destination_refused(self):
        link = self.parent / "linked-parent"
        real = self.parent / "real-parent"
        real.mkdir(mode=0o700)
        try:
            link.symlink_to(real, target_is_directory=True)
        except (OSError, NotImplementedError) as exc:
            self.skipTest("OS does not permit symlink creation: " + str(exc))
        with self.assertRaises(linux_lab.LabError):
            linux_lab.create_lab(link)
        self.assertEqual(list(real.iterdir()), [])
        dangling = self.parent / "awdp-linux-dangling"
        dangling.symlink_to(self.parent / "missing-target")
        with self.assertRaises(linux_lab.LabError):
            self.make(dangling.name)
        self.assertTrue(dangling.is_symlink())

    def test_root_execution_is_refused_before_writes(self):
        with mock.patch.object(linux_lab.os, "geteuid", return_value=0, create=True):
            with self.assertRaises(linux_lab.LabError):
                self.make()
        self.assertEqual(list(self.parent.iterdir()), [])

    @unittest.skipIf(linux_lab.is_linux(), "Non-Linux guard only")
    def test_root_helpers_refuse_windows_data_only(self):
        lab = self.make()
        with self.assertRaises(linux_lab.LabError):
            linux_lab.root_plan(lab)
        with self.assertRaises(linux_lab.LabError):
            linux_lab.finish_root_setup(lab)
        self.assertTrue((lab / linux_lab.ROOT_SOURCE).is_file())

    @unittest.skipUnless(REAL_LINUX_USER, "Needs a real non-root Linux user; no simulated permission result")
    def test_actual_owner_mode000_denies_then_chmod_restores_read(self):
        lab = self.make()
        locked = lab / "permissions/owner-locked.txt"
        self.assertEqual(locked.stat().st_uid, os.geteuid())
        self.assertEqual(stat.S_IMODE(locked.stat().st_mode), 0)
        with self.assertRaises(PermissionError):
            locked.read_bytes()
        locked.chmod(0o400)
        self.assertEqual(len(FLAG_RE.findall(locked.read_bytes())), 1)
        self.assertEqual(stat.S_IMODE(locked.stat().st_mode), 0o400)

    @unittest.skipUnless(REAL_LINUX_USER, "Needs real Linux metadata; no sudo run by tests")
    def test_linux_root_plan_uses_fixed_paths_and_finish_refuses_student_owned_vault(self):
        lab = self.make()
        command = linux_lab.root_plan(lab)
        self.assertTrue(command.startswith("sudo install -T -o root -g root -m 600 -- "))
        self.assertIn(str(lab / linux_lab.ROOT_SOURCE), command)
        vault = lab / linux_lab.ROOT_VAULT
        vault.write_bytes(b"not a root file")
        vault.chmod(0o600)
        with self.assertRaises(linux_lab.LabError):
            linux_lab.root_plan(lab)
        with self.assertRaises(linux_lab.LabError):
            linux_lab.finish_root_setup(lab)
        self.assertTrue((lab / linux_lab.ROOT_SOURCE).is_file())


if __name__ == "__main__":
    unittest.main()
