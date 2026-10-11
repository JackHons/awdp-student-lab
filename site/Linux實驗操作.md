# 可下載 Linux 實驗：六個本地任務

對象：中學生；建議 60–90 分鐘。先讀 [Linux CLI 入門](Linux-CLI入門.md)，再下載 [linux_lab.py](exercises/linux_lab.py)。這是自行設計的離線練習；旗標隨機產生，沒有提交網站。前端的 CLI 自測與實作自評只記錄學習進度，不是能力認證或正式比賽得分。

## 1．生成自己的新實驗

老師準備 Linux VM、Python 3.9 以上，以及 `grep`、`less`、`file`、GNU `strings`、GNU `base64`。學生使用普通帳號，在家目錄內可信、非共用的練習資料夾操作。指令在 Linux Bash 執行；PowerShell 的參數與權限行為不同。

將下載的腳本放進該資料夾，執行：

```bash
python3 linux_lab.py
```

腳本輸出 `LAB DIRECTORY` 與 `NEXT: cd ...`，照輸出的完整路徑進入目錄。每次建立新的 `awdp-linux-隨機識別碼`；不覆蓋舊成果。

```bash
pwd
ls
cat README.md
```

README 同時有中文 `README.md`、英文 `README.en.md`。起始共 50 個檔案，其中 40 個是虛構干擾檔（24 個 archive 日誌、16 個 service 筆記），不含旗標。`manifest.json` 記錄 lab 身份、固定檔名、大小、SHA256 與設定狀態，沒有旗標答案。想指定位置，`--parent` 必須是已存在的私人目錄；`--name` 必須是全新名稱：

```bash
python3 linux_lab.py --parent /home/student/practice --name awdp-linux-class01
```

路徑只是範例，必須換成自己的實際資料夾。若出現 `REFUSED`，先讀錯誤，請老師協助；不要用 sudo 重跑。

## 2．學生任務單

先用沒有 `-` 選項的基本指令建立位置感，再使用下表所需選項。每題記錄「路徑、觀察、指令、為何有效」，不用公開旗標全文。

| 題目 | 檔案與目標 | 完成證據 |
|---|---|---|
| 日誌尋旗 | `logs/app.log`：3000 行虛構紀錄；用 `cat` 接 `grep` 篩選 | 找到旗標並報告原檔行號 |
| 二進位尋旗 | `challenge`：合成二進位資料；用 `file`、`strings` 接 `grep` | 找到可列印線索；沒有執行附件 |
| Base64 | 先用 `less encoded/message.b64` 觀察，按 q 離開，再解碼 | 得到可讀訊息，說明編碼不是加密 |
| 隱藏檔 | 比較 `ls` 與 `ls -a`，尋找點開頭檔案 | 找到檔名及內容，知道隱藏不等於加密 |
| 自己的權限 | `permissions/owner-locked.txt` 起始 mode 000 | 普通 cat 失敗；只加 owner 的 r 後成功 |
| root 的權限 | 設定完成的 `root-vault.txt` 為 root:root、600 | 普通 cat 失敗；老師授權 sudo cat 成功 |

第五題的拒絕必須發生於真實 Linux 檔案權限。Windows 執行腳本只產生可供檢查的資料，第五、六題不啟用。即使從 Windows 路徑進入 WSL，也不能直接假定 NTFS 權限等同 Linux；請在 Linux VM 的原生檔案系統重新生成。

## 3．老師授權建立第六題

生成器不提權、不執行 sudo。第六題先有學生擁有、600 的**準備副本**，此時尚未就緒；請老師先完成設定，學生不要讀取或複製它。README 已填入生成器的實際完整路徑。以下用 `SCRIPT_PATH` 表示它：必須替換成真實腳本路徑，不能原樣貼上。

在 lab 目錄，由普通使用者先執行：

```bash
python3 "SCRIPT_PATH" --root-plan .
```

檢查會拒絕 symlink／junction 路徑、非私人 lab、非指定來源、改動過的來源、既有目的檔（包含斷掉的 symlink）。通過後顯示完整建立指令。**老師授權後**，確認 `pwd` 正是此 lab，且沒有其他人同時修改目錄，再執行下列固定相對路徑的單一步驟：

