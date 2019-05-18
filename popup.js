// Copyright 2019 Bas. All rights reserved.

'use strict';

let minimumSpeedValue = 0;
let maximumSpeedValue = 16;
let defaultSpeed = 1;
let defaultSpeedStepSize = 0.25;
let input = document.getElementById('speedInput');

let defaultVolumeVariableName = 'defaultVolume';
let speedUpVolume = 0.25; //25% is the default

//Do this after page load:
chrome.storage.sync.get('speed', function(data) 
{
	if(VariableIsSet(data.speed) && IsNumber(data.speed))
	{
		Init(data.speed);
	}
	else
	{
		Init(defaultSpeed);
	}
});

chrome.storage.sync.get('volume', function(data) 
{
	if(VariableIsSet(data.volume) && IsNumber(data.volume))
	{
		speedUpVolume = data.volume;
	}
});

function Init(speed) 
{  
	GenerateDefaultVolumeVariableAtTab();

	SetYoutubeSpeed(speed);

	input.value = speed;
	input.step = defaultSpeedStepSize;
	input.min = minimumSpeedValue;
	input.max = maximumSpeedValue;
	input.focus();

	input.oninput = function() {
		UpdateYoutubeAndCache(input.value);
	};

	document.addEventListener("wheel", function(e) {
	});
}

//Functions:
function GenerateDefaultVolumeVariableAtTab()
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.executeScript(
				tabs[0].id,
				{code: `${defaultVolumeVariableName} = document.getElementsByTagName("video")[0].volume;`});
	});
}

function GetCurrentSpeed(){
	return input.value;
}

function UpdateYoutubeAndCache(speed)
{
	if(VariableIsSet(speed) && IsNumber(speed))
	{
		SetStepSize(speed);
		SetYoutubeSpeed(speed);
		SaveToStorage(speed);
	}
}

function SetStepSize(speed)
{
	input.step = (speed >= 5)? defaultSpeedStepSize * 4 : defaultSpeedStepSize;
}

function SetYoutubeSpeed(speed)
{
	if(VariableIsSet(speed) && IsNumber(speed))
	{
    	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		    chrome.tabs.executeScript(
		        tabs[0].id,
						{code: `document.getElementsByTagName("video")[0].playbackRate = ${speed};` +
									 `document.getElementsByTagName("video")[0].play();`+
									 `document.getElementsByTagName("video")[0].volume = ${(speed > 1)? `(${defaultVolumeVariableName} * ${speedUpVolume})`: defaultVolumeVariableName};`});
	  	});
	}
}

//helpers:

function IsNumber(n) 
{ 
	return (!isNaN(parseFloat(n)) && !isNaN(n - 0));
}

function VariableIsSet(variableName)
{
	return (variableName !== undefined && variableName !== null);
}

var storageSaveTimeout;

function SaveToStorage(speed) 
{
	ResetSaveTimeout();
  	storageSaveTimeout = setTimeout(function(){ 
	  	chrome.storage.sync.set({speed: speed}, null);
	  	console.log(`Saved setting speed: ${speed}`);
  	}, 300);
}

function ResetSaveTimeout() 
{
  clearTimeout(storageSaveTimeout);
}