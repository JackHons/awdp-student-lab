"""Offline regression tests; no server or remote target is started."""

import json
import sqlite3
import unittest
from urllib.parse import urlencode

from waf_guard import GuardRejected, MAX_BODY, validate_request


class RequestGuardTests(unittest.TestCase):
    def get(self, name):
        return validate_request("GET", "/profile?" + urlencode({"name": name}))

    def post(self, value):
        body = json.dumps(value, ensure_ascii=False).encode("utf-8")
        return validate_request("POST", "/api/profile",
                                [("Content-Type", "application/json")], body)

    def blocked(self, method, target, headers=(), body=b"", status=400):
        with self.assertRaises(GuardRejected) as caught:
            validate_request(method, target, headers, body)
        self.assertEqual(caught.exception.status, status)

    def test_ordinary_unicode_and_apostrophe_names(self):
        for name in ["alice", "O'Neil", "陳同學", "A" * 64]:
            self.assertEqual(self.get(name).name, name)
            self.assertEqual(self.post({"name": name}).name, name)

    def test_normalization_and_single_protocol_decode(self):
        self.assertEqual(self.get("e\u0301").name, "é")
        result = validate_request("GET", "/%70rofile?name=O%27Neil")
        self.assertEqual(result.route, "/profile")
        self.assertEqual(result.name, "O'Neil")
        self.assertEqual(validate_request("GET", "/profile?name=%2527").name, "%27")
        self.blocked("GET", "/%2570rofile?name=alice", status=404)

    def test_duplicate_and_extra_query_parameters(self):
        for query in ["name=alice&name=bob", "%6eame=alice&name=bob",
                      "name=alice&admin=true", "name=alice&__proto__=x", ""]:
            self.blocked("GET", "/profile?" + query)

    def test_route_method_and_encoding_rejection(self):
        self.blocked("DELETE", "/profile?name=alice", status=405)
        for target in ["/../profile?name=alice", "/api/profile?name=alice"]:
            self.blocked("GET", target, status=404)
        for target in ["https://outside.example/profile?name=alice",
                       "//outside.example/profile?name=alice",
                       "/profile?name=%ZZ", "/profile?name=%FF",
                       "/profile?name=alice#fragment", "/profile?name=bad name"]:
            self.blocked("GET", target)

    def test_name_boundaries_and_schema(self):
        for name in ["", "A" * 65, "alice\x00", "alice\n"]:
            with self.assertRaises(GuardRejected):
                self.get(name)
        for value in [{}, {"name": 1}, {"name": None}, {"name": []},
                      {"name": {"nested": "x"}}, {"name": "alice", "admin": True},
                      {"name": "alice", "__proto__": {"admin": True}}, []]:
            with self.assertRaises(GuardRejected):
                self.post(value)

    def test_duplicate_json_keys_and_parser_limits(self):
        headers = [("Content-Type", "application/json")]
        self.blocked("POST", "/api/profile", headers,
                     b'{"name":"alice","name":"bob"}')
        self.blocked("POST", "/api/profile", headers, b"[" * 8 + b"0" + b"]" * 8)
        self.blocked("POST", "/api/profile", headers, b"x" * (MAX_BODY + 1), 413)
        for body in [b"{", b"\xff", b'{"name":"alice"} trailing']:
            self.blocked("POST", "/api/profile", headers, body)

    def test_content_type_headers_and_body_contract(self):
        self.blocked("POST", "/api/profile", [("Content-Type", "text/plain")], b"{}", 415)
        self.blocked("POST", "/api/profile?name=alice",
                     [("Content-Type", "application/json")], b'{"name":"alice"}')
        self.blocked("GET", "/profile?name=alice", body=b"unexpected")
        self.blocked("GET", "/profile?name=alice",
                     [("Content-Length", "0"), ("content-length", "0")])
        self.blocked("GET", "/profile?name=alice", [("Content-Length", "10")])
        self.blocked("GET", "/profile?name=alice", [("Transfer-Encoding", "chunked")])
        self.blocked("GET", "/profile?name=alice", [("X-Test", "value\r\ninjected")])

    def test_sql_payload_remains_data_not_query_logic(self):
        # A schema cannot label all strings malicious. The SQL sink must bind.
        conn = sqlite3.connect(":memory:")
        try:
            conn.execute("CREATE TABLE profiles(name TEXT, public_label TEXT)")
            conn.executemany("INSERT INTO profiles VALUES (?, ?)",
                             [("alice", "Alice"), ("O'Neil", "ONeil")])
            for name, expected in [("alice", [("Alice",)]),
                                   ("O'Neil", [("ONeil",)]),
                                   ("' OR 1=1 --", [])]:
                validated = self.get(name)
                rows = conn.execute(
                    "SELECT public_label FROM profiles WHERE name = ?",
                    (validated.name,),
                ).fetchall()
                self.assertEqual(rows, expected)
            self.assertEqual(conn.execute("SELECT COUNT(*) FROM profiles").fetchone()[0], 2)
        finally:
            conn.close()


if __name__ == "__main__":
    unittest.main()
