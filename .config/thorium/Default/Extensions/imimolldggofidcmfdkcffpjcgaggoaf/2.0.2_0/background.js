window.addEventListener("load", init, false);

function init() {
  initCounter();
}

function initCounter() {
  chrome.storage.sync.get({ counter: 'off' }, function (result) {
    var counter = result['counter'];
    if (counter == 'on') {
      setTabsCounter();
      updateCounter();
    } else if (counter = 'off') {
      removeTabsCounter();
    }
  });
}

function setTabsCounter() {
  chrome.tabs.onAttached.addListener(updateCounter);
  chrome.tabs.onCreated.addListener(updateCounter);
  chrome.tabs.onDetached.addListener(updateCounter);
  chrome.tabs.onRemoved.addListener(updateCounter);
  chrome.windows.onFocusChanged.addListener(updateCounter);
  chrome.browserAction.setBadgeBackgroundColor({ color: [104, 137, 203, 255] });
}
function removeTabsCounter() {
  setBadgeText('');
  chrome.tabs.onAttached.removeListener(updateCounter);
  chrome.tabs.onCreated.removeListener(updateCounter);
  chrome.tabs.onDetached.removeListener(updateCounter);
  chrome.tabs.onRemoved.removeListener(updateCounter);
  chrome.windows.onFocusChanged.removeListener(updateCounter);
}
function updateCounter() {
  chrome.storage.sync.get({ counter: 'off' }, function (result) {
    if (result['counter'] != 'on')
      return;
  });

  chrome.tabs.getAllInWindow(null, function (tabs) {
    setBadgeText(String(tabs.length));
  });
}
function setBadgeText(text) {
  chrome.browserAction.setBadgeText({ text: text });
}
