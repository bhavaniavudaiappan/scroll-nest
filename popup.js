document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("save").addEventListener("click", saveSession);
  loadSessions();
});

async function saveSession() {
  const name = document.getElementById("sessionName").value.trim();
  const tag = document.getElementById("sessionTag").value.trim();

  if (!name) return alert("Please enter a session name.");

  const tabs = await chrome.tabs.query({ currentWindow: true });
  const sessionTabs = [];
  let skippedTabs = 0;

  for (const tab of tabs) {
    // ❌ Skip tabs like chrome:// or extension://
    if (!tab.url.startsWith("http")) {
      skippedTabs++;
      continue;
    }

    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.scrollY
      });

      const scrollY = results[0]?.result || 0;

      sessionTabs.push({
        url: tab.url,
        scrollY
      });
    } catch (e) {
      console.warn(`Could not access tab: ${tab.url}`, e);
      skippedTabs++;
    }
  }

  if (sessionTabs.length === 0) {
    alert("No accessible tabs to save in this session.");
    return;
  }

  chrome.runtime.sendMessage({
    action: "saveSession",
    name,
    tag,
    tabs: sessionTabs
  }, () => {
    document.getElementById("sessionName").value = "";
    document.getElementById("sessionTag").value = "";
    loadSessions();

    if (skippedTabs > 0) {
      alert(`${skippedTabs} tab(s) could not be saved (e.g. chrome:// or edge:// or restricted pages).`);
    }
  });
}

function loadSessions() {
  chrome.storage.local.get("ScrollNestSessions", ({ ScrollNestSessions }) => {
    const container = document.getElementById("sessionList");
    container.innerHTML = "";

    if (!ScrollNestSessions || Object.keys(ScrollNestSessions).length === 0) {
      container.innerText = "No sessions saved.";
      return;
    }

    for (const name in ScrollNestSessions) {
      const session = ScrollNestSessions[name];
      const div = document.createElement("div");
      div.className = "session";
      div.innerHTML = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Tag:</strong> ${session.tag || "None"}</p>
        <div class="session-buttons">
    <button class="restore-btn" data-name="${name}">Restore</button>
    <button class="delete-btn" data-name="${name}">Delete</button>
  </div>
      `;
      container.appendChild(div);
    }

    // Attach event listeners AFTER rendering
    document.querySelectorAll(".restore-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        chrome.runtime.sendMessage({ action: "restoreNamedSession", name });
      });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-name");
        chrome.runtime.sendMessage({ action: "deleteSession", name }, loadSessions);
      });
    });
  });
}
