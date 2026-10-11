# Defender 修補速查：保住功能，也阻止漏洞

適合中學生在老師授權的隔離靶場使用。目標是「正常功能成功＋漏洞不能重現」，不是封鎖所有請求。正式比賽的修補範圍、check／exp 與分數，以主辦方為準；目前原型的檢查只是教學模擬。[比賽規則](https://mocsctf2026.mocsctf.com/zh)

## 一輪的修補順序

1. **備份**：保存原始檔、版本、權限及正常請求結果；備份放在 webroot 外，切勿公開 `.bak` 或原始碼。
2. **重現**：只測指定目標，以最小案例確認影響；不讀真實學生資料，不修改旗幟或妨礙其他隊伍。
3. **追資料流**：找輸入入口 → 轉換／解碼 → 權限判斷 → 危險操作 → 輸出。搜尋結果是線索，不是漏洞判定。
4. **改根因**：一次處理一個原因，記錄修改目的。先跑語法檢查，再跑正常、漏洞及邊界案例。
5. **提交與復原**：保存 diff、包的 SHA-256 與平台回報。失敗時依版本還原，不在慌亂中連續改多處。[完整提交流程](./Patch打包與提交.md)

程式碼審計可先用 `rg -n 'eval\(|unserialize\(|readObject\(|from_string\(|render_template_string\(|executeQuery\(|__proto__|ProcessBuilder' app/` 找需閱讀的地方，再追查是否受輸入控制。還要檢查登入、物件歸屬、路徑、錯誤處理及維護功能。[OWASP 程式碼審查](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html)

## 常見問題與最小修補

| 問題 | 先看甚麼 | 修補方向與回歸 |
| --- | --- | --- |
| PHP 弱型別 | `==`、`in_array()` 非嚴格模式、輸入可能是陣列 | 先檢查預期型別，再用 `===`／嚴格模式；測 `0`、`"0"`、空值、陣列與正常值。PHP 版本會影響比較結果，不能背一條舊版繞過規則。[PHP 比較表](https://www.php.net/manual/en/types.comparisons.php) |
| PHP 反序列化 | `unserialize()` 收到 Cookie／請求資料 | 改用有 schema 的 JSON；`allowed_classes=false` 不代表可以安全反序列化不可信輸入。[PHP 手冊](https://www.php.net/manual/en/function.unserialize.php) |
| SQL 注入 | 將輸入串接到 SQL，或讓使用者控制排序欄位 | 值用預備語句綁定；表／欄位／排序方向映射到固定允許集合。資料庫最低權限，敏感紀錄另做身份及歸屬檢查。[OWASP SQLi](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) |
| SSTI | 把輸入拼成模板，或再次解析模板字串 | 使用固定模板，輸入只作變數；模板名稱用固定映射。HTML autoescape 防 XSS，不能防已被解析的模板注入；不把秘密或服務物件放進 render context。[OWASP SSTI](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Template_Injection_Prevention_Cheat_Sheet.html)、[Jinja 設定](https://jinja.palletsprojects.com/en/stable/api/) |
| 原型污染 | 深層 merge、動態鍵、`__proto__`／`constructor.prototype` | 用完整巢狀 schema 拒絕額外鍵；只複製允許的自有欄位，字典可用 `Map` 或 `Object.create(null)`；更新有漏洞套件。只擋 `__proto__` 並不完整。[OWASP 指南](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html) |
| 檔案上傳 | 信任副檔名／Content-Type／使用者檔名 | 允許必要格式，檢查內容與大小，伺服器產生檔名，存 webroot 外並禁止執行；下載仍需權限。ZIP 另限制解壓大小及路徑，不以改副檔名代替檢查。[OWASP 上傳](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) |
| Java | `ObjectInputStream.readObject()`、SQL 串接、將輸入交給命令／反射 | 不反序列化不可信資料；必要時啟用情境限定的類別 allowlist 及深度、數量、位元組上限，預設並未自動啟用。[Oracle JDK 17 指南與篩選規則](https://docs.oracle.com/en/java/javase/17/core/serialization-filtering1.html)。SQL 用 [PreparedStatement](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/PreparedStatement.html)；優先用程式庫取代 shell，必要時參數分開並限制選項。[OWASP 命令防護](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html) |

秘密 token 比對應先確認輸入是字串，再按用途使用 [hash_equals($known, $input)](https://www.php.net/manual/en/function.hash-equals.php)；密碼用 [password_verify()](https://www.php.net/manual/en/function.password-verify.php)，不要以嚴格比較自行替代密碼雜湊驗證。

## 可以直接註解／刪除危險語句嗎？

若是不需要的除錯入口或非必要危險分支，且規則允許，可以先移除；若它承擔題目功能，必須補上安全實作。例如移除 `eval()` 後改成「固定動作名稱 → 固定函式」映射，而非整個計算功能都不回應。不要刪除權限檢查、吞掉所有例外或把查詢結果一律清空。修補後仍須跑正常功能；停服務不算成功防守。

## 寫一層教學 WAF：先定義合法請求

WAF／輸入守門只提供額外防線。下游仍須參數化、權限判斷、輸出編碼與安全 API。[OWASP 輸入驗證](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

1. 按路由列出方法、Content-Type、必填／額外欄位、型別、長度及數量；不要讓同一資料在 query／body 出現兩種解釋。
2. 按協定解碼一次，必要時依欄位做 Unicode 正規化；把已驗證的結果交給業務層，後面不可再解碼。不要反覆解碼直到看起來正常。
3. 在緩衝／解析前限制 body 大小；限制 JSON 深度、參數數量。重複 query／JSON 鍵及安全相關單值 header 要有一致拒絕策略，避免前後端各取第一／最後一個值。
4. 不用 `union`、引號或大括號黑名單取代修補。合法姓名 `O'Neil` 應可用；文字中的 SQL／模板符號可作資料，不能變成可執行語法。
5. 拒絕時回報簡短原因碼；日誌不記完整 body、旗幟、token 或密碼。錯誤處理不能放行未驗證資料。

[waf_guard.py](./exercises/waf_guard.py) 是只供本地函式測試的原創守門練習：GET `/profile?name=…`、POST `/api/profile` JSON。它不啟動伺服器，不是生產 WAF，沒有身份驗證、HTTP framing、速率限制、multipart 或網絡層防護；範例值保留為資料，下游不能當作 SQL／HTML／命令使用。

在包含 `docs` 的專案根目錄執行：

```bash
python -m unittest discover -s docs/exercises -p 'test_waf_guard.py' -v
```

練習用例包含正常中文／單引號姓名、單次解碼、重複參數與 JSON 鍵、額外原型鍵、過大／過深 body、非法格式及方法；另用記憶體 SQLite 驗證注入文字即使通過姓名 schema，也只作查詢資料。

## 修補前後的驗收表

| 類別 | 必測案例 |
| --- | --- |
| 正常 | 每個必要路由、合法姓名、登入及權限允許流程、成功上傳與下載 |
| 漏洞 | 原始最小重現案例；結果不可超出授權資料、模板符號不被執行、物件原型未被改動 |
| 邊界 | 缺欄位、空值、錯型別、重複鍵、長度上下界、壞編碼、解析錯誤、超大／過深輸入 |
| 復原 | 同一 patch 可重新套用；還原後必要功能可啟動；再修補及回歸可重現 |

隊友複核時說清楚：「入口是哪裏、危險操作是哪裏、為何修補有效、哪個正常案例證明功能仍可用。」

## 分項教學：11 個練習單元

以下是備賽教學設計，不代表主辦方已公布同名題目。可直接按語言與服務需要選擇練習，無需先完成 Linux 自測。Linux 建議作為共同基礎；遇到命令、路徑或權限問題時，可回到對應教材補練。自測與實作自評仍記錄實際完成情況。每次只在老師授權的本地副本操作；每項都需保存正常、漏洞及邊界測試的結果。

平台對應資料為 [defender-resources.json](./defender-resources.json)，包含相同單元的完整中英文文案。官方資料於 2026-10-10 核對；範例為原創教學改寫，實際 API 請對照靶場版本。Java 參考頁明確使用 JDK 17 文檔，不能假設其他環境已有相同配置。

### 01 · 通用備份與還原

修補前先保存可回復的版本；備份成功要靠還原演練證明。

1. 先記下服務版本、檔案權限與一個正常請求的結果；確認備份位置在 webroot 外，目的路徑尚不存在。
2. 在自己建立的練習目錄用 cp -a service service.bak 備份；保留原檔，另在 service.work 上修改，避免備份混入公開網頁。
3. 用 tar -czf service-backup.tar.gz service.bak 封存，再用 tar -tzf service-backup.tar.gz 列出內容、sha256sum service-backup.tar.gz 記下包的摘要。
4. 把自己建立的封存解壓到新的 restore-test 目錄；比較內容、權限與正常功能，確認可回復後才考慮正式修補。

**小練習**：在全新練習目錄建立 service/info.txt，備份後只改 service.work/info.txt；封存備份，再還原到新目錄，寫出每份檔案的用途。

**驗收**：原檔與備份內容相同；修改只在工作副本；封存可列出並還原，還原檔案內容／必要權限與正常功能符合原版本。

**對應資料**：[GNU：cp 備份與屬性](https://www.gnu.org/s/coreutils/manual/html_node/cp-invocation.html)；[GNU：tar 建立、列出與解壓](https://www.gnu.org/software/tar/manual/tar.html)；[GNU：SHA-2 摘要](https://www.gnu.org/s/coreutils/manual/html_node/sha2-utilities.html)。

### 02 · WAF：依合法請求寫守門規則

先描述服務接受甚麼資料，再做結構驗證；下游仍須修補漏洞。

1. 先觀察一個正常路由：列出方法、Content-Type、必填欄位、型別與長度，保留中文及 O'Neil 這類合法姓名。
2. 讓守門層和應用採用一致的解析方式；明定重複鍵及額外欄位的處理，按協定解碼一次並傳遞驗證後的資料。
3. 按路由驗证 schema，限制 body 大小、深度和欄位數；拒絕用簡短原因碼，不在日誌記密碼、token 或旗幟。
4. 測正常、缺欄位、錯型別、重複鍵及超長輸入；再確認 SQL 等下游使用安全 API，不能只靠字詞黑名單。

**小練習**：閱讀現有 waf_guard.py 與 test_waf_guard.py；執行本地函式測試，新增一個正常中文姓名與一個重複 name 鍵案例，解釋接受／拒絕的理由。

**驗收**：正常輸入通過；不合 schema 輸入一致拒絕；下游不把文字當語法；學生能說明離線守門函式缺少身份驗證與完整 HTTP／網絡防護。

**對應資料**：[OWASP：輸入驗證](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)；[OWASP：SQL 注入根因修補](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)。

### 03 · 移除危險語句：保留必要功能

先確認功能與規則，再移除不必要的危險入口或用安全實作替換。

1. 找出 eval、shell 呼叫或除錯路由；從請求追到呼叫點，確認哪些輸入受使用者控制，以及正常功能為何需要它。
2. 非必要的除錯入口且規則允許時可關閉；必要功能改成固定動作對應固定函式，優先使用程式庫 API。
3. 若確實需呼叫外部程式，固定程式名稱、分開參數並限制允許的選項；只替特殊符號跳脫仍可能造成參數注入。
4. 檢查語法，重跑正常功能與原最小案例；不能刪權限判斷、吞所有例外或把所有請求回覆成功。

**小練習**：把離線練習中的『執行任意運算字串』改成只接受 add／subtract 與兩個數字的固定映射；設計正常加法、未知動作及錯型別三個案例。

**驗收**：必要計算仍正確；未知動作／錯型別被拒絕；沒有讓輸入變成程式碼；能指出修改前後的資料流。

**對應資料**：[OWASP：OS 命令注入防護](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)；[PHP：eval 警告](https://www.php.net/manual/en/function.eval.php)。

### 04 · PHP：型別與嚴格比較

先確認收到的值是預期型別，再比較；嚴格比較也需要正確輸入規格。

1. 記下 PHP 版本，讀取欄位前處理缺值；觀察同一欄位是否可能收到字串、數字、陣列或 null。
2. 例如 action 預期為字串時，先用 is_string 檢查，再做長度限制；不要把陣列硬轉成字串繼續驗證。
3. 用 === 比較已確認型別的值；集合檢查用 in_array($value, $allowed, true)，必要轉型須先驗證格式。
4. 分別測 0、"0"、空字串、null、陣列與合法值；PHP 版本會影響部分弱比較，不能只背舊版繞過例子。

**小練習**：在本地 PHP 檔用 var_dump 比較 0 == "0" 與 0 === "0"；再寫只接受字串 view／edit 的 action 驗證器，測陣列與缺值。

**驗收**：理解弱比較結果 true、嚴格比較 false；合法 action 可用，缺值／錯型別／未知動作一致拒絕，沒有 PHP 警告洩漏。

**對應資料**：[PHP：比較運算子](https://www.php.net/manual/en/language.operators.comparison.php)；[PHP：in_array 嚴格模式](https://www.php.net/manual/en/function.in-array.php)。

### 05 · PHP：停止反序列化不可信資料

把簡單資料用 JSON 傳遞，再檢查欄位，避免讓請求建立任意 PHP 物件。

1. 搜尋 unserialize，確認輸入來自 Cookie、請求或可被他人修改的檔案；辨認資料需求只是姓名、分數等欄位，還是真的需要物件。
2. 簡單資料改用 JSON；檢查解析失敗，選定陣列／物件模式與合理深度，不讓失敗值流入正常分支。
3. 解析後逐欄確認名稱、型別、範圍及歸屬；例如 score 必須是範圍內整數，不能信任請求自報的 role。
4. 測正常 JSON、壞 JSON、額外欄位及深度上限；allowed_classes=false 不能使不可信 unserialize 輸入變安全。

**小練習**：設計本地 {"name":"阿明","score":80} 資料 schema；拒絕 score 字串、額外 role 與壞 JSON，畫出『解析→驗證→使用』順序。

**驗收**：正常資料可儲存；錯型別／壞格式／多餘欄位不進業務層；身分與權限由服務端判定，沒有請求控制的 unserialize 呼叫。

**對應資料**：[PHP：unserialize 的安全警告](https://www.php.net/manual/en/function.unserialize.php)；[PHP：json_decode 與錯誤／深度](https://www.php.net/manual/en/function.json-decode.php)。

### 06 · SQLi：把查詢語句與資料分開

值用預備語句綁定；查詢結果仍需檢查使用者是否有權讀取。

1. 找 SQL 字串串接的位置，標出哪些片段來自請求；保存正常查詢的結果與使用者權限條件。
2. 值改成 placeholder 與參數綁定，保留 WHERE 中的歸屬／權限條件；不要自己拼引號或只刪 SQL 關鍵字。
3. 表名、欄位與排序方向不能當一般值綁定；用短名稱映射到固定允許的 SQL 片段，資料庫帳號只給必要權限。
4. 用正常姓名、O'Neil、原最小重現及未授權紀錄測試；確認文字是值，不擴大查詢結果或取得他人資料。

**小練習**：在老師提供的本地資料庫把姓名查詢改成綁定參數；為 name／score 排序建立固定映射，測未知排序名稱與包含單引號的正常姓名。

**驗收**：正常查詢不變；單引號姓名正常；注入文字只作資料；未知排序與未授權讀取被拒絕，帳號沒有不必要的資料庫權限。

**對應資料**：[OWASP：SQL 注入防護](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)；[PHP：PDO::prepare 與 placeholder 限制](https://www.php.net/manual/en/pdo.prepare.php)。

### 07 · SSTI：固定模板，輸入只作資料

不要把使用者文字拼進模板來源；模板變數與模板程式碼有不同用途。

1. 找 from_string、render_template_string 或字串模板建構；跟著輸入確認它是變數值，還是被拼進即將解析的模板來源。
2. 用固定模板檔，透過 render(name=input) 傳值；若能選模板，使用固定名稱映射，不讓輸入任意控制模板路徑。
3. render context 只放所需資料；HTML 保持 autoescape，但它處理 XSS 輸出，不能修補已被解析的 SSTI。
4. 測正常文字、{{7*7}}、空值與長度邊界；修補後模板符號應作為文字呈現或按欄位規格拒絕，不能被求值。

**小練習**：在本地 Jinja 歡迎頁建立固定 welcome.html，用 name 變數顯示姓名；提交 {{7*7}} 與一般中文姓名，比較顯示結果。

**驗收**：正常頁面仍可用；{{7*7}} 不計算成 49；輸入不再進入字串到模板 API；能說明 autoescape 與固定模板分別解決甚麼問題。

**對應資料**：[OWASP：SSTI 防護](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Template_Injection_Prevention_Cheat_Sheet.html)；[Jinja：固定模板與 render 變數](https://jinja.palletsprojects.com/en/stable/api/)。

### 08 · 原型污染：限定欄位與合併方式

不讓外來物件任意改寫共用原型；先限制資料形狀再合併。

1. 觀察深層 merge、動態鍵與設定讀取；確認輸入是否能在任何巢狀層加入本來沒有的欄位。
2. 為每層定義允許欄位、型別與深度；拒絕額外鍵，只把允許的自有欄位複製到新設定，並更新有漏洞的合併套件。
3. 字典資料可改用 Map 或 Object.create(null)；Node --disable-proto=throw 可作額外防線，但不能阻止所有 constructor.prototype 路徑。
4. 以老師提供的無破壞案例測合法設定與額外鍵；確認新建的普通物件沒多出屬性，並且原本設定讀取仍可用。

**小練習**：設計只接受 {"theme":"dark","layout":{"columns":2}} 的 schema；測額外管理員欄位及老師提供的巢狀特殊鍵案例，不在全域原型上做修改。

**驗收**：合法巢狀設定可用；額外／特殊鍵被拒絕；新物件原型未變；知道只擋 __proto__ 或加 Node flag 不構成完整修補。

**對應資料**：[OWASP：原型污染防護](https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html)；[Node：--disable-proto 語意](https://nodejs.org/api/cli.html#--disable-protomode)。

### 09 · 上傳：內容、位置與權限一起驗證

副檔名和 Content-Type 由客戶端提供；安全上傳要檢查實際資料與儲存方式。

1. 先寫清楚題目需要的格式、大小與下載權限；觀察是否信任檔名、副檔名或 Content-Type。
2. 只接受必要格式，檢查實際內容及大小，使用更新的解析程式庫；圖片可解碼後再編碼，但仍需資源限制。
3. 伺服器產生新檔名，避免路徑穿越與覆寫；檔案放 webroot 外，不交給腳本執行器，下載由程式檢查權限後提供。
4. 測正常小圖片、偽裝成圖片的純文字、超大檔與未授權下載；PHP move_uploaded_file 確認上傳來源，但不能代替內容檢查且可能覆寫目的檔。

**小練習**：在隔離練習為小 PNG 制定上限與儲存規則；用真正 PNG 和改名 .png 的普通文字測試，記錄內容判定、生成檔名與下載權限結果。

**驗收**：正常圖片上傳／授權下載成功；偽格式／超限拒絕；不可指定路徑或覆寫；上傳內容不被當程式執行，未授權下載失敗。

**對應資料**：[OWASP：檔案上傳防護](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)；[PHP：move_uploaded_file 的作用與覆寫警告](https://www.php.net/manual/en/function.move-uploaded-file.php)。

### 10 · Java：反序列化與輸入邊界

先避開不可信 readObject；必須保留時，明確啟用並驗證情境限定的過濾器。

1. 標記 ObjectInputStream.readObject 的資料來源，同時檢查 SQL 串接及 ProcessBuilder 是否含請求輸入；記下 JDK 與框架版本。
2. 簡單外部資料改用有欄位驗證的資料格式；SQL 用 PreparedStatement，檔案／運算優先用程式庫而不是 shell。
3. 若規格確實需要 Java 物件序列化，啟用適用的 ObjectInputFilter：只允許必要類別，拒絕其他類別，限制深度、陣列、參照及位元組；不能假設預設開啟。
4. 以老師給的合法、非允許類別、超限樣本測過濾器是否真的套用；類別過濾後仍驗證欄位值及權限，檢查服務正常流程。

**小練習**：讀老師提供的 Java import 功能，畫出 readObject 的來源；寫一份類別允許集合與資源上限表，對照三個本地測試樣本，記錄接受／拒絕。

**驗收**：合法功能成功；非允許類別與超限輸入拒絕；有證據顯示 filter 已配置且被呼叫；欄位、權限及例外流程仍有驗證。

**對應資料**：[Oracle：Java 17 序列化過濾器](https://docs.oracle.com/en/java/javase/17/core/serialization-filtering1.html)；[OWASP：SQL 預備語句](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)；[OWASP：避免命令注入](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)。

### 11 · 程式碼審計：從入口追到危險操作

搜尋危險 API 只是線索；還要理解功能、資料流和權限。

1. 先讀正常功能與路由，列出請求、Cookie、檔案等輸入入口；用 rg 找危險 API，但不把每個命中直接叫漏洞。
2. 追入口→解碼／轉換→驗證→權限→危險操作→輸出；標記每一步相信甚麼，特別檢查物件是否屬於目前使用者。
3. 選一個可解釋的根因，寫最小修補及正常、漏洞、邊界測試；檢視 diff，確認沒有誤删必要流程或加入新的信任。
4. 請隊友獨立讀 diff 與測試結果；保留版本、備份、修改理由和還原方法，不能只交『已封鎖』一句話。

**小練習**：在老師提供的 profile(id) 程式畫資料流；即使 id 是合法整數，也檢查它是否屬於登入者，寫正常本人／他人 id／錯型別三個驗收案例。

**驗收**：能指出入口、危險操作及缺失的檢查；本人資料正常，他人資料被拒絕；diff 與測試對得上，隊友能按紀錄還原。

**對應資料**：[OWASP：安全程式碼審查](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Code_Review_Cheat_Sheet.html)；[OWASP：輸入驗證的範圍](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)。

### 把修補理由寫成一張短紀錄

每項練習完成後，請用自己的話填寫，交由隊友複核。『正常／漏洞』須寫實際輸入及結果，不能只寫 pass。

```text
單元與本地練習版本：
入口、使用者可控制的值：
危險操作與根因：
改動與為何能阻止問題：
正常輸入 → 結果：
原漏洞最小案例 → 結果：
邊界輸入 → 結果：
備份位置、還原步驟、隊友複核：
```

若沒有對應語言執行環境，可先做資料流與測試設計；請記錄為『閱讀／設計完成』，不要記成『實作驗收通過』。

