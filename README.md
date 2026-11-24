# 活力健診 (Healthy Form) - 健康諮詢與評估表單網站

專為健康諮詢、體態管理與營養評估設計的現代化響應式單頁網站，支援部署於 **Firebase Hosting**。

---

## 🌟 核心特色

1. **分步驟問卷設計 (Multi-step Flow)**
   - **步驟 1 - 基本資料與生理數據**：姓名、性別、年齡、身高體重、聯絡方式 (電話、Email、LINE ID)。
   - **步驟 2 - 生活作息與習慣**：睡眠時長與品質、水分攝取、運動頻率、外食與飲食特色、菸酒狀況。
   - **步驟 3 - 健康困擾與主要目標**：多選困擾標籤（減重、疲倦、腸胃、三高、落髮等）、首要健康目標、自覺壓力指數評分 (1-10)。
   - **步驟 4 - 既往病史與諮詢需求**：慢性疾病史、藥物/保健品使用、過敏史、偏好聯繫時段、詳細需求留言與個資聲明。
   - **步驟 5 - 資訊核對與送出**：送出前各區塊資料即時確認與一鍵快速修改。
2. **即時健康數值分析**
   - 根據台灣衛福部成人體位標準自動即時計算 **BMI 指標**與對應狀態（過輕、正常、過重、肥胖）。
   - 自動試算個人化**理想體重區間**。
   - 依據體重提供**建議每日水分攝取量** (cc)。
3. **優異的使用者體驗 (UX)**
   - **暫存草稿機制**：自動儲存至 LocalStorage，若不小心重整網頁資料不會遺失。
   - **送出成功頁面**：產生專屬預約單編號，支援一鍵「複製諮詢摘要」或填寫下一份表單。
   - **RWD 響應式排版**：完美支援手機、平板與桌面電腦瀏覽。

---

## 🚀 本地開發 (Local Development)

```bash
# 啟動本地開發伺服器
npm run dev

# 構建生產版本
npm run build

# 本地預覽生產版本
npm run preview
```

---

## ☁️ 部署至 Firebase Hosting (Deployment Guide)

### 方式 A：GitHub Actions 自動部署 (Push to master 自動發布)

本專案已配置 `.github/workflows/firebase-hosting-merge.yml`。當代碼 push 至 `master` 或 `main` 時，GitHub Actions 會自動執行 build 並發布至 Firebase Hosting。

#### 快速設定（推薦）：
登入 Firebase 後，在終端機直接執行：
```bash
firebase init hosting:github
```
照著提示選擇：
1. 輸入 GitHub 存儲庫名稱：`steven5j/healthy-form`
2. 是否在每次 PR 建立預覽連結？依照需求選擇 (Y/N)
3. 是否在 merge 時自動部署？選擇 `Y`
Firebase 就會**自動在 GitHub 上設置 Service Account 密鑰**並完成所有連線。

---

### 方式 B：本地手動構建與部署
若您尚未登入 Firebase CLI，請在終端機中執行：
```bash
firebase login
```
這會開啟瀏覽器讓您登入 Google 帳號授權。

### 步驟 2：綁定或切換您的 Firebase 專案
您可以直接使用現有的 Firebase 專案或建立新專案：
```bash
# 列出您帳號下的所有 Firebase 專案
firebase projects:list

# 將本專案綁定至您的 Firebase 專案 ID
firebase use <YOUR_FIREBASE_PROJECT_ID>
```
*(也可以直接修改 `.firebaserc` 中的 `"default": "您的專案ID"`)*

### 步驟 3：構建並一鍵部署
執行下方指令，會自動編譯專案並發布至 Firebase Hosting：
```bash
npm run deploy
```
或者手動分開執行：
```bash
npm run build
firebase deploy --only hosting
```

部署完成後，Firebase CLI 會輸出對應的託管網址（例如：`https://<project-id>.web.app` 或 `https://<project-id>.firebaseapp.com`）。

---

## ⚙️ 技術架構

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Hosting**: Firebase Hosting (支援 SPA 單頁應用重定向)
- **Extensibility**: 內建 `src/services/firebase.ts` 與 `.env.example`，後續可無縫串接 Firebase Firestore 資料庫。
