window.addEventListener('load', init, false);

function init() {
  var counter;
  var counterSelect = document.getElementById('counter');

  chrome.storage.sync.get({ counter: 'off' }, function (result) {
    counter = result['counter'];
    for (var i = 0; i < counterSelect.children.length; i++) {
      var child = counterSelect.children[i];
      if (child.value == counter) {
        child.selected = 'true';
        break;
      }
    }
  });

  counterSelect.addEventListener('change', function (event) {
    var value = counterSelect.children[counterSelect.selectedIndex].value;
    setOption({ counter: value });
    save(counterSelect);
    chrome.runtime.getBackgroundPage(function(bg) {
      bg.initCounter();
    });
  }, false);

  var width = document.getElementById('width');
  var widthValue = document.getElementById('width-value');
  chrome.storage.sync.get({ width: 360 }, function (result) {
    width.value = widthValue.textContent = result['width'];
  });

  width.addEventListener('input', function (event) {
    widthValue.textContent = event.target.value;
  }, false);
  width.addEventListener('change', function (event) {
    setOption({ width: event.target.value });
    save(width);
  }, false);

  var lines = document.getElementById('lines');
  var linesValue = document.getElementById('lines-value');
  chrome.storage.sync.get({ lines: 3 }, function (result) {
    lines.value = linesValue.textContent = result['lines'];
  });

  lines.addEventListener('input', function (event) {
    linesValue.textContent = event.target.value;
  }, false);
  lines.addEventListener('change', function (event) {
    setOption({ lines: event.target.value });
    save(lines);
  }, false);
}

function option(key) {
  var value;
  chrome.storage.sync.get(key, function (result) {
    console.log('Value currently is ' + result[key]);
    value = result[key];
  });
  return value;
}

function setOption(value) {
  chrome.storage.sync.set(value, function () {
    console.dir(value);
  });
}

function save() {
  var status = document.getElementById('status');
  status.className = 'show';
  setTimeout(function () {
    status.className = '';
  }, 750);
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
      'Old value was "%s", new value is "%s".',
      key,
      namespace,
      storageChange.oldValue,
      storageChange.newValue);
  }
});
