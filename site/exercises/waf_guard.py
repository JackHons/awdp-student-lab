"""Original offline request-schema exercise, NOT a production WAF or HTTP server.

Only public profile lookups are modeled. Returned input remains untrusted data:
use SQL parameters, output encoding, and separate authorization downstream.
The caller supplies already framed bytes; a real server must cap body size
before buffering and must use its framework's maintained HTTP parser.
"""

from dataclasses import dataclass
import json
import re
import unicodedata
from urllib.parse import parse_qsl, unquote, urlsplit

MAX_BODY = 4096
MAX_TARGET = 1024
MAX_JSON_DEPTH = 4


class GuardRejected(ValueError):
    def __init__(self, status, reason):
        self.status = status
        self.reason = reason
        super().__init__(reason)


@dataclass(frozen=True)
class ValidatedRequest:
    method: str
    route: str
    name: str


def reject(reason, status=400):
    raise GuardRejected(status, reason)


def check_percent_encoding(text):
    if re.search(r"%(?![0-9a-fA-F]{2})", text):
        reject("bad_percent_encoding")


def validate_name(value):
    if not isinstance(value, str):
        reject("name_must_be_text")
    # The same normalized value is returned to the business layer.
    value = unicodedata.normalize("NFC", value)
    if not 1 <= len(value) <= 64:
        reject("name_length")
    if any(unicodedata.category(char).startswith("C") for char in value):
        reject("name_control_character")
    return value


def check_json_depth(text):
    """Bound nesting before json.loads; syntax is checked by json.loads itself."""
    depth = 0
    in_string = False
    escaped = False
    for char in text:
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
        elif char == '"':
            in_string = True
        elif char in "[{":
            depth += 1
            if depth > MAX_JSON_DEPTH:
                reject("json_too_deep")
        elif char in "]}":
            depth -= 1


def unique_object(pairs):
    values = {}
    for key, value in pairs:
        if key in values:
            reject("duplicate_json_key")
        values[key] = value
    return values


def validate_request(method, raw_target, headers=(), body=b""):
    """Accept only GET /profile?name=... or POST /api/profile JSON.

    Header input is a sequence, preserving duplicates instead of silently
    collapsing them. This toy contract rejects all repeated headers.
    Nothing is sent over a network, and no expression or SQL is executed.
    """
    if method not in {"GET", "POST"}:
        reject("method_not_allowed", 405)
    if not isinstance(body, bytes):
        reject("body_must_be_bytes")
    if len(body) > MAX_BODY:
        reject("body_too_large", 413)
    if not isinstance(raw_target, str) or len(raw_target) > MAX_TARGET:
        reject("target_too_large", 414)
    try:
        raw_target.encode("ascii")
    except UnicodeEncodeError:
        reject("target_must_use_protocol_encoding")
    if any(ord(char) < 33 or ord(char) > 126 for char in raw_target):
        reject("target_control_or_space")
    if not raw_target.startswith("/") or raw_target.startswith("//"):
        reject("origin_form_required")
    parsed = urlsplit(raw_target)
    if parsed.scheme or parsed.netloc or parsed.fragment:
        reject("origin_form_required")
    check_percent_encoding(parsed.path)
    check_percent_encoding(parsed.query)
    try:
        route = unquote(parsed.path, encoding="utf-8", errors="strict")
    except UnicodeDecodeError:
        reject("bad_path_encoding")
    if (method, route) not in {("GET", "/profile"), ("POST", "/api/profile")}:
        reject("route_not_allowed", 404)

    if len(headers) > 16:
        reject("too_many_headers")
    fields = {}
    for key, value in headers:
        if not isinstance(key, str) or not isinstance(value, str):
            reject("bad_header")
        key = key.lower()
        if not re.fullmatch(r"[a-z0-9-]{1,64}", key) or len(value) > 256:
            reject("bad_header")
        if "\r" in value or "\n" in value or key in fields:
            reject("duplicate_or_bad_header")
        fields[key] = value.strip()
    if "transfer-encoding" in fields or "content-encoding" in fields:
        reject("encoding_not_supported")
    if "content-length" in fields:
        length = fields["content-length"]
        if not re.fullmatch(r"[0-9]{1,5}", length) or int(length) != len(body):
            reject("content_length_mismatch")

    if method == "GET":
        if body or "content-type" in fields:
            reject("get_body_not_supported")
        try:
            pairs = parse_qsl(parsed.query, keep_blank_values=True,
                              strict_parsing=True, encoding="utf-8",
                              errors="strict", max_num_fields=4)
        except (ValueError, UnicodeDecodeError):
            reject("bad_query")
        if len(pairs) != 1 or pairs[0][0] != "name":
            reject("query_schema_or_duplicate")
        name = validate_name(pairs[0][1])
    else:
        if parsed.query:
            reject("post_query_not_supported")
        if fields.get("content-type", "").lower() not in {
            "application/json", "application/json; charset=utf-8"
        }:
            reject("content_type_not_allowed", 415)
        try:
            text = body.decode("utf-8", errors="strict")
            check_json_depth(text)
            value = json.loads(text, object_pairs_hook=unique_object)
        except (UnicodeDecodeError, json.JSONDecodeError, RecursionError):
            reject("bad_json")
        if not isinstance(value, dict) or set(value) != {"name"}:
            reject("json_schema")
        name = validate_name(value["name"])
    return ValidatedRequest(method=method, route=route, name=name)
