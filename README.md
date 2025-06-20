# ScrollNest

**ScrollNest** is a lightweight and privacy-friendly browser extension that lets you **save and restore your browser sessions**, including the **scroll positions** of each tab. Ideal for researchers, students, and productivity lovers who want to continue where they left off — effortlessly.

---

## 🚀 Features

- ✅ **Save current window's tabs** and their **scroll positions**
- ✅ Add custom **names** and **tags** to your sessions
- ✅ **Restore sessions** in a new window with tabs auto-scrolled to saved positions
- ✅ **Delete** old sessions anytime
- ✅ All data stored **locally** — no tracking, no login, no sync
- ✅ Works on **Chrome** and **Microsoft Edge**

---

## 📦 Installation

### 🔧 Manual Install (for development/testing)

#### Chrome:

1. Open `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the root folder of this repository

#### Edge:

1. Open `edge://extensions`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the root folder of this repository

---

## 🛠 Tech Stack

- Manifest V3
- JavaScript (`background.js`, `popup.js`)
- HTML + CSS (`popup.html`)
- Chrome Extension APIs (`tabs`, `scripting`, `storage`, `downloads`)

---

## 🔒 Privacy & Permissions

ScrollNest does **not** collect or transmit any user data.  
All session data is stored **locally** in your browser’s `chrome.storage.local`.

**Permissions Used:**

- `tabs` – To read tab URLs
- `scripting` – To get scroll positions
- `storage` – To save sessions
- `downloads` – (Optional) For scroll image capture (feature may be added in future)

---

## 🙌 Contribute

Feel free to fork, star, or open pull requests!  
Ideas, suggestions, or UI enhancements are always welcome.
