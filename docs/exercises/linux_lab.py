#!/usr/bin/env python3
"""Offline, unprivileged Linux CLI lab. Generates new files; never runs sudo.

Python 3.9+; standard library only. Windows generates data for inspection, but
the two permission exercises require an ordinary user on a Linux filesystem.
"""
import argparse
import base64
import hashlib
import json
import os
from pathlib import Path
import random
import re
import secrets
import shlex
import stat
import sys


SCHEMA = "awdp-linux-lab-v1"
NAME_RE = re.compile(r"awdp-linux-[A-Za-z0-9_-]{1,48}\Z")
ROOT_SOURCE = "root-setup/root-source.txt"
ROOT_VAULT = "root-vault.txt"


class LabError(ValueError):
    """A request that fails the lab's path or permission policy."""


def is_linux():
    return sys.platform.startswith("linux")


def require_ordinary_user():
    if hasattr(os, "geteuid") and os.geteuid() == 0:
        raise LabError("Do not run this generator or its helpers as root/sudo.")


def _absolute_no_links(raw):
    """Check the original path components; resolve() alone would hide links."""
    text = os.fspath(raw)
    if not text or "\x00" in text or ".." in text.replace("\\", "/").split("/"):
        raise LabError("Empty, NUL and '..' paths are refused.")
    path = Path(text).absolute()
    if os.name == "nt" and path.drive.startswith("\\\\"):
        raise LabError("UNC/network shares and Windows device paths are refused.")
    for part in reversed((path,) + tuple(path.parents)):
        try:
            info = part.lstat()
        except FileNotFoundError as exc:
            raise LabError("Every parent must already exist: " + str(part)) from exc
        # Reject junctions and other Windows reparse points as well as symlinks.
        reparse = getattr(info, "st_file_attributes", 0) & 0x400
        if stat.S_ISLNK(info.st_mode) or reparse:
            raise LabError("Symlink/junction paths are refused: " + str(part))
    return path


def _private_directory(path, exact=False):
    info = path.lstat()
    if not stat.S_ISDIR(info.st_mode):
        raise LabError("A directory is required: " + str(path))
    if is_linux():
        if info.st_uid != os.geteuid() or stat.S_IMODE(info.st_mode) & 0o022:
            raise LabError("Use your own directory, without group/other write permission.")
        if exact and stat.S_IMODE(info.st_mode) != 0o700:
            raise LabError("The lab directory must keep mode 700.")


def validate_parent(raw):
    path = _absolute_no_links(raw)
    if path == Path(path.anchor):
        raise LabError("A filesystem/drive root cannot be a lab parent.")
    if is_linux():
        forbidden = {"etc", "proc", "sys", "dev", "usr", "bin", "sbin", "lib", "lib64", "boot", "run", "var", "root"}
        if len(path.parts) > 1 and path.parts[1] in forbidden:
            raise LabError("Use a private practice directory, not a system directory.")
    elif os.name == "nt":
        forbidden = {"windows", "program files", "program files (x86)", "programdata"}
        if any(part.casefold() in forbidden for part in path.parts[1:]):
            raise LabError("Windows system directories cannot be lab parents.")
    _private_directory(path)
    return path


def _regular_owned_file(path, maximum=131072):
    _absolute_no_links(path)
    info = path.lstat()
    if not stat.S_ISREG(info.st_mode) or info.st_nlink != 1 or info.st_size > maximum:
        raise LabError("A small regular file with one link is required: " + str(path))
    if is_linux() and info.st_uid != os.geteuid():
        raise LabError("The preparation file must belong to the ordinary student user.")
    return info


def _read_owned(path, maximum=131072):
    before = _regular_owned_file(path, maximum)
    flags = os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0) | getattr(os, "O_BINARY", 0)
    fd = os.open(path, flags)
    try:
        after = os.fstat(fd)
        if (before.st_dev, before.st_ino) != (after.st_dev, after.st_ino):
            raise LabError("The file changed while being checked.")
        with os.fdopen(fd, "rb", closefd=False) as stream:
            data = stream.read(maximum + 1)
        if len(data) > maximum:
            raise LabError("The file exceeds the preparation size limit.")
        return data
    finally:
        os.close(fd)


