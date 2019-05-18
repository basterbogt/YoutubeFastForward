// Copyright 2019 Bas. All rights reserved.

'use strict';

let input = document.getElementById('speedInput');
function constructOptions(input) {
  input.oninput = function() {
      chrome.storage.sync.set({speed: input.value}, function() {
          console.log('Speed is ' + input.value);
      })
  };
}
constructOptions(input);