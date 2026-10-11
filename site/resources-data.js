// Generated from verified teaching catalogues.
const labCatalog=[
  {
    "id": "web-path-simple",
    "track": "web",
    "title": "檔案路徑穿越：簡單情況",
    "level": "基礎",
    "topic": "路徑穿越",
    "url": "https://portswigger.net/web-security/file-path-traversal/lab-simple",
    "provider": "PortSwigger",
    "note": "前置：Linux 路徑、HTTP GET、Burp Repeater。需 Academy 帳號，在自己的 Lab instance 練習。",
    "en": {
      "title": "File path traversal, simple case",
      "level": "Foundation",
      "topic": "Path traversal",
      "note": "Prerequisites: Linux paths, HTTP GET and Burp Repeater. An Academy account and your own lab instance are required."
    }
  },
  {
    "id": "web-access-admin",
    "track": "web",
    "title": "沒有權限保護的管理功能",
    "level": "基礎",
    "topic": "存取控制",
    "url": "https://portswigger.net/web-security/access-control/lab-unprotected-admin-functionality",
    "provider": "PortSwigger",
    "note": "前置：HTTP、登入與授權的差別。只在自己的官方 Lab 執行題目要求的管理操作；需帳號。",
    "en": {
      "title": "Unprotected admin functionality",
      "level": "Foundation",
      "topic": "Access control",
      "note": "Prerequisites: HTTP and the difference between authentication and authorization. Perform the required admin operation only in your own official lab; account required."
    }
  },
  {
    "id": "web-sqli-hidden",
    "track": "web",
    "title": "SQL 注入：WHERE 查詢顯示隱藏資料",
    "level": "基礎",
    "topic": "SQL 注入",
    "url": "https://portswigger.net/web-security/sql-injection/lab-retrieve-hidden-data",
    "provider": "PortSwigger",
    "note": "前置：SELECT、WHERE、字串與 URL 參數。需 Academy 帳號；記錄正常與異常回應差別。",
    "en": {
      "title": "SQL injection vulnerability in WHERE clause allowing retrieval of hidden data",
      "level": "Foundation",
      "topic": "SQL injection",
      "note": "Prerequisites: SELECT, WHERE, strings and URL parameters. Academy account required; compare normal and modified responses."
    }
  },
  {
    "id": "web-xss-reflected",
    "track": "web",
    "title": "反射型 XSS：未編碼的 HTML 內容",
    "level": "基礎",
    "topic": "XSS",
    "url": "https://portswigger.net/web-security/cross-site-scripting/reflected/lab-html-context-nothing-encoded",
    "provider": "PortSwigger",
    "note": "前置：HTML 標籤、搜尋 request／response。需 Academy 帳號；辨識輸入的輸出位置。",
    "en": {
      "title": "Reflected XSS into HTML context with nothing encoded",
      "level": "Foundation",
      "topic": "XSS",
      "note": "Prerequisites: HTML tags and search requests/responses. Academy account required; identify where the input is rendered."
    }
  },
  {
    "id": "web-upload-shell",
    "track": "web",
    "title": "檔案上傳：伺服器錯誤執行上傳程式",
    "level": "基礎",
    "topic": "檔案上傳",
    "url": "https://portswigger.net/web-security/file-upload/lab-file-upload-remote-code-execution-via-web-shell-upload",
    "provider": "PortSwigger",
    "note": "前置：表單上傳、PHP 與靜態檔案的差別。需 Academy 帳號；僅操作自己的官方 Lab，完成後寫禁止執行與驗證方案。",
    "en": {
      "title": "Remote code execution via web shell upload",
      "level": "Foundation",
      "topic": "File upload",
      "note": "Prerequisites: form uploads and the difference between PHP and static files. Account required; use only your own official lab and document validation and non-execution defenses."
    }
  },
  {
    "id": "web-ssti-basic",
    "track": "web",
    "title": "SSTI：基本伺服器端模板注入",
    "level": "加深",
    "topic": "SSTI",
    "url": "https://portswigger.net/web-security/server-side-template-injection/exploiting/lab-server-side-template-injection-basic",
    "provider": "PortSwigger",
    "note": "前置：完成 SQLi/XSS，理解模板與資料、ERB 基本語法。需帳號；教師帶領，官方完整目標包含刪除 Lab 指定檔案。",
    "en": {
      "title": "Basic server-side template injection",
      "level": "Intermediate",
      "topic": "SSTI",
      "note": "Prerequisites: SQLi/XSS, templates versus data and basic ERB syntax. Account required; teacher-led. The full official objective deletes a specified file inside the lab."
    }
  },
  {
    "id": "web-sqli-login",
    "track": "web",
    "title": "SQL 注入：登入繞過",
    "level": "基礎",
    "topic": "SQL 注入",
    "url": "https://portswigger.net/web-security/sql-injection/lab-login-bypass",
    "provider": "PortSwigger",
    "note": "前置：完成 WHERE 隱藏資料題、了解登入表單。需 Academy 帳號；把根因轉成參數化查詢修補。",
    "en": {
      "title": "SQL injection vulnerability allowing login bypass",
      "level": "Foundation",
      "topic": "SQL injection",
      "note": "Prerequisites: the hidden-data WHERE lab and login forms. Academy account required; connect the cause to a parameterized-query fix."
    }
  },
  {
    "id": "web-sqli-columns",
    "track": "web",
    "title": "SQL UNION：判斷查詢欄位數量",
    "level": "加深",
    "topic": "SQL 注入",
    "url": "https://portswigger.net/web-security/sql-injection/union-attacks/lab-determine-number-of-columns",
    "provider": "PortSwigger",
    "note": "前置：完成兩題基本 SQLi，理解 UNION 與 NULL。需 Academy 帳號；按此題→文字欄位→其他表資料順序。",
    "en": {
      "title": "SQL injection UNION attack, determining the number of columns returned by the query",
      "level": "Intermediate",
      "topic": "SQL injection",
      "note": "Prerequisites: both basic SQLi labs, UNION and NULL. Account required; continue with the text-column lab, then the other-tables lab."
    }
  },
  {
    "id": "web-sqli-text",
    "track": "web",
    "title": "SQL UNION：找出可顯示文字的欄位",
    "level": "加深",
    "topic": "SQL 注入",
    "url": "https://portswigger.net/web-security/sql-injection/union-attacks/lab-find-column-containing-text",
    "provider": "PortSwigger",
    "note": "前置：完成 UNION 欄位數量題、理解數字與文字型別。需 Academy 帳號；觀察回應而非只背輸入。",
    "en": {
      "title": "SQL injection UNION attack, finding a column containing text",
      "level": "Intermediate",
      "topic": "SQL injection",
      "note": "Prerequisites: the UNION column-count lab and numeric/string types. Account required; explain the response instead of memorizing input."
    }
  },
  {
    "id": "web-sqli-union",
    "track": "web",
    "title": "SQL UNION：讀取其他資料表",
    "level": "加深",
    "topic": "SQL 注入",
    "url": "https://portswigger.net/web-security/sql-injection/union-attacks/lab-retrieve-data-from-other-tables",
    "provider": "PortSwigger",
    "note": "前置：完成 UNION 欄位數量與文字欄位兩題。需 Academy 帳號；只讀取自己 Lab 的練習資料。",
    "en": {
      "title": "SQL injection UNION attack, retrieving data from other tables",
      "level": "Intermediate",
      "topic": "SQL injection",
      "note": "Prerequisites: both UNION column-count and text-column labs. Account required; access only the exercise data in your own lab."
    }
  },
  {
    "id": "web-access-role",
    "track": "web",
    "title": "由 request 參數控制使用者角色",
    "level": "基礎",
    "topic": "存取控制",
    "url": "https://portswigger.net/web-security/access-control/lab-user-role-controlled-by-request-parameter",
    "provider": "PortSwigger",
    "note": "前置：完成管理功能題，知道 Cookie 與角色。需 Academy 帳號；辨識由客戶端宣稱的權限。",
    "en": {
      "title": "User role controlled by request parameter",
      "level": "Foundation",
      "topic": "Access control",
      "note": "Prerequisites: the admin-functionality lab, cookies and roles. Account required; identify authorization claims controlled by the client."
    }
  },
  {
    "id": "web-access-id",
    "track": "web",
    "title": "由 request 參數控制使用者 ID",
    "level": "基礎",
    "topic": "存取控制",
    "url": "https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter",
    "provider": "PortSwigger",
    "note": "前置：登入 session、資源 ID 與使用者關係。需 Academy 帳號；練習伺服器端資源擁有權檢查。",
    "en": {
      "title": "User ID controlled by request parameter",
      "level": "Foundation",
      "topic": "Access control",
      "note": "Prerequisites: login sessions, resource IDs and ownership. Account required; connect the lab to server-side ownership checks."
    }
  },
  {
    "id": "web-path-absolute",
    "track": "web",
    "title": "路徑穿越：只擋相對路徑仍能被繞過",
    "level": "加深",
    "topic": "路徑穿越",
    "url": "https://portswigger.net/web-security/file-path-traversal/lab-absolute-path-bypass",
    "provider": "PortSwigger",
    "note": "前置：完成簡單路徑穿越，分清絕對與相對路徑。需 Academy 帳號；對照黑名單與實際路徑限制。",
    "en": {
      "title": "File path traversal, traversal sequences blocked with absolute path bypass",
      "level": "Intermediate",
      "topic": "Path traversal",
      "note": "Prerequisites: the simple traversal lab and absolute versus relative paths. Account required; compare deny lists with resolved-path restrictions."
    }
  },
  {
    "id": "web-xss-stored",
    "track": "web",
    "title": "儲存型 XSS：未編碼的 HTML 內容",
    "level": "基礎",
    "topic": "XSS",
    "url": "https://portswigger.net/web-security/cross-site-scripting/stored/lab-html-context-nothing-encoded",
    "provider": "PortSwigger",
    "note": "前置：完成反射型 XSS，理解留言的保存與再次顯示。需 Academy 帳號；不使用真實個人資料。",
    "en": {
      "title": "Stored XSS into HTML context with nothing encoded",
      "level": "Foundation",
      "topic": "XSS",
      "note": "Prerequisites: reflected XSS and how comments are saved and rendered. Account required; avoid using real personal information."
    }
  },
  {
    "id": "web-xss-dom",
    "track": "web",
    "title": "DOM XSS：document.write 使用 URL 資料",
    "level": "加深",
    "topic": "XSS",
    "url": "https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-document-write-sink",
    "provider": "PortSwigger",
    "note": "前置：反射型 XSS、基本 JavaScript、DOM 與 location.search。需 Academy 帳號；追蹤 source 到 sink。",
    "en": {
      "title": "DOM XSS in document.write sink using source location.search",
      "level": "Intermediate",
      "topic": "XSS",
      "note": "Prerequisites: reflected XSS, basic JavaScript, the DOM and location.search. Account required; trace the source to the sink."
    }
  },
  {
    "id": "web-command-basic",
    "track": "web",
    "title": "OS 命令注入：簡單情況",
    "level": "基礎",
    "topic": "命令注入",
    "url": "https://portswigger.net/web-security/os-command-injection/lab-simple",
    "provider": "PortSwigger",
    "note": "前置：Linux CLI、shell 與程式參數的差別。需 Academy 帳號；對照直接呼叫函式與拼接 shell 字串。",
    "en": {
      "title": "OS command injection, simple case",
      "level": "Foundation",
      "topic": "OS command injection",
      "note": "Prerequisites: Linux CLI and the difference between shells and program arguments. Account required; compare direct APIs with concatenated shell strings."
    }
  },
  {
    "id": "web-ssrf-local",
    "track": "web",
    "title": "SSRF：存取 Lab 伺服器內部服務",
    "level": "基礎",
    "topic": "SSRF",
    "url": "https://portswigger.net/web-security/ssrf/lab-basic-ssrf-against-localhost",
    "provider": "PortSwigger",
    "note": "前置：HTTP URL、localhost、伺服器發出的 request。需 Academy 帳號；只操作官方 Lab 指定的內部服務。",
    "en": {
      "title": "Basic SSRF against the local server",
      "level": "Foundation",
      "topic": "SSRF",
      "note": "Prerequisites: HTTP URLs, localhost and server-originated requests. Account required; use only the internal service specified in your official lab."
    }
  },
  {
    "id": "web-ssrf-backend",
    "track": "web",
    "title": "SSRF：另一個 Lab 後端服務",
    "level": "加深",
    "topic": "SSRF",
    "url": "https://portswigger.net/web-security/ssrf/lab-basic-ssrf-against-backend-system",
    "provider": "PortSwigger",
    "note": "前置：完成 localhost SSRF、IP/port、Burp 操作。需帳號；搜尋範圍只限官方題目指定網段，Community Intruder 可能較慢。",
    "en": {
      "title": "Basic SSRF against another back-end system",
      "level": "Intermediate",
      "topic": "SSRF",
      "note": "Prerequisites: localhost SSRF, IP/port and Burp. Account required; limit discovery to the range specified by the lab. Community Intruder may be slower."
    }
  },
  {
    "id": "web-ssti-context",
    "track": "web",
    "title": "SSTI：模板程式碼上下文",
    "level": "進階",
    "topic": "SSTI",
    "url": "https://portswigger.net/web-security/server-side-template-injection/exploiting/lab-server-side-template-injection-basic-code-context",
    "provider": "PortSwigger",
    "note": "前置：完成基本 SSTI、Python/Tornado 模板閱讀能力。需帳號；選修且由教師帶領，完整目標包含刪除 Lab 指定檔案。",
    "en": {
      "title": "Basic server-side template injection (code context)",
      "level": "Advanced",
      "topic": "SSTI",
      "note": "Prerequisites: basic SSTI and reading Python/Tornado templates. Account required; teacher-led elective. The full objective deletes a specified lab file."
    }
  },
  {
    "id": "web-csrf-none",
    "track": "web",
    "title": "CSRF：沒有防禦的跨站操作",
    "level": "加深",
    "topic": "CSRF",
    "url": "https://portswigger.net/web-security/csrf/lab-no-defenses",
    "provider": "PortSwigger",
    "note": "前置：HTML form、Cookie、session 與網站來源。需帳號；只用自己官方 Lab 的帳號和 exploit server。",
    "en": {
      "title": "CSRF vulnerability with no defenses",
      "level": "Intermediate",
      "topic": "CSRF",
      "note": "Prerequisites: HTML forms, cookies, sessions and origins. Account required; use only the account and exploit server in your official lab."
    }
  },
  {
    "id": "pwn-first-program",
    "track": "pwn",
    "title": "Your First Program：暫存器與第一個程式",
    "level": "基礎",
    "topic": "組合語言基礎",
    "url": "https://pwn.college/computing-101/your-first-program/",
    "provider": "pwn.college",
    "note": "課程模組入口，含 Your First Register 等練習。前置：Linux CLI；登入帳號與接受平台規則後在內建環境開始。",
    "en": {
      "title": "Your First Program",
      "level": "Foundation",
      "topic": "Assembly foundations",
      "note": "Module with exercises such as Your First Register. Prerequisite: Linux CLI. Sign in, accept the platform rules and start in its provided environment."
    }
  },
  {
    "id": "pwn-memory",
    "track": "pwn",
    "title": "Computer Memory：地址與指標",
    "level": "基礎",
    "topic": "記憶體與指標",
    "url": "https://pwn.college/computing-101/memory/",
    "provider": "pwn.college",
    "note": "課程模組入口。前置：Your First Program；先做 Loading From Memory、Dereferencing Pointers。需帳號與內建環境。",
    "en": {
      "title": "Computer Memory",
      "level": "Foundation",
      "topic": "Memory and pointers",
      "note": "Module entry. Prerequisite: Your First Program. Start with Loading From Memory and Dereferencing Pointers; account and provided environment required."
    }
  },
  {
    "id": "pwn-stack",
    "track": "pwn",
    "title": "The Stack：棧的讀寫與操作",
    "level": "基礎",
    "topic": "棧與暫存器",
    "url": "https://pwn.college/computing-101/the-stack/",
    "provider": "pwn.college",
    "note": "課程模組入口。前置：暫存器與記憶體讀寫；做棧值操作並畫出變化，之後才進入棧溢位。需帳號。",
    "en": {
      "title": "The Stack",
      "level": "Foundation",
      "topic": "Stack and registers",
      "note": "Module entry. Prerequisites: registers and memory access. Practice stack operations and draw the changes before attempting overflows. Account required."
    }
  },
  {
    "id": "pwn-introspection",
    "track": "pwn",
    "title": "Software Introspection：觀察程式",
    "level": "基礎",
    "topic": "GDB",
    "url": "https://pwn.college/computing-101/introspecting/",
    "provider": "pwn.college",
    "note": "課程模組入口。前置：地址、指標、棧；學習在 GDB 檢視執行狀態與記憶體。需帳號。",
    "en": {
      "title": "Software Introspection",
      "level": "Foundation",
      "topic": "GDB",
      "note": "Module entry. Prerequisites: addresses, pointers and the stack. Learn to inspect program execution and memory in GDB; account required."
    }
  },
  {
    "id": "pwn-endian",
    "track": "pwn",
    "title": "Endian Escapades：位元組次序",
    "level": "基礎",
    "topic": "Endianness",
    "url": "https://pwn.college/computing-101/endian-escapades/",
    "provider": "pwn.college",
    "note": "課程模組入口。前置：十六進制、位元組、基本組合語言；釐清數值與記憶體排列。需帳號。",
    "en": {
      "title": "Endian Escapades",
      "level": "Foundation",
      "topic": "Endianness",
      "note": "Module entry. Prerequisites: hexadecimal, bytes and basic assembly. Understand numeric values versus their memory layout; account required."
    }
  },
  {
    "id": "pwn-debugging",
    "track": "pwn",
    "title": "Debugging Refresher：除錯複習",
    "level": "加深",
    "topic": "GDB",
    "url": "https://pwn.college/computing-101/debugging-refresher/",
    "provider": "pwn.college",
    "note": "課程模組入口。前置：Software Introspection 與程式控制流程；用 breakpoint 和單步觀察檢驗推測。需帳號。",
    "en": {
      "title": "Debugging Refresher",
      "level": "Intermediate",
      "topic": "GDB",
      "note": "Module entry. Prerequisites: Software Introspection and program control flow. Test hypotheses using breakpoints and stepping; account required."
    }
  },
  {
    "id": "pwn-first-overflow",
    "track": "pwn",
    "title": "Binary Exploitation：第一個棧溢位",
    "level": "加深",
    "topic": "棧溢位",
    "url": "https://pwn.college/intro-to-cybersecurity/binary-exploitation/",
    "provider": "pwn.college",
    "note": "課程入口，先選 Your First Overflow (easy)、Precision (easy)、Variable Control (easy)。前置：C 陣列、棧、GDB、位元組。需帳號；後段不是初學門檻。",
    "en": {
      "title": "Binary Exploitation: first stack overflows",
      "level": "Intermediate",
      "topic": "Stack overflow",
      "note": "Start with Your First Overflow (easy), Precision (easy) and Variable Control (easy). Prerequisites: C arrays, stack, GDB and bytes. Account required; later exercises are electives."
    }
  },
  {
    "id": "pwn-program-memory",
    "track": "pwn",
    "title": "Program Security：記憶體錯誤課程",
    "level": "進階",
    "topic": "記憶體破壞",
    "url": "https://pwn.college/program-security/program-security/",
    "provider": "pwn.college",
    "note": "進階課程入口，下滑到 Memory Corruption。前置：基礎棧溢位、整數型別、PIE/canary；即使題名含 Easy 也不列中學生入門門檻。需帳號。",
    "en": {
      "title": "Program Security: Memory Corruption",
      "level": "Advanced",
      "topic": "Memory corruption",
      "note": "Advanced module; go to Memory Corruption. Prerequisites: basic overflows, integer types and PIE/canaries. Even tasks named Easy are not beginner requirements. Account required."
    }
  },
  {
    "id": "pwn-ret2win",
    "track": "pwn",
    "title": "ret2win：返回到指定函式",
    "level": "加深",
    "topic": "控制流程",
    "url": "https://ropemporium.com/challenge/ret2win.html",
    "provider": "ROP Emporium",
    "note": "具體可下載題目，無帳號要求。前置：棧溢位、GDB、函式返回；在 Linux 練習 VM 選 x86_64 版本。先讀官方 Beginners' guide。",
    "en": {
      "title": "ret2win",
      "level": "Intermediate",
      "topic": "Control flow",
      "note": "A downloadable challenge with no account requirement. Prerequisites: stack overflow, GDB and function returns. Use x86_64 in a Linux practice VM; read the official beginners' guide first."
    }
  },
  {
    "id": "pwn-split",
    "track": "pwn",
    "title": "split：第一條短 ROP chain",
    "level": "進階",
    "topic": "ROP",
    "url": "https://ropemporium.com/challenge/split.html",
    "provider": "ROP Emporium",
    "note": "具體可下載選修題，無帳號要求。前置：完成 ret2win、理解呼叫約定與 NX；適合進一步學習，不列初學通過門檻。",
    "en": {
      "title": "split",
      "level": "Advanced",
      "topic": "ROP",
      "note": "Downloadable elective with no account requirement. Prerequisites: ret2win, calling conventions and NX. An extension activity, not a beginner pass requirement."
    }
  },
  {
    "id": "pwn-fmt-wiki",
    "track": "pwn",
    "title": "CTF Wiki：格式化字串練習例子",
    "level": "加深",
    "topic": "格式字串",
    "url": "https://ctf-wiki.org/pwn/linux/user-mode/fmtstr/fmtstr-example/",
    "provider": "CTF Wiki",
    "note": "教材與例子入口，並非托管的互動靶場。前置：C printf、位元組、GDB；由教師準備本地題目。先學固定 format，GOT/任意寫入留作選修。",
    "en": {
      "title": "CTF Wiki: format string examples",
      "level": "Intermediate",
      "topic": "Format strings",
      "note": "A reference with examples, not a hosted interactive lab. Prerequisites: C printf, bytes and GDB; teacher prepares local exercises. Start with fixed formats; GOT/arbitrary writes are electives."
    }
  },
  {
    "id": "pwn-pico-library",
    "track": "pwn",
    "title": "picoCTF／CyLab：官方題庫入口",
    "level": "基礎",
    "topic": "Binary Exploitation 題庫",
    "url": "https://learn.cylabacademy.org/",
    "provider": "picoCTF / CyLab",
    "note": "官方登入題庫入口，須帳號；不是某一個題目。搜尋 buffer overflow 0/1、format string 0/1 作候選，教師核對當前在庫與難度；未猜題目深層 URL。",
    "en": {
      "title": "picoCTF / CyLab: official challenge library",
      "level": "Foundation",
      "topic": "Binary Exploitation library",
      "note": "Official library entry; account required, not a single challenge. Search buffer overflow 0/1 and format string 0/1 as candidates; teachers verify availability and difficulty. No guessed deep links."
    }
  }
];
const defenderResources=[
  {
    "id": "backup",
    "title": "通用備份與還原",
    "summary": "修補前先保存可回復的版本；備份成功要靠還原演練證明。",
    "steps": [
      "先記下服務版本、檔案權限與一個正常請求的結果；確認備份位置在 webroot 外，目的路徑尚不存在。",
      "在自己建立的練習目錄用 cp -a service service.bak 備份；保留原檔，另在 service.work 上修改，避免備份混入公開網頁。",
      "用 tar -czf service-backup.tar.gz service.bak 封存，再用 tar -tzf service-backup.tar.gz 列出內容、sha256sum service-backup.tar.gz 記下包的摘要。",
      "把自己建立的封存解壓到新的 restore-test 目錄；比較內容、權限與正常功能，確認可回復後才考慮正式修補。"
    ],
    "links": [
      {
        "label": "GNU：cp 備份與屬性",
        "url": "https://www.gnu.org/s/coreutils/manual/html_node/cp-invocation.html"
      },
      {
        "label": "GNU：tar 建立、列出與解壓",
        "url": "https://www.gnu.org/software/tar/manual/tar.html"
      },
      {
        "label": "GNU：SHA-2 摘要",
        "url": "https://www.gnu.org/s/coreutils/manual/html_node/sha2-utilities.html"
      }
    ],
    "exercise": "在全新練習目錄建立 service/info.txt，備份後只改 service.work/info.txt；封存備份，再還原到新目錄，寫出每份檔案的用途。",
    "check": "原檔與備份內容相同；修改只在工作副本；封存可列出並還原，還原檔案內容／必要權限與正常功能符合原版本。",
    "en": {
      "title": "Backup and restore",
      "summary": "Save a recoverable version before patching, then prove recovery with a restore drill.",
      "steps": [
        "Record the service version, permissions and one normal response. Keep backups outside the webroot and use a new destination.",
        "In your practice directory, copy with cp -a service service.bak. Edit a separate service.work copy and retain the original.",
        "Create service-backup.tar.gz with tar -czf, list it with tar -tzf, and record its sha256sum digest.",
        "Extract your own archive into a new restore-test directory. Compare contents, required permissions and normal behaviour before applying the patch."
      ],
      "links": [
        {
          "label": "GNU: cp and preserved attributes",
          "url": "https://www.gnu.org/s/coreutils/manual/html_node/cp-invocation.html"
        },
        {
          "label": "GNU: create, list and extract tar archives",
          "url": "https://www.gnu.org/software/tar/manual/tar.html"
        },
        {
          "label": "GNU: SHA-2 digests",
          "url": "https://www.gnu.org/s/coreutils/manual/html_node/sha2-utilities.html"
        }
      ],
      "exercise": "Create service/info.txt in a new practice directory. Back it up, edit only service.work/info.txt, archive the backup and restore into a new directory. Explain each copy's purpose.",
      "check": "Original and backup match; only the working copy changes. The archive lists and restores successfully, with original contents, required permissions and normal behaviour."
    }
  },
  {
    "id": "waf",
    "title": "WAF：依合法請求寫守門規則",
    "summary": "先描述服務接受甚麼資料，再做結構驗證；下游仍須修補漏洞。",
    "steps": [
      "先觀察一個正常路由：列出方法、Content-Type、必填欄位、型別與長度，保留中文及 O'Neil 這類合法姓名。",
      "讓守門層和應用採用一致的解析方式；明定重複鍵及額外欄位的處理，按協定解碼一次並傳遞驗證後的資料。",
      "按路由驗证 schema，限制 body 大小、深度和欄位數；拒絕用簡短原因碼，不在日誌記密碼、token 或旗幟。",
      "測正常、缺欄位、錯型別、重複鍵及超長輸入；再確認 SQL 等下游使用安全 API，不能只靠字詞黑名單。"
    ],
    "links": [
      {
        "label": "OWASP：輸入驗證",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
      },
      {
        "label": "OWASP：SQL 注入根因修補",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
      }
    ],
    "exercise": "閱讀現有 waf_guard.py 與 test_waf_guard.py；執行本地函式測試，新增一個正常中文姓名與一個重複 name 鍵案例，解釋接受／拒絕的理由。",
    "check": "正常輸入通過；不合 schema 輸入一致拒絕；下游不把文字當語法；學生能說明離線守門函式缺少身份驗證與完整 HTTP／網絡防護。",
    "en": {
      "title": "WAF: define valid requests",
      "summary": "Describe accepted data before validating its structure. Patch the downstream vulnerability as well.",
      "steps": [
        "Observe a normal route: method, Content-Type, required fields, types and lengths. Preserve legitimate names such as Chinese text and O'Neil.",
        "Use consistent parsing in the guard and application. Define duplicate-key and extra-field handling; decode once and pass the validated result onward.",
        "Validate a route-specific schema; bound body size, depth and field count. Return short reason codes and keep secrets out of logs.",
        "Test normal, missing, mistyped, duplicate and oversized inputs. Confirm downstream operations use safe APIs rather than keyword blocklists."
      ],
      "links": [
        {
          "label": "OWASP: input validation",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
        },
        {
          "label": "OWASP: fixing SQL injection",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
        }
      ],
      "exercise": "Read the existing waf_guard.py and test_waf_guard.py. Run the local function tests; add a normal Chinese name and a duplicate name-key case, then explain each outcome.",
      "check": "Valid requests pass; schema violations are consistently rejected; downstream text remains data. Explain why the offline guard is missing authentication and full HTTP/network protection."
    }
  },
  {
    "id": "dangerous-code",
    "title": "移除危險語句：保留必要功能",
    "summary": "先確認功能與規則，再移除不必要的危險入口或用安全實作替換。",
    "steps": [
      "找出 eval、shell 呼叫或除錯路由；從請求追到呼叫點，確認哪些輸入受使用者控制，以及正常功能為何需要它。",
      "非必要的除錯入口且規則允許時可關閉；必要功能改成固定動作對應固定函式，優先使用程式庫 API。",
      "若確實需呼叫外部程式，固定程式名稱、分開參數並限制允許的選項；只替特殊符號跳脫仍可能造成參數注入。",
      "檢查語法，重跑正常功能與原最小案例；不能刪權限判斷、吞所有例外或把所有請求回覆成功。"
    ],
    "links": [
      {
        "label": "OWASP：OS 命令注入防護",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html"
      },
      {
        "label": "PHP：eval 警告",
        "url": "https://www.php.net/manual/en/function.eval.php"
      }
    ],
    "exercise": "把離線練習中的『執行任意運算字串』改成只接受 add／subtract 與兩個數字的固定映射；設計正常加法、未知動作及錯型別三個案例。",
    "check": "必要計算仍正確；未知動作／錯型別被拒絕；沒有讓輸入變成程式碼；能指出修改前後的資料流。",
    "en": {
      "title": "Remove dangerous statements safely",
      "summary": "Check the required behaviour and rules, then remove unnecessary entry points or replace them with safe implementations.",
      "steps": [
        "Locate eval, shell calls or debug routes. Trace input to the call and explain which values users control and why the feature exists.",
        "Disable unnecessary debug routes when permitted. Replace required dynamic execution with fixed action-to-function mappings or library APIs.",
        "If an external program is necessary, fix its executable, separate arguments and allow only required options. Escaping alone may still allow argument injection.",
        "Check syntax, normal behaviour and the original minimal case. Preserve authorization and meaningful error handling."
      ],
      "links": [
        {
          "label": "OWASP: OS command injection defence",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html"
        },
        {
          "label": "PHP: eval warning",
          "url": "https://www.php.net/manual/en/function.eval.php"
        }
      ],
      "exercise": "Replace arbitrary expression execution in an offline exercise with add/subtract and two numeric operands. Test valid addition, an unknown action and a wrong input type.",
      "check": "Required calculations work; unknown actions and wrong types are rejected; input never becomes code. Explain the changed data flow."
    }
  },
  {
    "id": "php",
    "title": "PHP：型別與嚴格比較",
    "summary": "先確認收到的值是預期型別，再比較；嚴格比較也需要正確輸入規格。",
    "steps": [
      "記下 PHP 版本，讀取欄位前處理缺值；觀察同一欄位是否可能收到字串、數字、陣列或 null。",
      "例如 action 預期為字串時，先用 is_string 檢查，再做長度限制；不要把陣列硬轉成字串繼續驗證。",
      "用 === 比較已確認型別的值；集合檢查用 in_array($value, $allowed, true)，必要轉型須先驗證格式。",
      "分別測 0、\"0\"、空字串、null、陣列與合法值；PHP 版本會影響部分弱比較，不能只背舊版繞過例子。"
    ],
    "links": [
      {
        "label": "PHP：比較運算子",
        "url": "https://www.php.net/manual/en/language.operators.comparison.php"
      },
      {
        "label": "PHP：in_array 嚴格模式",
        "url": "https://www.php.net/manual/en/function.in-array.php"
      }
    ],
    "exercise": "在本地 PHP 檔用 var_dump 比較 0 == \"0\" 與 0 === \"0\"；再寫只接受字串 view／edit 的 action 驗證器，測陣列與缺值。",
    "check": "理解弱比較結果 true、嚴格比較 false；合法 action 可用，缺值／錯型別／未知動作一致拒絕，沒有 PHP 警告洩漏。",
    "en": {
      "title": "PHP: types and strict comparison",
      "summary": "Validate the expected input type before comparing values. Strict comparison still needs a clear input contract.",
      "steps": [
        "Record the PHP version and handle missing fields. Check whether a field can arrive as a string, number, array or null.",
        "For a string action, use is_string and a length limit. Reject arrays instead of forcing them into strings.",
        "Compare validated values with ===; use in_array($value, $allowed, true). Validate format before any required conversion.",
        "Test 0, \"0\", empty strings, null, arrays and valid values. Some loose comparisons differ across PHP versions."
      ],
      "links": [
        {
          "label": "PHP: comparison operators",
          "url": "https://www.php.net/manual/en/language.operators.comparison.php"
        },
        {
          "label": "PHP: strict in_array mode",
          "url": "https://www.php.net/manual/en/function.in-array.php"
        }
      ],
      "exercise": "Use var_dump to compare 0 == \"0\" and 0 === \"0\" locally. Build an action validator accepting only the strings view/edit; test an array and a missing value.",
      "check": "Explain true for the loose comparison and false for the strict one. Valid actions work; missing, mistyped and unknown inputs are consistently rejected without leaked warnings."
    }
  },
  {
    "id": "php-unserialize",
    "title": "PHP：停止反序列化不可信資料",
    "summary": "把簡單資料用 JSON 傳遞，再檢查欄位，避免讓請求建立任意 PHP 物件。",
    "steps": [
      "搜尋 unserialize，確認輸入來自 Cookie、請求或可被他人修改的檔案；辨認資料需求只是姓名、分數等欄位，還是真的需要物件。",
      "簡單資料改用 JSON；檢查解析失敗，選定陣列／物件模式與合理深度，不讓失敗值流入正常分支。",
      "解析後逐欄確認名稱、型別、範圍及歸屬；例如 score 必須是範圍內整數，不能信任請求自報的 role。",
      "測正常 JSON、壞 JSON、額外欄位及深度上限；allowed_classes=false 不能使不可信 unserialize 輸入變安全。"
    ],
    "links": [
      {
        "label": "PHP：unserialize 的安全警告",
        "url": "https://www.php.net/manual/en/function.unserialize.php"
      },
      {
        "label": "PHP：json_decode 與錯誤／深度",
        "url": "https://www.php.net/manual/en/function.json-decode.php"
      }
    ],
    "exercise": "設計本地 {\"name\":\"阿明\",\"score\":80} 資料 schema；拒絕 score 字串、額外 role 與壞 JSON，畫出『解析→驗證→使用』順序。",
    "check": "正常資料可儲存；錯型別／壞格式／多餘欄位不進業務層；身分與權限由服務端判定，沒有請求控制的 unserialize 呼叫。",
    "en": {
      "title": "PHP: avoid untrusted deserialization",
      "summary": "Use JSON for simple data and validate its fields instead of letting requests construct PHP objects.",
      "steps": [
        "Find unserialize calls and trace cookies, requests or externally writable files into them. Identify whether the feature needs simple fields or objects.",
        "Replace simple serialized data with JSON. Handle parse errors, choose array/object mode and set a reasonable depth limit.",
        "Validate field names, types, ranges and ownership. A score must be a bounded integer; client-supplied role is never trusted.",
        "Test valid and malformed JSON, extra fields and depth limits. allowed_classes=false does not make untrusted unserialize input safe."
      ],
      "links": [
        {
          "label": "PHP: unserialize security warning",
          "url": "https://www.php.net/manual/en/function.unserialize.php"
        },
        {
          "label": "PHP: JSON decoding, errors and depth",
          "url": "https://www.php.net/manual/en/function.json-decode.php"
        }
      ],
      "exercise": "Design a local schema for {\"name\":\"阿明\",\"score\":80}. Reject a string score, an extra role and malformed JSON. Draw parse → validate → use.",
      "check": "Valid data is saved; malformed, mistyped and extra fields never reach business logic. The server determines identity and permissions; no request-controlled unserialize call remains."
    }
  },
  {
    "id": "sqli",
    "title": "SQLi：把查詢語句與資料分開",
    "summary": "值用預備語句綁定；查詢結果仍需檢查使用者是否有權讀取。",
    "steps": [
      "找 SQL 字串串接的位置，標出哪些片段來自請求；保存正常查詢的結果與使用者權限條件。",
      "值改成 placeholder 與參數綁定，保留 WHERE 中的歸屬／權限條件；不要自己拼引號或只刪 SQL 關鍵字。",
      "表名、欄位與排序方向不能當一般值綁定；用短名稱映射到固定允許的 SQL 片段，資料庫帳號只給必要權限。",
      "用正常姓名、O'Neil、原最小重現及未授權紀錄測試；確認文字是值，不擴大查詢結果或取得他人資料。"
    ],
    "links": [
      {
        "label": "OWASP：SQL 注入防護",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
      },
      {
        "label": "PHP：PDO::prepare 與 placeholder 限制",
        "url": "https://www.php.net/manual/en/pdo.prepare.php"
      }
    ],
    "exercise": "在老師提供的本地資料庫把姓名查詢改成綁定參數；為 name／score 排序建立固定映射，測未知排序名稱與包含單引號的正常姓名。",
    "check": "正常查詢不變；單引號姓名正常；注入文字只作資料；未知排序與未授權讀取被拒絕，帳號沒有不必要的資料庫權限。",
    "en": {
      "title": "SQLi: separate queries from data",
      "summary": "Bind values with prepared statements, and check whether the user may access the resulting records.",
      "steps": [
        "Find SQL concatenation and mark request-controlled fragments. Save normal results and required authorization conditions.",
        "Replace values with placeholders and bound parameters. Keep ownership checks; do not build quotes or rely on SQL keyword removal.",
        "Map table, column and sort choices to fixed allowed SQL fragments. These identifiers are not ordinary bound values. Use minimum database privileges.",
        "Test normal names, O'Neil, the original minimal case and unauthorized records. Input must remain a value without expanding results."
      ],
      "links": [
        {
          "label": "OWASP: SQL injection prevention",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
        },
        {
          "label": "PHP: PDO::prepare and placeholder limits",
          "url": "https://www.php.net/manual/en/pdo.prepare.php"
        }
      ],
      "exercise": "In a teacher-provided local database, parameterize a name query. Map name/score sorting to fixed choices; test an unknown sort and a legitimate apostrophe in a name.",
      "check": "Normal queries and apostrophe-containing names work. Injection text stays data; unknown sorting and unauthorized reads are rejected, with only necessary database privileges."
    }
  },
  {
    "id": "ssti",
    "title": "SSTI：固定模板，輸入只作資料",
    "summary": "不要把使用者文字拼進模板來源；模板變數與模板程式碼有不同用途。",
    "steps": [
      "找 from_string、render_template_string 或字串模板建構；跟著輸入確認它是變數值，還是被拼進即將解析的模板來源。",
      "用固定模板檔，透過 render(name=input) 傳值；若能選模板，使用固定名稱映射，不讓輸入任意控制模板路徑。",
      "render context 只放所需資料；HTML 保持 autoescape，但它處理 XSS 輸出，不能修補已被解析的 SSTI。",
      "測正常文字、{{7*7}}、空值與長度邊界；修補後模板符號應作為文字呈現或按欄位規格拒絕，不能被求值。"
    ],
    "links": [
      {
        "label": "OWASP：SSTI 防護",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Template_Injection_Prevention_Cheat_Sheet.html"
      },
      {
        "label": "Jinja：固定模板與 render 變數",
        "url": "https://jinja.palletsprojects.com/en/stable/api/"
      }
    ],
    "exercise": "在本地 Jinja 歡迎頁建立固定 welcome.html，用 name 變數顯示姓名；提交 {{7*7}} 與一般中文姓名，比較顯示結果。",
    "check": "正常頁面仍可用；{{7*7}} 不計算成 49；輸入不再進入字串到模板 API；能說明 autoescape 與固定模板分別解決甚麼問題。",
    "en": {
      "title": "SSTI: fixed templates, variable data",
      "summary": "Keep user text out of template source. Template variables and template code serve different purposes.",
      "steps": [
        "Find from_string, render_template_string or template constructors. Trace whether input is a variable value or part of parsed template source.",
        "Use a fixed template file and pass values with render(name=input). Map optional template choices to fixed names.",
        "Expose only required data in the render context. Keep HTML autoescape, but remember it addresses output XSS rather than parsed SSTI.",
        "Test normal text, {{7*7}}, empty values and length boundaries. Template symbols must remain text or be rejected by the field contract."
      ],
      "links": [
        {
          "label": "OWASP: SSTI prevention",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Template_Injection_Prevention_Cheat_Sheet.html"
        },
        {
          "label": "Jinja: templates and render variables",
          "url": "https://jinja.palletsprojects.com/en/stable/api/"
        }
      ],
      "exercise": "Create a local Jinja welcome.html and display a name variable. Submit {{7*7}} and a normal Chinese name; compare their output.",
      "check": "Normal rendering works; {{7*7}} does not become 49. Input never reaches a string-to-template API. Explain the separate purposes of autoescape and fixed templates."
    }
  },
  {
    "id": "prototype-pollution",
    "title": "原型污染：限定欄位與合併方式",
    "summary": "不讓外來物件任意改寫共用原型；先限制資料形狀再合併。",
    "steps": [
      "觀察深層 merge、動態鍵與設定讀取；確認輸入是否能在任何巢狀層加入本來沒有的欄位。",
      "為每層定義允許欄位、型別與深度；拒絕額外鍵，只把允許的自有欄位複製到新設定，並更新有漏洞的合併套件。",
      "字典資料可改用 Map 或 Object.create(null)；Node --disable-proto=throw 可作額外防線，但不能阻止所有 constructor.prototype 路徑。",
      "以老師提供的無破壞案例測合法設定與額外鍵；確認新建的普通物件沒多出屬性，並且原本設定讀取仍可用。"
    ],
    "links": [
      {
        "label": "OWASP：原型污染防護",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html"
      },
      {
        "label": "Node：--disable-proto 語意",
        "url": "https://nodejs.org/api/cli.html#--disable-protomode"
      }
    ],
    "exercise": "設計只接受 {\"theme\":\"dark\",\"layout\":{\"columns\":2}} 的 schema；測額外管理員欄位及老師提供的巢狀特殊鍵案例，不在全域原型上做修改。",
    "check": "合法巢狀設定可用；額外／特殊鍵被拒絕；新物件原型未變；知道只擋 __proto__ 或加 Node flag 不構成完整修補。",
    "en": {
      "title": "Prototype pollution: safe fields and merging",
      "summary": "Validate external object shapes before merging so they cannot alter shared prototypes.",
      "steps": [
        "Inspect deep merges, dynamic keys and configuration reads. Check whether input can add unexpected fields at any nested level.",
        "Define allowed fields, types and depth at every level. Reject extras, copy only allowed own properties, and update vulnerable merge dependencies.",
        "Use Map or Object.create(null) for dictionaries where appropriate. Node --disable-proto=throw adds protection but cannot stop every constructor.prototype path.",
        "Test valid settings and teacher-provided harmless extra-key cases. New ordinary objects must stay unchanged and normal configuration reads must work."
      ],
      "links": [
        {
          "label": "OWASP: prototype pollution prevention",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html"
        },
        {
          "label": "Node: --disable-proto semantics",
          "url": "https://nodejs.org/api/cli.html#--disable-protomode"
        }
      ],
      "exercise": "Design a schema for {\"theme\":\"dark\",\"layout\":{\"columns\":2}}. Test an extra administrator field and teacher-provided nested special keys without modifying global prototypes.",
      "check": "Valid nested settings work; extra/special keys are rejected; new objects retain their original prototype. Explain why blocking only __proto__ or adding a Node flag is insufficient."
    }
  },
  {
    "id": "upload",
    "title": "上傳：內容、位置與權限一起驗證",
    "summary": "副檔名和 Content-Type 由客戶端提供；安全上傳要檢查實際資料與儲存方式。",
    "steps": [
      "先寫清楚題目需要的格式、大小與下載權限；觀察是否信任檔名、副檔名或 Content-Type。",
      "只接受必要格式，檢查實際內容及大小，使用更新的解析程式庫；圖片可解碼後再編碼，但仍需資源限制。",
      "伺服器產生新檔名，避免路徑穿越與覆寫；檔案放 webroot 外，不交給腳本執行器，下載由程式檢查權限後提供。",
      "測正常小圖片、偽裝成圖片的純文字、超大檔與未授權下載；PHP move_uploaded_file 確認上傳來源，但不能代替內容檢查且可能覆寫目的檔。"
    ],
    "links": [
      {
        "label": "OWASP：檔案上傳防護",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html"
      },
      {
        "label": "PHP：move_uploaded_file 的作用與覆寫警告",
        "url": "https://www.php.net/manual/en/function.move-uploaded-file.php"
      }
    ],
    "exercise": "在隔離練習為小 PNG 制定上限與儲存規則；用真正 PNG 和改名 .png 的普通文字測試，記錄內容判定、生成檔名與下載權限結果。",
    "check": "正常圖片上傳／授權下載成功；偽格式／超限拒絕；不可指定路徑或覆寫；上傳內容不被當程式執行，未授權下載失敗。",
    "en": {
      "title": "Upload: validate content, storage and access",
      "summary": "Clients control extensions and Content-Type. Validate actual content and the way files are stored and served.",
      "steps": [
        "Define required formats, size limits and download permissions. Locate code that trusts filenames, extensions or Content-Type.",
        "Accept only required formats and validate content and size with maintained parsers. Image re-encoding still needs resource limits.",
        "Generate filenames on the server; prevent traversal and overwrite. Store outside the webroot, avoid script execution and authorize downloads.",
        "Test a valid small image, disguised text, oversized data and unauthorized downloads. PHP move_uploaded_file checks upload origin, not safe content, and can overwrite destinations."
      ],
      "links": [
        {
          "label": "OWASP: file upload prevention",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html"
        },
        {
          "label": "PHP: move_uploaded_file and overwrite warning",
          "url": "https://www.php.net/manual/en/function.move-uploaded-file.php"
        }
      ],
      "exercise": "Define limits and storage rules for small PNGs in an isolated lab. Test a real PNG and plain text renamed .png; record content checks, generated names and download authorization.",
      "check": "Valid uploads and authorized downloads work. Disguised/oversized files are rejected; clients cannot choose paths or overwrite files; uploaded content never executes and unauthorized downloads fail."
    }
  },
  {
    "id": "java",
    "title": "Java：反序列化與輸入邊界",
    "summary": "先避開不可信 readObject；必須保留時，明確啟用並驗證情境限定的過濾器。",
    "steps": [
      "標記 ObjectInputStream.readObject 的資料來源，同時檢查 SQL 串接及 ProcessBuilder 是否含請求輸入；記下 JDK 與框架版本。",
      "簡單外部資料改用有欄位驗證的資料格式；SQL 用 PreparedStatement，檔案／運算優先用程式庫而不是 shell。",
      "若規格確實需要 Java 物件序列化，啟用適用的 ObjectInputFilter：只允許必要類別，拒絕其他類別，限制深度、陣列、參照及位元組；不能假設預設開啟。",
      "以老師給的合法、非允許類別、超限樣本測過濾器是否真的套用；類別過濾後仍驗證欄位值及權限，檢查服務正常流程。"
    ],
    "links": [
      {
        "label": "Oracle：Java 17 序列化過濾器",
        "url": "https://docs.oracle.com/en/java/javase/17/core/serialization-filtering1.html"
      },
      {
        "label": "OWASP：SQL 預備語句",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
      },
      {
        "label": "OWASP：避免命令注入",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html"
      }
    ],
    "exercise": "讀老師提供的 Java import 功能，畫出 readObject 的來源；寫一份類別允許集合與資源上限表，對照三個本地測試樣本，記錄接受／拒絕。",
    "check": "合法功能成功；非允許類別與超限輸入拒絕；有證據顯示 filter 已配置且被呼叫；欄位、權限及例外流程仍有驗證。",
    "en": {
      "title": "Java: deserialization and input boundaries",
      "summary": "Avoid untrusted readObject. If the specification requires serialization, explicitly configure and verify a narrowly scoped filter.",
      "steps": [
        "Trace data into ObjectInputStream.readObject. Inspect request-controlled SQL and ProcessBuilder arguments; record JDK and framework versions.",
        "Use validated data formats for simple external data, PreparedStatement for SQL and library APIs instead of shells.",
        "If Java serialization is required, enable an ObjectInputFilter allowing only required classes and rejecting others. Bound depth, arrays, references and bytes; filtering is not enabled by default.",
        "Test allowed, disallowed-class and oversized teacher-provided samples. Verify the filter is applied, then validate fields, permissions and normal behaviour."
      ],
      "links": [
        {
          "label": "Oracle: Java 17 serialization filters",
          "url": "https://docs.oracle.com/en/java/javase/17/core/serialization-filtering1.html"
        },
        {
          "label": "OWASP: SQL prepared statements",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
        },
        {
          "label": "OWASP: command injection defence",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html"
        }
      ],
      "exercise": "Trace readObject in a teacher-provided Java import feature. Define an allowed-class set and resource limits; record outcomes for three local samples.",
      "check": "Valid functionality works; disallowed classes and resource excesses are rejected. Show that the filter is configured and called, with field, authorization and error checks preserved."
    }
  },
  {
    "id": "audit",
    "title": "程式碼審計：從入口追到危險操作",
    "summary": "搜尋危險 API 只是線索；還要理解功能、資料流和權限。",
    "steps": [
      "先讀正常功能與路由，列出請求、Cookie、檔案等輸入入口；用 rg 找危險 API，但不把每個命中直接叫漏洞。",
      "追入口→解碼／轉換→驗證→權限→危險操作→輸出；標記每一步相信甚麼，特別檢查物件是否屬於目前使用者。",
      "選一個可解釋的根因，寫最小修補及正常、漏洞、邊界測試；檢視 diff，確認沒有誤删必要流程或加入新的信任。",
      "請隊友獨立讀 diff 與測試結果；保留版本、備份、修改理由和還原方法，不能只交『已封鎖』一句話。"
    ],
    "links": [
      {
        "label": "OWASP：安全程式碼審查",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html"
      },
      {
        "label": "OWASP：輸入驗證的範圍",
        "url": "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
      }
    ],
    "exercise": "在老師提供的 profile(id) 程式畫資料流；即使 id 是合法整數，也檢查它是否屬於登入者，寫正常本人／他人 id／錯型別三個驗收案例。",
    "check": "能指出入口、危險操作及缺失的檢查；本人資料正常，他人資料被拒絕；diff 與測試對得上，隊友能按紀錄還原。",
    "en": {
      "title": "Code review: trace input to sensitive operations",
      "summary": "Dangerous API searches are clues. Understand the feature, data flow and authorization before judging a finding.",
      "steps": [
        "Read normal behaviour and routes. List request, cookie and file inputs; use rg for suspicious APIs without treating every match as a vulnerability.",
        "Trace input → decoding/conversion → validation → authorization → sensitive operation → output. Check ownership as well as types.",
        "Choose one explainable root cause. Make a minimal patch and normal, vulnerability and boundary tests; inspect the diff for removed behaviour or new trust.",
        "Have a teammate independently review the diff and results. Retain version, backup, rationale and restoration instructions."
      ],
      "links": [
        {
          "label": "OWASP: secure code review",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html"
        },
        {
          "label": "OWASP: scope of input validation",
          "url": "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html"
        }
      ],
      "exercise": "Trace a teacher-provided profile(id) function. Even for a valid integer id, check ownership. Define tests for the logged-in user's id, another user's id and a wrong type.",
      "check": "Identify the input, sensitive operation and missing check. Own records work; others are rejected. The diff matches the tests and a teammate can restore using the record."
    }
  }
];