```bash
sudo install -T -o root -g root -m 600 -- root-setup/root-source.txt root-vault.txt
python3 "SCRIPT_PATH" --finish-root-setup .
ls -l root-vault.txt
cat root-vault.txt
```

finish 必須以普通使用者執行。它核對單一普通檔案、root:root、600，並實際嘗試開啟檔案，確認發生權限拒絕後，只移除指定準備副本；沒有遞迴刪除。其後學生可讀的 README、manifest、準備來源都不含第六旗全文。若失敗，停止第六題，請老師查原因。

預期 `ls -l` 顯示 `-rw-------`，owner 與 group 均為 `root`；普通 `cat` 報 Permission denied。需要讀取時，老師另授權：

```bash
sudo cat root-vault.txt
```

`sudo cat` 只讀此檔；不代表可以 `sudo chmod` 全部檔案。學生可以 chmod 自己擁有的 mode 000 檔案，卻不能普通 chmod root-owned 檔案。若教師需要調整或重建，只處理這個指定檔案。

路徑檢查與人工 install 之間仍可能被同時操作改變；因此限可信私人 VM 目錄，不是競賽秘密儲存方案。學生擁有 lab 目錄時，目錄的 w+x 也可能讓其刪除或替換 root 檔名；請勿用這種方式繞過課程，老師核對原檔案權限。

## 4．教師解答與評量

<details><summary>展開教師查法（不列旗標答案）</summary>

```bash
cat logs/app.log | grep 'FLAG{'
grep -n 'FLAG{' logs/app.log
file challenge
strings -a challenge | grep 'FLAG{'
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

最後的 sudo 必須授權。日誌用 `grep -n` 取得原檔行號；對 `cat` 的輸出再用 grep 無法自動保留原行號。`strings -a` 掃整檔的可列印片段，不執行附件；Base64 解碼失敗要檢查資料，勿直接忽略垃圾字元。

請學生解釋「u 是誰」「rwx 對目錄和檔案有何不同」「為何 root 檔不能普通 chmod」。評量依操作與解釋，不只核對隨機旗標。

</details>

## 5．維護者測試與邊界

在專案根目錄執行，測試不使用 sudo 或網路：

```bash
python3 -B -m unittest discover -s docs/exercises -p test_linux_lab.py -v
```

測試覆蓋新目錄、重跑不覆蓋、危險路徑、旗標提取、合法 Base64、manifest 不洩漏答案；非 root Linux 額外測試 mode 000 真拒讀與 owner 恢復權限。需要作業系統允許 symlink 才能跑該項實測。root:root 第六題的授權 sudo 建立不會由自動測試執行，須老師在 VM 核對。

生成器不聯網、不啟動服務、不修改系統設定、不執行附件、不遞迴刪檔。生成失敗可能留下本次新目錄供檢查；請改用新名稱，不覆蓋重試。不要將整個 lab 包當正式修補包，當中有教學旗標。

## English quick start

Download `linux_lab.py`; run `python3 linux_lab.py` as an ordinary user in a private Linux VM directory. Enter the printed `LAB DIRECTORY` and read `README.en.md`. The six tasks cover logs, printable binary strings, Base64, hidden files, owner permissions and a root-owned vault. Each run creates fresh random flags; no external submission.

Windows is data-only. Permission tasks require regeneration on a native Linux filesystem. A teacher authorizes just the printed `sudo install` command after `--root-plan`; run `--finish-root-setup` without sudo to verify real denied access and remove only the preparation source. Never sudo-run the generator. Use `sudo cat root-vault.txt` only with teacher authorization.

主源：[GNU 權限](https://www.gnu.org/s/coreutils/manual/html_node/Setting-Permissions.html)、[GNU install](https://www.gnu.org/s/coreutils/manual/html_node/install-invocation.html)、[GNU Base64](https://www.gnu.org/software/coreutils/manual/html_node/base64-invocation.html)、[GNU strings](https://sourceware.org/binutils/docs/binutils/strings.html)、[Python 路徑與 symlink](https://docs.python.org/3/library/pathlib.html)。本課的路徑驗證策略由教材自行設計；`install -T` 本身不是完整的 symlink 防護。
