# Linux CLI 入門：基本指令 → 權限 → 實驗

對象：第一次使用終端機的中學生。先懂指令在做甚麼，再使用選項。這是建議的備賽共同基礎；Web、Pwn、Defender 可隨時開始，也可返回補學命令，隊友仍要懂得讀日誌、備份與交接。[MOCSCTF 官方介紹](https://mocsctf2026.mocsctf.com/zh) 尚不能證明本教材的工具或壓縮格式是正式比賽要求。

老師先準備 Linux VM、普通學生帳號、Python 3.9 以上、`grep`、`less`、`file`、GNU `strings`、GNU `base64`、`cp`、`tar`。以下是 Linux Bash 指令，請勿當作 PowerShell 指令。只操作自己或老師授權的練習檔案。

## 1．先學沒有「-選項」的基本指令

指令常見形式是「名稱、對象」。對象可以是檔案、目錄或要搜尋的文字；先不加入 `-n`、`-a` 等選項。範例路徑稍後會由實驗腳本產生。

| 基本指令 | 意思 | 初學例子 |
|---|---|---|
| `pwd` | 印出目前所在的完整路徑 | `pwd` |
| `ls` | 列出目前目錄中通常可見的名稱 | `ls`、`ls logs` |
| `cd` | 改變所在目錄，屬於 shell 內建指令 | `cd logs`、`cd ..` |
| `cat` | 把文字檔內容送到終端 | `cat service/README.txt` |
| `less` | 分頁閱讀長文字 | `less logs/app.log`；按 q 離開 |
| `grep` | 找出包含符合模式文字的行 | `grep ERROR logs/app.log` |
| `file` | 依檔案內容初步辨識類型 | `file challenge` |
| `strings` | 從附件找可列印文字片段 | `strings challenge`；不執行附件 |
| `base64` | 將資料編成 Base64 文字 | `base64 service/README.txt`；解碼要另加選項 |
| `mkdir` | 建立新目錄 | `mkdir notes`（名稱不存在時） |
| `touch` | 更新時間；不存在時建立空檔 | `touch notes/day1.txt` |
| `cp` | 複製普通檔案；先確認目的檔不存在 | `cp service/README.txt notes/service-copy.txt` |
| `mv` | 移動／改名；先確認新名稱不存在 | `mv notes/day1.txt notes/session1.txt` |
| `echo` | 印出一行文字 | `echo "practice completed"` |
| `man` | 查閱工具手冊 | `man grep`；按 q 離開 |

`~` 是自己的家目錄，`.` 是目前目錄，`..` 是上一層；大小寫不同。路徑有空格時用引號包起來。按 Tab 可補完；上下方向鍵可找以前的指令。複製指令前先理解對象，移動後再 `pwd`。

`grep` 的模式預設是正則表達式；本課先找簡單單詞。`file` 只是辨識線索，不能證明檔案安全。不要直接執行未知附件，或將二進位用 cat 印滿終端。

管道 `|` 把左側標準輸出交給右側：

```bash
cat logs/app.log | grep ERROR
strings challenge | grep 'FLAG{'
```

`>` 會取代既有檔案，`>>` 追加內容；本課不要求用重導向保存旗標。管道通常不傳遞錯誤輸出。[Bash 管道手冊](https://www.gnu.org/software/bash/manual/html_node/Pipelines.html)

## 2．再學 owner／group／others 與 r／w／x

現在才加入第一組選項：

```bash
ls -l permissions/owner-locked.txt
```

假設看到 `---------- 1 student students ... owner-locked.txt`：第一字元 `-` 表示普通檔案；其後九位分成三組，各有 r、w、x。

| 對象 | 位次 | 誰會使用這組普通權限 |
|---|---|---|
| owner（擁有者） | 第 1–3 位 | 檔案擁有者；chmod 中用 u |
| group（群組） | 第 4–6 位 | 符合該檔案群組的使用者；用 g |
| others（其他） | 第 7–9 位 | 不符合 owner／group 的使用者；用 o |

owner 符合時不會因 owner 權限少，便改用較寬的 others 權限。ACL 或其他系統限制可能另有影響；本課用 Linux 原生檔案系統，並實際測試能否開啟。[GNU 權限結構](https://www.gnu.org/s/coreutils/manual/html_node/Mode-Structure.html)

| 權限 | 普通檔案 | 目錄 |
|---|---|---|
| r（read，數值 4） | 讀取內容 | 列出其中的名稱 |
| w（write，數值 2） | 修改內容 | 建立、移除／改名其中 entries；實際通常還需 x |
| x（execute，數值 1） | 作為程式執行（仍取決於格式等條件） | search／穿越，能存取已知的下層路徑 |

讀檔也需要每層父目錄可穿越；檔案沒有 w，不代表它的檔名不能被擁有目錄 w+x 的人移除。這是檔案與目錄權限的差別。

`chmod u+r 檔案` 在 owner 那一組**追加 r**。`u` 是檔案擁有者，不是指「目前登入者」。一般使用者可以 chmod 自己擁有的檔案，即使當下 mode 000 讀不到內容；不能自行 chmod 別人或 root 擁有的檔案。

```bash
chmod u+r permissions/owner-locked.txt
cat permissions/owner-locked.txt
```

`u+w` 追加 owner 寫權；`u+x` 追加 owner 執行權；`u=rw` 將 owner 三位改成 rw-。不要為了「快點能讀」就對整個目錄給所有人權限。[GNU chmod 權限設定](https://www.gnu.org/s/coreutils/manual/html_node/Setting-Permissions.html)

數值是三組分開相加：`600`＝owner 的 4+2、group 的 0、others 的 0，普通檔案顯示 `-rw-------`；`700` 常用於自己的私人目錄；`000` 沒有三組普通權限。**600 不會阻止有相應特權的 root**；sudo 依系統政策授權特定命令。

本課普通 `cat root-vault.txt` 應失敗；老師授權的 `sudo cat root-vault.txt` 才可讀取。這只是以授權特權讀指定檔案，沒有修改權限；不是 `sudo chmod` 全部檔案。生成器、權限完成檢查與第五題一律不用 sudo。

## 3．最後做六題離線實驗

下載 [linux_lab.py](exercises/linux_lab.py)，普通帳號執行 `python3 linux_lab.py`，進入輸出的全新 lab 目錄。詳細設定、學生任務和折疊教師查法見 [Linux 實驗操作](Linux實驗操作.md)。每個 lab 有中文及英文 README。

建議課堂安排：10 分鐘基本指令、15 分鐘權限、35–50 分鐘實驗、10 分鐘口頭交接。

| 次序 | 動手做甚麼 | 學到甚麼 |
|---|---|---|
| 1 | `cat` 接 `grep` 搜尋大量日誌 | 篩選線索與定位原行 |
| 2 | `strings` 接 `grep` 搜尋二進位 | 觀察可列印內容，沒有執行附件 |
| 3 | `less` 看 Base64，再解碼 | 編碼和加密的差別 |
| 4 | 找隱藏檔 | 點開頭名稱與可見性 |
| 5 | 恢復自己檔案的 owner r | mode 000 的真實拒讀與 chmod |
| 6 | 老師先建立 root:root 600 題，再授權 sudo 讀取 | owner 與特權的邊界 |

Windows 只適合驗證生成資料，不能算完成 Linux 權限題。請在 Linux VM 的原生檔案系統重新生成；不要用 sudo 跑整個腳本。第六題只有老師授權的單一 install 建立步驟與指定 sudo cat。

## 4．做完基本操作才記選項

| 延伸指令 | 選項的用途 |
|---|---|
| `ls -la` | l：長列表（權限、owner/group 等）；a：包含點開頭名稱 |
| `grep -n ERROR logs/app.log` | n：加上原檔 1 起算行號；這不是管道輸出的原行號 |
| `grep -F 'literal.text' notes.txt` | F：模式當固定字串，點不再是正則符號 |
| `strings -a challenge` | a：掃描整個檔案 |
| `base64 --decode encoded/message.b64` | 解碼；資料損壞時先查原因 |
| `cp -a service service.bak` | a：遞迴複製，盡量保留屬性；先確認新的備份名稱不存在 |
| `tar -czf practice.tar.gz service.bak` | c：建立、z：gzip、f：接封裝檔名；只包指定假服務副本 |
| `tar -tzf practice.tar.gz` | t：列出內容，先檢查包的路徑與檔案 |

封裝是交接延伸，不要把含旗標的整個 lab 當修補包。正式修補與提交另讀 [Patch 打包與提交](Patch打包與提交.md)；比賽的包格式與上傳接口以主辦公告為準。

六項前端 CLI 自測對應位置、詳細列表、行號、附件辨識、備份、封裝檢查。請先在終端實作，再勾選自評；瀏覽器勾選不證明真實能力，也不會同步官方練習平台。

工具主源：[GNU grep](https://www.gnu.org/s/grep/manual/grep.html)、[GNU Base64](https://www.gnu.org/software/coreutils/manual/html_node/base64-invocation.html)、[GNU strings](https://sourceware.org/binutils/docs/binutils/strings.html)、[GNU ls](https://www.gnu.org/software/coreutils/manual/coreutils.html#What-information-is-listed)。
