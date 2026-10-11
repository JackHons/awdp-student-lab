# 部署到 GitHub Pages

這份專案把 `site/` 的網站和 `docs/` 的教材組成 `_site/`，再由 GitHub Actions 發布。它支援專案網站的子目錄網址；可保留中英文切換、學習進度、練習連結及檔案下載。

## 選擇網站位置

| 類型 | Repository 名稱 | 預設網址 |
| --- | --- | --- |
| 專案網站 | 例如 `awdp-student-lab` | `https://USERNAME.github.io/awdp-student-lab/` |
| 個人主網站 | 必須為 `USERNAME.github.io` | `https://USERNAME.github.io/` |

`USERNAME` 是 GitHub 帳戶名稱。一般可用專案網站；已有個人主網站時，毋須覆蓋它。GitHub Free 的 Pages 使用公開 repository；其他方案及組織政策請查看 [GitHub Pages 快速入門](https://docs.github.com/zh/pages/quickstart)。

本專案預定發布為公開 GitHub Pages 網站。老師已確認公開 CyLab Academy 課堂邀請碼 **`C5MWbgu1n`**；網站和教材刻意保留此碼，供學生直接加入課堂。

## 首次發布

1. 在 GitHub 建立空白 repository，或選擇你有寫入權限的 repository。將本資料夾的**全部內容**放到 repository 根目錄，包括隱藏的 `.github/`。若沿用現有 repository，先檢查同名檔案，再合併內容。
2. 將來源提交並推送到 `main`。新建空白 repository 可在本資料夾執行以下命令；先把 `USERNAME` 和 `REPOSITORY` 換成實際名稱。

   ```sh
   git init -b main
   git add .
   git commit -m "Add AWDP student training website"
   git remote add origin https://github.com/USERNAME/REPOSITORY.git
   git push -u origin main
   ```

   若資料夾已是 Git repository，沿用它的分支與 remote 設定，毋須重新執行 `git init` 或 `git remote add`。
3. 開啟 repository 的 **Settings → Pages → Build and deployment → Source**，選擇 **GitHub Actions**。這份 workflow 讀取現有 Pages 設定，沒有使用 PAT，也不會自行啟用 Pages。
4. 開啟 **Actions → Deploy AWDP Student Lab to GitHub Pages**。若首次推送發生在設定 Pages 之前，可按 **Run workflow**，選擇 `main` 再執行。
5. 等待 `build` 和 `deploy` 成功。從部署結果的 `github-pages` 連結，或 **Settings → Pages → Visit site** 開啟實際網址。若環境設有審批規則，依該 repository 的規則核准部署。

每次推送到 `main` 都會重新建置、驗證及發布；也可以手動 **Run workflow**。部署只上傳 `_site/`，來源教材仍在 repository 中。

## 本機建置與預覽

安裝 Node.js 24，於專案根目錄執行：

```sh
node scripts/build-pages.mjs
node scripts/verify-pages.mjs
python3 -m http.server 8000 --directory _site
```

Windows 若使用 Python Launcher，最後一行可改為 `py -m http.server 8000 --directory _site`。開啟 `http://localhost:8000/`。Linux 權限實驗仍需在 Linux 或 Linux VM 執行；網站內的 patch 與回合工具為教學模擬。

## 常見問題

- **Configure Pages 失敗**：先確認 Settings → Pages 的 Source 是 GitHub Actions，並確認帳戶或組織允許 Pages。
- **沒有執行 workflow**：確認 `.github/workflows/pages.yml` 已提交到 `main`，並在 Settings → Actions 檢查 Actions 是否啟用。
- **驗證失敗**：閱讀 `Verify website artifact` 的錯誤，修正來源後重新推送，讓同一套本機驗證先通過。
- **網址或下載 404**：使用部署結果顯示的完整網址，專案網站需包含 repository 子目錄。確認最新部署成功後再重新整理。

工作流程參考 [GitHub Pages 自訂 workflow 官方文件](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。Node.js 設定使用 [官方 setup-node](https://github.com/actions/setup-node) 的 `v7` 和 Node.js 24。
