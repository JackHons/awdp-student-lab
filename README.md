# AWDP Lab｜中學生攻防練習室

可部署到 GitHub Pages 的中英文備賽網站：Linux CLI、檔案權限、下載實驗、Web、Pwn、Defender，以及 patch 打包與攻防演練。

Web／Pwn／Defender 可直接使用；Linux 自測與實作確認只記錄個人進度。介面語言和進度儲存在當前瀏覽器，新 GitHub Pages 網域不會自動帶入原網站的紀錄。

## 專案內容

- `site/`：HTML、CSS、JavaScript 和下載教材。
- `docs/`：可編輯的講義、20 個 Web labs、12 個 Pwn 入口、11 節 Defender 教學及實驗生成器。
- `scripts/build-pages.mjs`：整理 `_site/`，同步教材及 JSON 目錄。
- `scripts/verify-pages.mjs`：檢查 JavaScript、資源、下載及專案路徑相容性。
- `.github/workflows/pages.yml`：推送到 `main` 後自動驗證和部署到 GitHub Pages。
- [DEPLOYMENT.md](DEPLOYMENT.md)：建立倉庫、設定 Pages 及查看發布結果。

## 本地預覽

需要 Node.js 24（或相容的 Node.js）和 Python 3；無需安裝 npm 套件。

```sh
node scripts/build-pages.mjs
node scripts/verify-pages.mjs
python3 -m http.server 5173 --directory _site --bind 127.0.0.1
```

瀏覽 `http://127.0.0.1:5173/`。Windows 可把 `python3` 換成 `python`。

修改網頁時編輯 `site/`；修改講義和資源目錄時編輯 `docs/`，再重新 build。`_site/` 是產物，無需提交到倉庫。

## 教學內容

- [Linux CLI 入門](docs/Linux-CLI入門.md)及[實驗操作](docs/Linux實驗操作.md)：命令提示、權限、strings／grep、Base64 和 sudo／chmod 練習。
- [Web／Pwn 路線](docs/Web與Pwn練習路線.md)：PortSwigger、pwn.college、CTF Wiki、picoCTF／CyLab Academy 課堂。
- [Defender 修補速查](docs/Defender修補速查.md)：備份還原、WAF、SQLi、SSTI、PHP、Java、上傳及審計。
- [Patch 打包與提交](docs/Patch打包與提交.md)、[備賽指南](docs/備賽指南.md)及[平台設計](docs/平台設計.md)。

課程依據 [CAEP 公告](https://www.caep.edu.mo/latestNoticeDetail/129)和 [MOCSCTF 2026](https://mocsctf2026.mocsctf.com/zh)設計；公告差異和未知事項見[來源核對](research/competition-notes.md)。

## Hosting 與練習紀錄

這是靜態教學平台：旗幟答案、修補檢查和演練分數由瀏覽器處理，沒有學生帳號、正式靶機、patch 上傳或跨裝置進度。GitHub Pages 部署流程只發布 `_site/`。

本專案用於公開的 GitHub Pages 網站。依老師確認，Pwn 內容刻意保留 CyLab Academy 課堂連結及邀請碼 **`C5MWbgu1n`**，供學生直接加入。