def _write_new(path, data, mode=0o600):
    """Exclusive creation: no overwriting and no following a pre-existing link."""
    flags = os.O_WRONLY | os.O_CREAT | os.O_EXCL | getattr(os, "O_NOFOLLOW", 0) | getattr(os, "O_BINARY", 0)
    fd = os.open(path, flags, mode)
    try:
        with os.fdopen(fd, "wb", closefd=False) as stream:
            stream.write(data)
        if is_linux():
            os.fchmod(fd, mode)
    finally:
        os.close(fd)


def _flag(label):
    return "FLAG{linux_" + label + "_" + secrets.token_hex(16) + "}"


def _readmes(lab_id, script, linux):
    helper = "python3 " + shlex.quote(str(script))
    status_zh = "Linux 權限題已啟用；第六題仍需下列獨立設定。" if linux else "Windows 僅產生資料；第五、六題必須在 Linux VM 的原生檔案系統重新生成。"
    status_en = "Linux permissions enabled; task 6 still needs the separate setup below." if linux else "Windows data-only mode: regenerate on a Linux VM's native filesystem for tasks 5 and 6."
    zh = f"""# 離線 Linux CLI 實驗｜{lab_id}

這是本課自製練習，非官方題目或能力認證。所有日誌、附件和旗標均為虛構。
六組旗標每次隨機產生；不需要提交到外部網站。{status_zh}
生成器沒有連線、啟動服務、執行附件、提權或遞迴刪檔功能。

## 先建立位置感
依序執行 `pwd`、`ls`、`cat service/README.txt`、`less logs/app.log`（按 q 離開）。
先明白名稱與對象，再加選項。管道 `|` 將左側標準輸出交給右側指令。
`ls -l` 的九個權限位分為 owner/group/others：r讀、w寫、x執行；目錄x代表穿越。
`u` 是檔案 owner；不是自動指目前登入者。只改本實驗指定檔案。

## 六個學生任務
目錄共有 50 個起始檔案，包括 40 個不含旗標的虛構干擾檔；先辨識路徑，再搜尋。
1. **日誌**：`logs/app.log` 有 3000 行虛構紀錄。先觀察，再用 `cat` 接 `grep` 找旗標；記下原檔行號。
2. **二進位附件**：`challenge` 是合成資料，不是要執行的程式。用 `file` 和 `strings` 接 `grep` 找可列印線索。
3. **Base64**：先 `less encoded/message.b64`，再用 GNU `base64` 解碼。說明編碼為何不是加密。
4. **隱藏檔**：比較 `ls` 與 `ls -a`。找到點開頭檔案，再讀內容。
5. **owner 權限**：Linux 先 `ls -l permissions/owner-locked.txt`，再嘗試 `cat`，應失敗。只加 owner 的讀權後重試。
6. **root 權限**：完成老師授權的設定後，普通 `cat root-vault.txt` 應失敗；只有獲授權時，才用 `sudo cat root-vault.txt` 讀此檔。

## 第六題設定：普通使用者操作，老師授權單一步 sudo
先執行檢查程式；它會顯示已核對的完整路徑，**不執行 sudo**：
```bash
{helper} --root-plan .
```
檢查通過、老師同意且目錄仍未被修改時，在本 lab 目錄執行唯一的建立指令：
```bash
sudo install -T -o root -g root -m 600 -- root-setup/root-source.txt root-vault.txt
{helper} --finish-root-setup .
ls -l root-vault.txt
cat root-vault.txt
```
finish 必須由普通使用者執行；它確認 root:root、600、普通使用者真的讀不到，再只移除 `root-setup/root-source.txt`。
若任一步失敗，停止第六題，請老師檢查；不要用 sudo 跑生成器或 finish。
預期 `-rw-------` 且 owner/group 均為 root。不要提前讀準備副本；完成前第六題不算就緒。
不要把副本、旗標或終端輸出貼到公開聊天。此題是權限練習，不是保密或考試系統。

## 交接延伸（確認目的檔尚不存在）
`cp -a service service.bak` 保存假服務副本；`tar -czf practice.tar.gz service.bak` 建立新包；
`tar -tzf practice.tar.gz` 檢查內容。本課壓縮格式不代表正式比賽格式。

<details><summary>教師答案：展開後只有查法，沒有旗標全文</summary>

```bash
cat logs/app.log | grep 'FLAG{{'
grep -n 'FLAG{{' logs/app.log
file challenge
strings -a challenge | grep 'FLAG{{'
less encoded/message.b64
base64 --decode encoded/message.b64
ls -a
cat .hidden-note
ls -l permissions/owner-locked.txt
cat permissions/owner-locked.txt
chmod u+r permissions/owner-locked.txt
cat permissions/owner-locked.txt
ls -l root-vault.txt
cat root-vault.txt
sudo cat root-vault.txt
```
最後一個指令須教師授權；sudo 可能要求登入者的密碼。普通使用者可調整自己檔案的 mode，
但無法自行 chmod root-owned 檔案。`sudo cat` 只讀取，不會把檔案開放給其他人。
目錄 w+x 管理檔名的建立／刪除，因此學生擁有 lab 目錄仍可能移除 root 檔案；別用此方法繞過練習。
manifest 只保存識別、檔案摘要和設定狀態；不存六旗答案。

</details>
"""
    en = f"""# Offline Linux CLI lab | {lab_id}

Teacher-made practice, not an official competition task or certification.
All records are fictional. Each run has six random flags; no external submission.
{status_en} No network, server, executable payload or privilege escalation.

Start with `pwd`, `ls`, `cat service/README.txt`, `less logs/app.log` (q exits).
Then learn owner/group/others and r/w/x. For directories, x means traversal.
In chmod, u means the FILE OWNER, not necessarily the logged-in user.

## Student tasks
The lab starts with 50 files, including 40 fictional distractors without flags. Identify paths before searching.
1. Search `logs/app.log` using `cat` piped into `grep`; record the original line number.
2. Inspect the synthetic binary `challenge` using `file`, then `strings` piped into `grep`. Do not execute it.
3. Read `encoded/message.b64` with `less`, then decode using GNU `base64`. Encoding is not encryption.
4. Compare `ls` and `ls -a`; read the hidden dot-file.
5. On Linux, try reading `permissions/owner-locked.txt` (must fail), add only the owner's read permission, retry.
6. After teacher-authorized setup below, ordinary `cat root-vault.txt` must fail. Use `sudo cat root-vault.txt` only with permission.

## Root-file setup (ordinary user; one authorized sudo command)
Run the validator first; it prints checked paths but never executes sudo:
```bash
{helper} --root-plan .
```
With teacher authorization, from THIS lab directory, while paths remain unchanged:
```bash
sudo install -T -o root -g root -m 600 -- root-setup/root-source.txt root-vault.txt
{helper} --finish-root-setup .
ls -l root-vault.txt
cat root-vault.txt
```
Finish must run as the ordinary user. It checks root:root, mode 600 and a real denied read,
then deletes ONLY the designated preparation source. If anything fails, stop task 6 and ask your teacher.
Never run this generator/helpers under sudo. The expected mode is -rw-------, owner root, group root.
The preparation copy is not a secret before setup; do not read/copy it. After finish, README/manifest contain no flag answer.
This is a permission exercise, not an exam or secret storage system.

Optional handover: ensure new destinations do not exist, then
`cp -a service service.bak`, `tar -czf practice.tar.gz service.bak`, `tar -tzf practice.tar.gz`.
This archive format is a classroom choice, not a verified competition requirement.

<details><summary>Teacher methods (no full flag values)</summary>

```bash
cat logs/app.log | grep 'FLAG{{'
grep -n 'FLAG{{' logs/app.log
strings -a challenge | grep 'FLAG{{'
less encoded/message.b64
base64 --decode encoded/message.b64
ls -a
cat .hidden-note
chmod u+r permissions/owner-locked.txt
cat permissions/owner-locked.txt
ls -l root-vault.txt
cat root-vault.txt
sudo cat root-vault.txt
```
Use the final sudo read only with permission. Do not chmod everything or grant others read access.
Owning a directory can permit removal of entries even when the contained file is root-owned;
do not bypass this lesson by replacing the vault. A teacher should check the original file's ownership.

</details>
"""
    return zh.encode("utf-8"), en.encode("utf-8")


