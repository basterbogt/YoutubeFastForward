// Copyright 2019 Bas. All rights reserved.

'use strict';

let minimumSpeedValue = 0;
let maximumSpeedValue = 16;
let defaultSpeed = 1;
let defaultSpeedStepSize = 0.25;
let input = document.getElementById('speedInput');

//Do this after page load:
chrome.storage.sync.get('speed', function(data) 
{
	if(!VariableIsSet(data.speed) || !IsNumber(data.speed))
	{
		Init(defaultSpeed);
	}
	else
	{
		Init(data.speed);
	}
});

function Init(speed) 
{  
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
	  	if (e.deltaY < 0) 
	  	{
	  		console.log("Scrolled up");
	  	}
	  	else if (e.deltaY > 0) 
	  	{
	  		console.log("Scrolled down");
	  	}
	});
}

//Functions:

function GetCurrentSpeed(){
	return input.value;
}

function SetCurrentSpeed(speed)
{
	console.log(speed);
	if(speed < minimumSpeedValue || speed > maximumSpeedValue)
	{
		return;
	}

	input.value = speed;
	UpdateYoutubeAndCache(speed);
}

function UpdateYoutubeAndCache(speed)
{
	if(VariableIsSet(speed) && IsNumber(speed))
	{
  		SetYoutubeSpeed(speed);
  		SaveToStorage(speed);
  	}
  	else{
  		console.log("Not a number: " + speed);
  	}
}

function SetYoutubeSpeed(speed)
{
	if(VariableIsSet(speed) && IsNumber(speed))
	{
    	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		    chrome.tabs.executeScript(
		        tabs[0].id,
		        {code: 'document.getElementsByTagName("video")[0].playbackRate = '+ speed +';document.getElementsByTagName("video")[0].play();'});
	  	});
	}
}

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
	  	console.log("Saved setting speed: " + speed);
  	}, 300);
}
function ResetSaveTimeout() 
{
  clearTimeout(storageSaveTimeout);
}