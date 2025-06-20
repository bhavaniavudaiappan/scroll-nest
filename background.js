chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "saveSession") {
    chrome.storage.local.get("ScrollNestSessions", ({ ScrollNestSessions }) => {
      const sessions = ScrollNestSessions || {};
      sessions[msg.name] = {
        tag: msg.tag,
        tabs: msg.tabs
      };
      chrome.storage.local.set({ ScrollNestSessions: sessions }, () => {
        sendResponse && sendResponse();
      });
    });
    return true; // keep message channel open
  }

  if (msg.action === "deleteSession") {
    chrome.storage.local.get("ScrollNestSessions", ({ ScrollNestSessions }) => {
      if (ScrollNestSessions && ScrollNestSessions[msg.name]) {
        delete ScrollNestSessions[msg.name];
        chrome.storage.local.set({ ScrollNestSessions }, () => {
          sendResponse && sendResponse();
        });
      }
    });
    return true;
  }

  if (msg.action === "restoreNamedSession") {
    chrome.storage.local.get("ScrollNestSessions", ({ ScrollNestSessions }) => {
      const session = ScrollNestSessions?.[msg.name];
      if (!session) return;

      chrome.windows.create({ url: session.tabs[0].url }, (newWindow) => {
        const newWindowId = newWindow.id;

        for (let i = 1; i < session.tabs.length; i++) {
          const tab = session.tabs[i];
          chrome.tabs.create({ windowId: newWindowId, url: tab.url }, (newTab) => {
            chrome.scripting.executeScript({
              target: { tabId: newTab.id },
              func: (y) => {
                window.addEventListener("load", () => window.scrollTo(0, y));
              },
              args: [tab.scrollY]
            });
          });
        }

        // Scroll first tab
        const firstTabId = newWindow.tabs?.[0]?.id || newWindow.id;
        chrome.scripting.executeScript({
          target: { tabId: firstTabId },
          func: (y) => {
            window.addEventListener("load", () => window.scrollTo(0, y));
          },
          args: [session.tabs[0].scrollY]
        });
      });
    });
  }

  if (msg.action === "storeTabScroll") {
    // Optional: Update scrollY live if needed
    // Currently using dummy 0, can enhance this
  }
});