def create_lab(parent=".", name=None):
    require_ordinary_user()
    parent = validate_parent(parent)
    lab_id = secrets.token_hex(8)
    name = name or "awdp-linux-" + lab_id
    if not isinstance(name, str) or not NAME_RE.fullmatch(name):
        raise LabError("Name must be awdp-linux- plus 1-48 ASCII letters/digits/_/-.")
    lab = parent / name
    # mkdir without exist_ok is atomic and refuses existing files/directories/links.
    try:
        lab.mkdir(mode=0o700)
    except FileExistsError as exc:
        raise LabError("Destination already exists; nothing was overwritten: " + str(lab)) from exc
    if is_linux():
        lab.chmod(0o700)
    for subdir in ("logs", "encoded", "permissions", "root-setup", "service"):
        (lab / subdir).mkdir(mode=0o700)
        if is_linux():
            (lab / subdir).chmod(0o700)
    flags = {label: _flag(label) for label in ("log", "binary", "base64", "hidden", "owner", "root")}
    rng = random.Random(secrets.randbits(128))
    lines = []
    for index in range(3000):
        level = rng.choice(("INFO", "INFO", "DEBUG", "WARN", "ERROR"))
        event = rng.choice(("fictional-login", "lesson-check", "demo-cache", "practice-query", "dummy-backup"))
        lines.append(f"2026-10-10T{index // 3600:02}:{index // 60 % 60:02}:{index % 60:02}Z {level} lab={lab_id} seq={index:04} actor=student-demo-{rng.randrange(100):02} event={event} token={secrets.token_hex(5)}\n")
    index = rng.randrange(100, 2900)
    lines[index] = lines[index].rstrip("\n") + " clue=" + flags["log"] + "\n"
    # Noise bytes are non-printable/non-ASCII; the flag is a bounded ASCII string.
    noise = bytes(rng.choice(tuple(range(0, 9)) + tuple(range(128, 256))) for _ in range(32768))
    binary = b"AWDP_SYNTHETIC_DATA\x00NOT_AN_EXECUTABLE\x00" + noise[:16384] + b"\x00" + flags["binary"].encode("ascii") + b"\x00" + noise[16384:]
    zh, en = _readmes(lab_id, Path(__file__).absolute(), is_linux())
    files = {
        "logs/app.log": "".join(lines).encode("utf-8"),
        "challenge": binary,
        "encoded/message.b64": base64.encodebytes(("Practice message: " + flags["base64"] + "\n").encode("ascii")),
        ".hidden-note": ("Hidden files begin with a dot. " + flags["hidden"] + "\n").encode("ascii"),
        "permissions/owner-locked.txt": (flags["owner"] + "\n").encode("ascii"),
        ROOT_SOURCE: (flags["root"] + "\n").encode("ascii"),
        "service/README.txt": b"Fictional service for backup practice. No server or credentials.\n",
        "README.md": zh,
        "README.en.md": en,
    }
    # A directory inventory is useful practice too: 40 harmless distractor files.
    for number in range(1, 25):
        archive = []
        for row in range(24):
            archive.append(f"FICTIONAL_ARCHIVE lab={lab_id} batch={number:02} row={row:02} level={rng.choice(('INFO', 'WARN', 'ERROR'))} event=demo-history ticket=demo-{rng.randrange(10000):04}\n")
        files[f"logs/archive-{number:02}.log"] = "".join(archive).encode("ascii")
    for number in range(1, 17):
        files[f"service/note-{number:02}.txt"] = (f"Fictional practice note {number:02}; lab={lab_id}.\nNo real account, password or service. This note is a distractor.\n").encode("ascii")
    records = {}
    for relative, content in files.items():
        _write_new(lab / relative, content)
        records[relative] = {"bytes": len(content), "sha256": hashlib.sha256(content).hexdigest()}
    if is_linux():
        (lab / "permissions/owner-locked.txt").chmod(0o000)
    manifest = {
        "schema": SCHEMA, "lab_id": lab_id, "directory": name,
        "platform": "linux" if is_linux() else "data-only",
        "permission_tasks_enabled": is_linux(),
        "files": records,
        "root_task": {"source": ROOT_SOURCE, "destination": ROOT_VAULT, "status": "needs-teacher-setup"},
    }
    _write_new(lab / "manifest.json", (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
    return lab


def _load_lab(raw):
    require_ordinary_user()
    if not is_linux():
        raise LabError("Root setup requires a non-root Linux user on a Linux filesystem.")
    lab = _absolute_no_links(raw)
    validate_parent(lab.parent)
    _private_directory(lab, exact=True)
    if not NAME_RE.fullmatch(lab.name):
        raise LabError("Not a named AWDP lab directory.")
    data = _read_owned(lab / "manifest.json")
    try:
        manifest = json.loads(data)
        valid = (manifest["schema"] == SCHEMA and manifest["directory"] == lab.name
                 and re.fullmatch(r"[0-9a-f]{16}", manifest["lab_id"])
                 and manifest["platform"] == "linux"
                 and manifest["permission_tasks_enabled"] is True
                 and manifest["root_task"]["source"] == ROOT_SOURCE
                 and manifest["root_task"]["destination"] == ROOT_VAULT
                 and type(manifest["files"][ROOT_SOURCE]["bytes"]) is int
                 and 1 <= manifest["files"][ROOT_SOURCE]["bytes"] <= 256
                 and re.fullmatch(r"[0-9a-f]{64}", manifest["files"][ROOT_SOURCE]["sha256"]))
    except (ValueError, KeyError, TypeError):
        valid = False
    if not valid:
        raise LabError("Invalid lab manifest; helper accepts only fixed lab paths.")
    _absolute_no_links(lab / "root-setup")
    _private_directory(lab / "root-setup", exact=True)
    return lab, manifest


def _checked_source(lab, manifest):
    source = lab / ROOT_SOURCE
    info = _regular_owned_file(source, maximum=256)
    if stat.S_IMODE(info.st_mode) != 0o600:
        raise LabError("Preparation source must retain mode 600.")
    data = _read_owned(source, maximum=256)
    if hashlib.sha256(data).hexdigest() != manifest["files"][ROOT_SOURCE]["sha256"]:
        raise LabError("Preparation source checksum changed.")
    return source


def root_plan(raw):
    lab, manifest = _load_lab(raw)
    source = _checked_source(lab, manifest)
    destination = lab / ROOT_VAULT
    if os.path.lexists(destination):
        raise LabError("Root destination already exists (including links); do not overwrite it.")
    return "sudo install -T -o root -g root -m 600 -- " + shlex.quote(str(source)) + " " + shlex.quote(str(destination))


def finish_root_setup(raw):
    lab, manifest = _load_lab(raw)
    destination = _absolute_no_links(lab / ROOT_VAULT)
    info = destination.lstat()
    if (not stat.S_ISREG(info.st_mode) or info.st_nlink != 1 or info.st_uid != 0
            or info.st_gid != 0 or stat.S_IMODE(info.st_mode) != 0o600
            or info.st_size != manifest["files"][ROOT_SOURCE]["bytes"]):
        raise LabError("Vault must be a single-link regular root:root file with mode 600.")
    # A metadata display alone does not establish denial (ACLs/mount behavior vary).
    try:
        fd = os.open(destination, os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0))
    except PermissionError:
        pass
    else:
        os.close(fd)
        raise LabError("Ordinary user can still read the vault; permission exercise is not ready.")
    source = lab / ROOT_SOURCE
    if os.path.lexists(source):
        source = _checked_source(lab, manifest)
        # Exactly this one verified file; no recursive cleanup and no directory deletion.
        source.unlink()
    # Status is informational only. Atomically update only this known manifest.
    manifest["root_task"]["status"] = "ready-source-removed"
    staging = lab / "manifest.root-ready.tmp"
    _write_new(staging, (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode("utf-8"))
    os.replace(staging, lab / "manifest.json")
    return lab


def main(argv=None):
    parser = argparse.ArgumentParser(description="Create a new offline AWDP Linux CLI lab; never run with sudo.")
    parser.add_argument("--parent", default=".", help="Existing, private parent directory (default: current directory)")
    parser.add_argument("--name", help="New awdp-linux-NAME; existing destinations are refused")
    actions = parser.add_mutually_exclusive_group()
    actions.add_argument("--root-plan", metavar="LABDIR", help="Validate Linux lab and print one manual sudo install command")
    actions.add_argument("--finish-root-setup", metavar="LABDIR", help="Verify actual Linux read denial and remove only the preparation source")
    args = parser.parse_args(argv)
    if (args.root_plan or args.finish_root_setup) and (args.parent != "." or args.name is not None):
        parser.error("--parent/--name apply only to generation")
    try:
        if args.root_plan:
            print(root_plan(args.root_plan))
            print("Teacher authorization required. Execute manually only while checked paths remain unchanged.")
        elif args.finish_root_setup:
            lab = finish_root_setup(args.finish_root_setup)
            print("READY: denied read verified; preparation source removed in " + str(lab))
        else:
            lab = create_lab(args.parent, args.name)
            print("LAB DIRECTORY: " + str(lab))
            print("NEXT: cd " + shlex.quote(str(lab)))
            print("READ: README.md (Chinese) or README.en.md (English)")
            if not is_linux():
                print("DATA-ONLY: permission tasks require regeneration by a non-root user on Linux.")
    except (LabError, OSError) as exc:
        print("REFUSED: " + str(exc), file=sys.stderr)
        print("No existing destination is overwritten; a failed new lab may remain for inspection.", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
