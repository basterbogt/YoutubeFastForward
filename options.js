// Copyright 2019 Bas. All rights reserved.

'use strict';

let speedInput = document.getElementById('speedInput');
let minimumSpeedValue = 0;
let maximumSpeedValue = 16;
let defaultSpeedStepSize = 0.25;

let volumeInput = document.getElementById('volumeInput');
let minimumVolumeValue = 0;
let maximumVolumeValue = 100;
let defaultVolumeStepSize = 5;

function setSpeedInput(input) {
  input.oninput = function() {
      chrome.storage.sync.set({speed: input.value}, function() {
          console.log('Speed is ' + input.value);
      })
  };
}

function setVolumeInput(input) {
  input.oninput = function() {
      chrome.storage.sync.set({volume: (input.value / 100)}, function() {
          console.log('Saved volume is ' + (input.value / 100));
      })
  };
}

function Init(){

	speedInput.step = defaultSpeedStepSize;
	speedInput.min = minimumSpeedValue;
  speedInput.max = maximumSpeedValue;
  
	volumeInput.step = defaultVolumeStepSize;
	volumeInput.min = minimumVolumeValue;
  volumeInput.max = maximumVolumeValue;

	document.addEventListener("wheel", function(e) {
  });

  chrome.storage.sync.get('speed', function(data) 
  {
    if(VariableIsSet(data.speed) && IsNumber(data.speed))
    {
      speedInput.value = data.speed;
    }
  });

  chrome.storage.sync.get('volume', function(data) 
  {
    if(VariableIsSet(data.volume) && IsNumber(data.volume))
    {
      volumeInput.value = data.volume * 100;
    }
  });

  setSpeedInput(speedInput);
  setVolumeInput(volumeInput);
}

Init();

//Helpers:

function IsNumber(n) 
{ 
	return (!isNaN(parseFloat(n)) && !isNaN(n - 0));
}

function VariableIsSet(variableName)
{
	return (variableName !== undefined && variableName !== null);
}
