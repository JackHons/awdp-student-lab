# Patch 打包與提交：從修補檔到確認通過

官方尚未公開完整 patch 格式、目錄根路徑、大小、欄位名稱、登入方式及提交端點。下文是**授權課堂靶場範本**，不是 MOCSCTF 的既定接口；先由老師核對平台說明。現有教學原型不能上傳或部署真實 patch。[官方比賽介紹](https://mocsctf2026.mocsctf.com/zh)

流程：**備份 → 修補 → 語法與回歸 → staging → 打包 → 空白目錄驗證 → hash → 提交 → 看 checker → 必要時還原**。

## 1. 確認提交方式與檔案邊界

先記下題目／輪次、截止時間、可改路徑、包格式、根目錄、檔案權限、可否新增檔案／重啟、平台回報方式。以下假設 Bash＋GNU tar 的 Linux／WSL 練習環境，課堂服務根為 `service/`，兩個既有待改檔為 `app/profile.php`、`app/guard.php`。請按老師給的真實目錄調整。

只放必要且獲允許的修改檔。排除旗幟、token、`.env`、SSH 私鑰、資料庫、日誌、備份、`.git`、`node_modules`、快取及非必要 build output；若官方要求 JAR／binary，按規則另建最小產物清單。不要用 `tar ... .` 把整個專案掃進包。

## 2. 備份、修補與本地檢查

在老師提供的課堂工作目錄，**修改前**執行；`backups/` 在服務根及 webroot 外，`r001` 每次換新版本，避免覆蓋舊備份。

```bash
mkdir -p backups/r001/app out/r001
cp -p service/app/profile.php backups/r001/app/profile.php
cp -p service/app/guard.php backups/r001/app/guard.php
```

修改後檢查：

```bash
php -l service/app/profile.php
php -l service/app/guard.php
diff -u backups/r001/app/profile.php service/app/profile.php > out/r001/profile.diff
diff -u backups/r001/app/guard.php service/app/guard.php > out/r001/guard.diff
```

`diff` 回傳 1 表示有差異，不等於失敗；逐行確認沒有混入憑證或無關修改。Python 題可用 `python -m py_compile PATH_TO_PATCHED_PY` 做語法編譯，該命令不執行模組；`PATH_TO_PATCHED_PY` 必須替換為實際檔案路徑。Java 題使用題目原有建置與測試流程。語法成功不能代替正常／漏洞／邊界回歸，詳見 [Defender 速查](./Defender修補速查.md)。新增檔要記錄「原本不存在」，還原時依清單處理。

## 3. 建立最小 staging 與可重現 tar

每版用新的 staging 目錄。範例包內只應有 `app/guard.php` 與 `app/profile.php`，沒有 `stage/r001/` 或 `service/` 外層。不要自行刪掉官方要求的頂層目錄；根路徑以題目為準。

```bash
mkdir -p stage/r001/app
cp service/app/profile.php stage/r001/app/profile.php
cp service/app/guard.php stage/r001/app/guard.php
chmod 0644 stage/r001/app/profile.php stage/r001/app/guard.php
LC_ALL=C tar --format=ustar --sort=name --mtime='1970-01-01 00:00Z' \
  --owner=0 --group=0 --numeric-owner -cf out/r001/patch.tar \
  -C stage/r001 app/guard.php app/profile.php
tar -tvf out/r001/patch.tar
sha256sum out/r001/patch.tar > out/r001/patch.tar.sha256
```

固定順序、時間、擁有者及權限，使相同輸入可重建相同包；範例僅適用這兩個不需執行權限的檔案。USTAR 亦有名稱限制，正式格式另按主辦說明。[GNU tar 可重現封裝](https://www.gnu.org/software/tar/manual/html_node/Reproducibility.html)

## 4. 解壓前驗證；解壓後再測

先核對完整成員清單，拒絕絕對路徑、`..`、磁碟代號、反斜線、重複名稱、符號／硬連結與非必要特殊檔；限制檔案數及解壓總量。不能只看 `tar -tf`／`unzip -l` 幾行，就直接覆蓋運行目錄。[Python tar 安全說明](https://docs.python.org/3/library/tarfile.html)、[ZIP 驗證說明](https://docs.python.org/3/library/zipfile.html)

此範例嚴格限定兩個普通檔及總共 1 MiB；按已確認清單修改 `allowed`，不可為了讓錯包通過而隨意放寬。

```bash
python3 - <<'PY'
import tarfile
allowed = {"app/guard.php", "app/profile.php"}
with tarfile.open("out/r001/patch.tar", "r:") as archive:
    entries = archive.getmembers()
    names = [entry.name for entry in entries]
    if len(names) != len(allowed) or set(names) != allowed:
        raise SystemExit("錯誤：名稱、數量或重複檔不符合清單")
    if any(not entry.isfile() or entry.size < 0 for entry in entries):
        raise SystemExit("錯誤：只允許普通檔")
    if sum(entry.size for entry in entries) > 1024 * 1024:
        raise SystemExit("錯誤：解壓量超出課堂限制")
print("成員驗證通過")
PY
```

精確名稱 allowlist 已拒絕路徑穿越。若改用 ZIP，須對 `infolist()` 做同樣名稱／重複／解壓量檢查，拒絕目錄、加密及 `external_attr` 表示的連結／特殊檔；再讀取成員確認 CRC／完整性。不可在驗證前直接 `unzip -o` 到服務上。

通過後解壓到**新的空白目錄**：

```bash
PATCH_VERIFY_DIR=$(mktemp -d)
tar -xf out/r001/patch.tar -C "$PATCH_VERIFY_DIR" --no-same-owner --no-same-permissions
diff -r stage/r001 "$PATCH_VERIFY_DIR"
php -l "$PATCH_VERIFY_DIR/app/profile.php"
php -l "$PATCH_VERIFY_DIR/app/guard.php"
sha256sum -c out/r001/patch.tar.sha256
```

在隔離服務副本套用解壓後檔案，重跑正常、漏洞、邊界及啟動檢查。hash 只確認同一份包，不證明修補有效。上傳前再核對題目、輪次與截止時間。

## 5A. 官方平台 multipart：只是一個待替換範本

優先用平台指定的上傳頁面。若主辦方明確允許 CLI，下列所有 `REPLACE_…` 必須由人按官方接口替換；URL、檔案欄位與驗證 header 沒有預設值。若接口採 Cookie／CSRF，改用官方指定流程，不能猜 token 格式。

```bash
PATCH_URL='REPLACE_WITH_OFFICIAL_HTTPS_URL'
PATCH_FILE_FIELD='REPLACE_WITH_OFFICIAL_FILE_FIELD'
PATCH_AUTH_HEADER='REPLACE_WITH_OFFICIAL_AUTH_HEADER_NAME'
read -r -s -p '輸入官方指定的驗證值：' PATCH_AUTH_VALUE
curl --fail-with-body --silent --show-error \
  -H "$PATCH_AUTH_HEADER: $PATCH_AUTH_VALUE" \
  -F "$PATCH_FILE_FIELD=@out/r001/patch.tar;type=application/x-tar" \
  "$PATCH_URL"
unset PATCH_AUTH_VALUE
```

題目／輪次等其他欄位，只有官方要求才按其確切名稱加入；文字欄位宜用 `--form-string`，不要把使用者字串誤當檔案路徑。不要使用 `-k`、把憑證寫進共享腳本，或把含憑證的除錯輸出發給隊友。[curl 官方參數](https://curl.se/docs/manpage.html)

保存提交 ID、版本 hash、伺服器接收時間及 checker 結果。HTTP 成功或「已接收」只是傳輸／排隊完成；等正常功能與漏洞檢查均通過，才可確認防守成果。

## 5B. 老師授權 SSH／SCP：僅限允許此模式的靶場

只有題目或老師明確提供 SSH 部署權限時才用；這不是官方賽制的推定。先由老師核對主機指紋與目標路徑，不關閉 host-key 驗證。檔案送到服務外的 staging，不能直接覆蓋現場服務。

```bash
PATCH_SSH_TARGET='REPLACE_WITH_APPROVED_USER_AT_HOST'
PATCH_REMOTE_STAGE='REPLACE_WITH_APPROVED_STAGING_DIRECTORY'
scp -o StrictHostKeyChecking=yes out/r001/patch.tar \
  "${PATCH_SSH_TARGET}:${PATCH_REMOTE_STAGE}/patch.tar"
```

在獲授權靶機重新驗證 SHA-256、包內容、語法及回歸，再依題目原有部署／重啟方法套用。若原系統支援 release 目錄＋同檔案系統的原子切換，可依老師既有流程操作；單檔 `mv` 不等於整組檔案原子更新，不要臨場改部署架構。[OpenSSH scp](https://man.openbsd.org/scp)

## 6. 失敗時恢復，保留證據

只在老師允許的部署模式／本地副本還原原檔，復核權限及啟動方式，再跑正常案例：

```bash
cp -p backups/r001/app/profile.php service/app/profile.php
cp -p backups/r001/app/guard.php service/app/guard.php
```

線上平台如提供版本回退，應使用其指定功能。保留失敗 checker 與 diff，記下是哪個正常或漏洞案例失敗；下一版換新版本號重新測試、打包及提交。**已傳送、已部署、已通過**是三個不同狀態。
