# Web 與 Pwn 練習路線：自由選擇主修

對象：中學生。更新及來源核對：2026-10-10。以下是教學安排，並非比賽官方題單或計分規則。

Web、Pwn、Defender 可直接開始，無需先完成 Linux 自測。建議全員先練 Linux CLI，或遇到命令問題時返回補學；每位攻擊手都要能向 Defender 解釋漏洞根因和修補後的測試。練習限於題目提供的靶場、自己建立的測試程式或教師分配的環境。

## 1. 建議共同能力

- 能使用 `pwd`、`cd`、`ls`、`cat`、`less`、`grep`、`find`，在題目目錄找到程式碼與日誌。
- 能區分文字檔、壓縮包及 ELF 執行檔，理解 `file` 的輸出。
- 能編輯一個檔案、先備份再修改、用 `diff` 說明修改內容。
- 能閱讀簡單 HTTP request／response，知道 URL 參數、POST body、Cookie、狀態碼的用途。
- 能保存自己的操作與結果，交給隊友重現。

各分流可隨時開始：Web 側重 HTTP 和程式資料流；Pwn 側重 C 和記憶體；Defender 側重最小修補、服務可用、備份與回滾。

## 2. Web：先完成五個入門 Lab，再加深 SSTI

使用 [PortSwigger Web Security Academy](https://portswigger.net/web-security)。Academy 的教材及互動 Lab 免費；本路線以 Burp Suite Community Edition 的 Proxy、HTTP history 和 Repeater 為主，無須先購買 Professional。註冊帳號可保存官方解題進度。安裝及入門從官方 [Getting started](https://portswigger.net/web-security/getting-started) 開始。

以下 Lab 的名稱和連結已逐一核對。SQLi、路徑穿越、存取控制、檔案上傳四題位於官方 [Apprentice 伺服器端學習路線](https://portswigger.net/web-security/learning-paths/server-side-vulnerabilities-apprentice)。本表的排列是中學生教學次序。

| 模組 | 官方 Lab | 學生要回答的問題 | 接到 Defender 的修補方向 |
|---|---|---|---|
| W1 路徑穿越 | [File path traversal, simple case](https://portswigger.net/web-security/file-path-traversal/lab-simple) | 哪個參數變成伺服器的檔案路徑？為何會越過圖片目錄？ | 用固定 ID 對應檔案；必要時驗證允許值、解析實際路徑並檢查是否在指定目錄內。[原理與防禦](https://portswigger.net/web-security/file-path-traversal) |
| W2 存取控制 | [Unprotected admin functionality](https://portswigger.net/web-security/access-control/lab-unprotected-admin-functionality) | 知道管理網址的人，為甚麼就能執行管理操作？ | 每個敏感 request 在伺服器端驗證身分與權限，預設拒絕；隱藏按鈕或網址不能代替授權。[原理與防禦](https://portswigger.net/web-security/access-control) |
| W3 SQL 注入 | [SQL injection vulnerability in WHERE clause allowing retrieval of hidden data](https://portswigger.net/web-security/sql-injection/lab-retrieve-hidden-data) | 輸入如何進入查詢？為甚麼資料變成 SQL 結構的一部分？ | 使用參數化查詢；動態欄名或排序選項改成固定允許清單。[原理與防禦](https://portswigger.net/web-security/sql-injection) |
| W4 XSS | [Reflected XSS into HTML context with nothing encoded](https://portswigger.net/web-security/cross-site-scripting/reflected/lab-html-context-nothing-encoded) | 輸入在回應中的哪個位置？是文字、HTML 還是 JavaScript？ | 按輸出上下文編碼，讓不可信輸入顯示成資料；CSP 是額外防線。[原理與防禦](https://portswigger.net/web-security/cross-site-scripting) |
| W5 檔案上傳 | [Remote code execution via web shell upload](https://portswigger.net/web-security/file-upload/lab-file-upload-remote-code-execution-via-web-shell-upload) | 上傳的檔案為甚麼會由伺服器當作程式執行？ | 限制副檔名及內容、伺服器重新命名、驗證完成才保存，並禁止上傳目錄執行程式。[原理與防禦](https://portswigger.net/web-security/file-upload) |
| W6 SSTI，加深選修 | [Basic server-side template injection](https://portswigger.net/web-security/server-side-template-injection/exploiting/lab-server-side-template-injection-basic) | 使用者輸入是模板的資料，還是被拼成模板程式？ | 固定模板，將輸入當作資料傳入；不要讓使用者提交可執行模板。[原理與防禦](https://portswigger.net/web-security/server-side-template-injection) |

W5 的遠端操作只在自己建立的官方 Lab instance 內完成。W6 官方完整解題包含刪除 Lab 內指定檔案；初學者先做無害的表達式辨識、指出根因和修補設計，再由教師帶領完成 Lab 原定目標。SSTI 算式有結果只是一條線索，仍要辨識模板引擎與程式資料流。

### 三次 Web 課

每次約 90 分鐘；未完成可加練，時間不是通過條件。

| 課次 | 安排 | 課後交付 |
|---|---|---|
| Web 1 | 20 分鐘 HTTP/Burp 操作；25 分鐘 W1；25 分鐘 W2；20 分鐘口頭重現與記錄 | 兩題官方完成紀錄；一份遮去 Cookie、密碼的 request／response；路徑與權限修補草稿 |
| Web 2 | 15 分鐘 SQL/HTML 資料流；30 分鐘 W3；25 分鐘 W4；20 分鐘比較正常與異常回應 | 兩題官方完成紀錄；SQL 拼接與參數化差異；XSS 的輸出上下文及編碼位置 |
| Web 3 | 35 分鐘 W5；20 分鐘上傳防禦；15 分鐘本地最小修補；20 分鐘正常功能與漏洞回歸測試 | W5 官方完成紀錄；本地 patch 與測試表；有餘力再安排 W6 獨立加深課 |

**Web 通過條件：**完成 W1–W5，能不照抄解答口述其中兩題的輸入位置、根因、影響和修補方向；在教師提供的本地相似程式完成一個最小 patch，保留正常功能並阻止原有漏洞重現。官方 Academy 的「Solved」證明解題；本地程式的修補與回歸測試證明修補能力。兩者分別記錄。

## 3. Pwn：C → Stack overflow → Format string

### CyLab Academy 課堂

[開啟指定課堂的作業](https://learn.cylabacademy.org/classrooms/17191/assignments?status=active&page=1)。登入自己的學生帳號；尚未加入課堂時，使用老師提供的邀請碼 **`C5MWbgu1n`**。此入口及邀請碼由老師提供，課堂內題目需登入後查看；本平台不會代為加入或提交答案。


這裡的 **stack overflow** 指棧上的緩衝區溢位，與 Stack Overflow 問答網站無關。先學「輸入寫到哪裡、容量多大、函式怎樣返回」，再做格式字串；初學階段不要求 ROP、heap exploitation 或繞過 canary。

基礎讀物：[picoCTF 官方 CTF Primer](https://primer.picoctf.org/) 第 4 章 Python、第 10 章 C、第 11 章 Binary Exploitation。教材包括記憶體、棧與 GDB 的逐步觀察。格式字串沿用使用者指定的 [CTF Wiki：格式化字串例子](https://ctf-wiki.org/pwn/linux/user-mode/fmtstr/fmtstr-example/)；頁內涉及 GOT、返回地址和盲打的部分留作加深閱讀。

### 題庫入口與選題

2026-10-10 核對時，[picoCTF 官方首頁](https://picoctf.org/)已顯示 CyLab Security Academy；官方 Primer 的帳號及題庫入口指向 [CyLab Security Academy](https://learn.cylabacademy.org/)，Webshell 指向 [官方 Webshell](https://webshell.cylabacademy.org/)。舊 picoGym 入口可能重新導向；學生從官方首頁或 Primer 進入並登入，以頁面當前題庫為準。

以下是按指定學習主題安排的**候選搜尋題名**。公開頁面未能讀取登入後的完整題單，因此不把當前在庫狀態、難度標籤或深層題目 URL 當作已核實資料。教師開課前在官方題庫核對；找不到時，選同主題、有程式碼的入門題，或使用 Primer 的本地小程式。不要沿用網誌中的過期遠端主機與 port。

| 次序 | 在官方題庫搜尋 | 選題目標 | 完成記錄 |
|---|---|---|---|
| P1 | `buffer overflow 0` | 觀察長輸入與有限容量，讀懂提供的 C source | 找出所有沒有檢查容量的輸入或複製位置，記錄崩潰原因 |
| P2 | `buffer overflow 1` | 在了解棧和函式返回後，加深到簡單控制流程題 | 畫出與本題有關的棧示意圖；解釋本地與題目環境差異 |
| P3 | `format string 0` | 先辨識格式字串與普通文字的差別 | 找出使用者可控制的 format；說明正常輸出應如何保留 |
| P4 | `format string 1` | 基礎資訊洩漏題；完成 P1–P3 後再做 | 說明讀取了不應輸出的資訊；交出固定格式字串的修補方案 |

P1–P4 是教學選題方向，不保證官方全部標作 Easy。教師按學生能力調整，先讓學生完成可理解的題，再增加難度。

### 三次 Pwn 課

| 課次 | 安排 | 課後交付 |
|---|---|---|
| Pwn 1 | C 的陣列、指標、字串結尾；十六進制、位元組與 little endian；用 `file` 辨識 ELF；在 GDB 設 breakpoint 並讀取變數 | 一張棧示意圖；正常輸入的執行記錄；指出 `gets`、未檢查容量的 `strcpy` 的問題 |
| Pwn 2 | 完成教師核對後的 P1；再做 P2 或 Primer 本地例子；觀察有界與無界輸入；記錄崩潰位置 | 官方解題紀錄或本地觀察紀錄；根因；容量檢查與正常功能測試 |
| Pwn 3 | 讀 CTF Wiki 的第一個格式字串例子與保護設定；先做 P3/P4；比較 `printf(input)` 與固定格式輸出；介紹 Python/pwntools 的輸入輸出 | 格式字串修補 diff；含 `%` 的正常文字測試；資訊洩漏的回歸測試 |

第一個格式字串例子若超過學生現有能力，先停在「不可信輸入被當作 format」和本地固定格式修補；任意地址寫入及修改 GOT／返回地址由教師另開加深課。

### 工具只學本階段需要的部分

| 工具或概念 | 現階段會用即可 |
|---|---|
| GDB | `break main`、`run`、`next`、`step`、`print`、`backtrace`、`info registers`、`x`、`quit`；以程式附帶的 symbol 和教師指示為準 |
| Python 3 | `str` 和 `bytes` 的差別；讀寫檔案；明確記錄輸入長度；不要把位元組當成任意文字編碼 |
| pwntools | 在本地題目使用 `process`、`sendline`、`recvuntil`，設定 timeout，保存重現記錄；遠端 `remote` 的主機及 port 只取自當前官方題目。[官方文件](https://docs.pwntools.com/en/stable/) |
| NX | 減少資料記憶體被當成程式碼執行的機會 |
| PIE/ASLR | PIE 讓主程式可以在不同位置載入；ASLR 隨機化載入地址，不能把兩者當成相同設定 |
| Stack canary | 協助偵測部分棧記憶體被覆寫；沒有移除輸入長度錯誤本身 |
| RELRO | 加強部分重定位資料的保護；初學先辨識保護狀態，暫不研究繞過 |

安全保護會影響題目的觀察結果；只在教師配置的教學 binary 中依題意觀察，不把「關掉全部保護」當作日常編譯習慣。Pwn 正式修補仍應修掉容量錯誤、格式字串與不必要的洩漏，並保留服務協定。

### 兩道修補辨識題

題 A：為甚麼這一行有問題？

```c
char buf[32];
gets(buf); /* 僅供辨識的漏洞片段 */
```

修補方向是按實際目的使用有界讀入，例如 `fgets(buf, sizeof buf, stdin)`，同時處理讀入失敗、換行與過長輸入的拒絕或截斷規則。32 位元組的 C 字串 buffer 還要留一個位元組給 `\0`。若後面再把內容複製到較小的陣列，仍須檢查該陣列的容量；只改第一個輸入函式不代表整條資料流安全。

題 B：以下兩種寫法的差別是甚麼？

```c
printf(input);         /* 把輸入當成格式字串 */
printf("%s", input);   /* 用固定格式，把輸入當字串資料 */
```

第二種避免使用者控制 format，但仍要求 `input` 是可讀、正確以 `\0` 結尾的字串。回歸測試應包含普通名稱、空輸入、邊界長度、過長輸入、包含 `%` 的普通文字，以及原本造成洩漏或崩潰的測試輸入。

**Pwn 通過條件：**能解釋一個棧溢位和一個格式字串根因，完成至少兩題教師核對的官方入門題或相應 Primer 本地練習，獨立完成一個源碼修補，正常輸入仍能使用、漏洞輸入不再洩漏或破壞記憶體。不要把「程式這次沒有崩潰」當成充分證明。

## 4. 每題交給隊友的一頁筆記

```text
題名／官方連結：
自己的 Lab instance 或本地檔案版本：
正常操作：
重現步驟與輸入：
觀察結果：
漏洞根因（輸入 → 處理 → 危險位置）：
最小修補與 diff：
正常功能測試（預期／實際）：
原有漏洞回歸測試（預期／實際）：
官方完成狀態／教師本地驗收：
回滾方式與限制：
```

筆記不放帳號密碼、session Cookie、私人 key 或仍有效的題目秘密。攻擊手負責可重現證據，Defender 負責程式修補及服務測試；完成後一起進入 patch 打包、核對 hash、上傳到分配的目標伺服器、套用、健康檢查和回滾演練。

## 5. 擴充目錄：20 個 Web Lab + 12 個 Pwn 練習入口

可機讀的中英資料見 [lab-catalog.json](lab-catalog.json)。每筆包含固定 ID、方向、題名、難度、主題、官方 URL、來源和前置說明，另有 `en` 英文內容，可供平台的語言切換使用。

本目錄的「基礎／加深／進階」是針對中學生的**教學分級**，並非逐字複製各平台的難度。連結及題名已讀取官方頁面核對；需要帳號的練習須由學生登入自己的帳號。所有操作均在自己的官方 Lab instance、內建環境或教師指定的練習 VM 內進行。

### 5.1 Web：20 個具體官方 Lab

下列 20 筆都是 PortSwigger 的具體 Lab。提供的連結是題目介紹頁；登入後建立自己的 instance 再練習。題目可能要求使用 Lab 內的管理功能、讀取 Lab 指定檔案或操作 Lab 指定的帳號，請把目標和結果記入練習筆記。

| 編號 | 題目與官方入口 | 教學難度 | 前置與使用方式 |
|---|---|---|---|
| 1 | [檔案路徑穿越：簡單情況](https://portswigger.net/web-security/file-path-traversal/lab-simple) | 基礎 | 前置：Linux 路徑、HTTP GET、Burp Repeater。需 Academy 帳號，在自己的 Lab instance 練習。 |
| 2 | [沒有權限保護的管理功能](https://portswigger.net/web-security/access-control/lab-unprotected-admin-functionality) | 基礎 | 前置：HTTP、登入與授權的差別。只在自己的官方 Lab 執行題目要求的管理操作；需帳號。 |
| 3 | [SQL 注入：WHERE 查詢顯示隱藏資料](https://portswigger.net/web-security/sql-injection/lab-retrieve-hidden-data) | 基礎 | 前置：SELECT、WHERE、字串與 URL 參數。需 Academy 帳號；記錄正常與異常回應差別。 |
| 4 | [反射型 XSS：未編碼的 HTML 內容](https://portswigger.net/web-security/cross-site-scripting/reflected/lab-html-context-nothing-encoded) | 基礎 | 前置：HTML 標籤、搜尋 request／response。需 Academy 帳號；辨識輸入的輸出位置。 |
| 5 | [檔案上傳：伺服器錯誤執行上傳程式](https://portswigger.net/web-security/file-upload/lab-file-upload-remote-code-execution-via-web-shell-upload) | 基礎 | 前置：表單上傳、PHP 與靜態檔案的差別。需 Academy 帳號；僅操作自己的官方 Lab，完成後寫禁止執行與驗證方案。 |
| 6 | [SSTI：基本伺服器端模板注入](https://portswigger.net/web-security/server-side-template-injection/exploiting/lab-server-side-template-injection-basic) | 加深 | 前置：完成 SQLi/XSS，理解模板與資料、ERB 基本語法。需帳號；教師帶領，官方完整目標包含刪除 Lab 指定檔案。 |
| 7 | [SQL 注入：登入繞過](https://portswigger.net/web-security/sql-injection/lab-login-bypass) | 基礎 | 前置：完成 WHERE 隱藏資料題、了解登入表單。需 Academy 帳號；把根因轉成參數化查詢修補。 |
| 8 | [SQL UNION：判斷查詢欄位數量](https://portswigger.net/web-security/sql-injection/union-attacks/lab-determine-number-of-columns) | 加深 | 前置：完成兩題基本 SQLi，理解 UNION 與 NULL。需 Academy 帳號；按此題→文字欄位→其他表資料順序。 |
| 9 | [SQL UNION：找出可顯示文字的欄位](https://portswigger.net/web-security/sql-injection/union-attacks/lab-find-column-containing-text) | 加深 | 前置：完成 UNION 欄位數量題、理解數字與文字型別。需 Academy 帳號；觀察回應而非只背輸入。 |
| 10 | [SQL UNION：讀取其他資料表](https://portswigger.net/web-security/sql-injection/union-attacks/lab-retrieve-data-from-other-tables) | 加深 | 前置：完成 UNION 欄位數量與文字欄位兩題。需 Academy 帳號；只讀取自己 Lab 的練習資料。 |
| 11 | [由 request 參數控制使用者角色](https://portswigger.net/web-security/access-control/lab-user-role-controlled-by-request-parameter) | 基礎 | 前置：完成管理功能題，知道 Cookie 與角色。需 Academy 帳號；辨識由客戶端宣稱的權限。 |
| 12 | [由 request 參數控制使用者 ID](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter) | 基礎 | 前置：登入 session、資源 ID 與使用者關係。需 Academy 帳號；練習伺服器端資源擁有權檢查。 |
| 13 | [路徑穿越：只擋相對路徑仍能被繞過](https://portswigger.net/web-security/file-path-traversal/lab-absolute-path-bypass) | 加深 | 前置：完成簡單路徑穿越，分清絕對與相對路徑。需 Academy 帳號；對照黑名單與實際路徑限制。 |
| 14 | [儲存型 XSS：未編碼的 HTML 內容](https://portswigger.net/web-security/cross-site-scripting/stored/lab-html-context-nothing-encoded) | 基礎 | 前置：完成反射型 XSS，理解留言的保存與再次顯示。需 Academy 帳號；不使用真實個人資料。 |
| 15 | [DOM XSS：document.write 使用 URL 資料](https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-document-write-sink) | 加深 | 前置：反射型 XSS、基本 JavaScript、DOM 與 location.search。需 Academy 帳號；追蹤 source 到 sink。 |
| 16 | [OS 命令注入：簡單情況](https://portswigger.net/web-security/os-command-injection/lab-simple) | 基礎 | 前置：Linux CLI、shell 與程式參數的差別。需 Academy 帳號；對照直接呼叫函式與拼接 shell 字串。 |
| 17 | [SSRF：存取 Lab 伺服器內部服務](https://portswigger.net/web-security/ssrf/lab-basic-ssrf-against-localhost) | 基礎 | 前置：HTTP URL、localhost、伺服器發出的 request。需 Academy 帳號；只操作官方 Lab 指定的內部服務。 |
| 18 | [SSRF：另一個 Lab 後端服務](https://portswigger.net/web-security/ssrf/lab-basic-ssrf-against-backend-system) | 加深 | 前置：完成 localhost SSRF、IP/port、Burp 操作。需帳號；搜尋範圍只限官方題目指定網段，Community Intruder 可能較慢。 |
| 19 | [SSTI：模板程式碼上下文](https://portswigger.net/web-security/server-side-template-injection/exploiting/lab-server-side-template-injection-basic-code-context) | 進階 | 前置：完成基本 SSTI、Python/Tornado 模板閱讀能力。需帳號；選修且由教師帶領，完整目標包含刪除 Lab 指定檔案。 |
| 20 | [CSRF：沒有防禦的跨站操作](https://portswigger.net/web-security/csrf/lab-no-defenses) | 加深 | 前置：HTML form、Cookie、session 與網站來源。需帳號；只用自己官方 Lab 的帳號和 exploit server。 |

### 5.2 Pwn：12 個可用入口

12 筆由 **8 個 pwn.college 課程模組、2 個 ROP Emporium 獨立下載題目、1 個 CTF Wiki 練習參考、1 個 picoCTF／CyLab 題庫入口**組成。課程模組內包含多個實作，題庫入口要登入後選題；不要把入口數當成單題數。

pwn.college 的 [Computing 101](https://pwn.college/computing-101/) 是現行基礎組合語言路線。先按平台「Start Here」完成環境操作，再進入下面的模組；需帳號並遵守平台規則。平台要求學習者不要公開具體解題 walkthrough，課堂筆記可供隊內學習，不公開仍使用中的題目解答。[官方規則](https://pwn.college/)

ROP Emporium 可從題目頁直接下載不同架構的 binary；中學生先用 Linux 練習 VM 的 x86_64 版本，參考 [官方 Beginners' guide](https://ropemporium.com/guide.html)。此路線只選 ret2win 與 split；後者是進階選修，沒有列入初學通過條件。

| 編號 | 題目或課程與官方入口 | 教學難度 | 前置與使用方式 |
|---|---|---|---|
| 1 | [Your First Program：暫存器與第一個程式](https://pwn.college/computing-101/your-first-program/) | 基礎 | 課程模組入口，含 Your First Register 等練習。前置：Linux CLI；登入帳號與接受平台規則後在內建環境開始。 |
| 2 | [Computer Memory：地址與指標](https://pwn.college/computing-101/memory/) | 基礎 | 課程模組入口。前置：Your First Program；先做 Loading From Memory、Dereferencing Pointers。需帳號與內建環境。 |
| 3 | [The Stack：棧的讀寫與操作](https://pwn.college/computing-101/the-stack/) | 基礎 | 課程模組入口。前置：暫存器與記憶體讀寫；做棧值操作並畫出變化，之後才進入棧溢位。需帳號。 |
| 4 | [Software Introspection：觀察程式](https://pwn.college/computing-101/introspecting/) | 基礎 | 課程模組入口。前置：地址、指標、棧；學習在 GDB 檢視執行狀態與記憶體。需帳號。 |
| 5 | [Endian Escapades：位元組次序](https://pwn.college/computing-101/endian-escapades/) | 基礎 | 課程模組入口。前置：十六進制、位元組、基本組合語言；釐清數值與記憶體排列。需帳號。 |
| 6 | [Debugging Refresher：除錯複習](https://pwn.college/computing-101/debugging-refresher/) | 加深 | 課程模組入口。前置：Software Introspection 與程式控制流程；用 breakpoint 和單步觀察檢驗推測。需帳號。 |
| 7 | [Binary Exploitation：第一個棧溢位](https://pwn.college/intro-to-cybersecurity/binary-exploitation/) | 加深 | 課程入口，先選 Your First Overflow (easy)、Precision (easy)、Variable Control (easy)。前置：C 陣列、棧、GDB、位元組。需帳號；後段不是初學門檻。 |
| 8 | [Program Security：記憶體錯誤課程](https://pwn.college/program-security/program-security/) | 進階 | 進階課程入口，下滑到 Memory Corruption。前置：基礎棧溢位、整數型別、PIE/canary；即使題名含 Easy 也不列中學生入門門檻。需帳號。 |
| 9 | [ret2win：返回到指定函式](https://ropemporium.com/challenge/ret2win.html) | 加深 | 具體可下載題目，無帳號要求。前置：棧溢位、GDB、函式返回；在 Linux 練習 VM 選 x86_64 版本。先讀官方 Beginners' guide。 |
| 10 | [split：第一條短 ROP chain](https://ropemporium.com/challenge/split.html) | 進階 | 具體可下載選修題，無帳號要求。前置：完成 ret2win、理解呼叫約定與 NX；適合進一步學習，不列初學通過門檻。 |
| 11 | [CTF Wiki：格式化字串練習例子](https://ctf-wiki.org/pwn/linux/user-mode/fmtstr/fmtstr-example/) | 加深 | 教材與例子入口，並非托管的互動靶場。前置：C printf、位元組、GDB；由教師準備本地題目。先學固定 format，GOT/任意寫入留作選修。 |
| 12 | [picoCTF／CyLab：官方題庫入口](https://learn.cylabacademy.org/) | 基礎 | 官方登入題庫入口，須帳號；不是某一個題目。搜尋 buffer overflow 0/1、format string 0/1 作候選，教師核對當前在庫與難度；未猜題目深層 URL。 |

### 5.3 可直接採用的順序

**Web 主修：**先按第 2 節完成路徑、管理權限、SQL WHERE、反射 XSS、檔案上傳五題；再依序加入 SQL 登入、角色參數、使用者 ID、儲存 XSS、命令注入、localhost SSRF。接著各選一條加深路線：SQL UNION 三連題、路徑絕對地址、DOM XSS、SSRF 後端或 CSRF。SSTI 的兩題排在模板閱讀和基本程式語言理解之後，由教師帶領。

**Pwn 主修建議順序：**Linux CLI 基礎 → C 字串與容量 → Your First Program → Computer Memory → The Stack → Software Introspection → Endian Escapades → Debugging Refresher → Binary Exploitation 中的 Your First Overflow (easy)、Precision (easy)、Variable Control (easy)。這三個具體題名均已在官方模組頁核對，可作 pico 題目未準備好時的可用路線。然後選 ret2win、CTF Wiki 格式字串例子或教師核對的 pico 格式字串題；split 與 Program Security 留作進階選修。

每完成一個主題，至少交一份「重現 → 根因 → 最小修補 → 正常與漏洞回歸測試」記錄。Web 主修與 Pwn 主修各完成第 2／3 節的通過條件後，即可與 Defender 進入 patch 打包、上傳與回滾演練；不要求先做完整份加深目錄。

**來源核對範圍：**核對的是公開官方介紹頁、實驗題名、課程內容與入口，未登入代學生解題，亦未實際驗證學生個人環境。pico 題庫登入後的候選題名維持第 3 節所列的課前核對要求。
