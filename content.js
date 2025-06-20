chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getScrollPosition") {
    sendResponse({
      scrollY: window.scrollY
    });
  }
});
