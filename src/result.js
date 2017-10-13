var browser = chrome;


function getChanges(stored) {
	var name = stored['name'];
	var	urls = stored['urls'];
	
	document.getElementById("name_id").innerText = name;
	document.getElementById("domain_id").innerHTML = urls.join("<br>");
}

function setpopupback() {
	var gettingActiveTab = browser.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		//browser.browserAction.setPopup({popup: "/src/popup.html"}); // Temporary fix
		browser.browserAction.setPopup({tabId:tabs[0].id, popup: "/src/popup.html"});
		window.location.replace("/src/popup.html");
		window.close();
	});
}

function openLink(url) {
	browser.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		browser.tabs.create({
			url : url
		},function(){
			window.close();
		});
	});
}

document.addEventListener('DOMContentLoaded', function() {
	
	document.getElementById("return").addEventListener("click", setpopupback);
	document.getElementById("cnil-deref").addEventListener("click", function(){
		openLink("https://www.cnil.fr/fr/le-droit-au-dereferencement");
	});
	
	
	// Only save lethe information if supported by the browser
	if (typeof(Storage) !== "undefined") {
		var stored = localStorage.getItem('Lethe');
		if (stored){
			try {
				stored = JSON.parse(stored);
			}catch (e) {
				localStorage.removeItem('Lethe');
			}
			getChanges(stored);
		}

	}

	
	var gettingActiveTab = browser.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		search_engine.forEach(function(search) {
			if (tabs[0].url.includes(search[1])) {			
				document.getElementById("search_id").innerText=search[0];
				document.getElementById("deref").addEventListener("click", function(){
					openLink(search[6]);
				});
				/*
				script = 'var browser = chrome; var links = document.querySelectorAll("'+search[5]+'"); browser.runtime.sendMessage({num_result: links.length});';
				chrome.runtime.onMessage.addListener(
				function(request, sender, sendResponse) {
					document.getElementById("result_id").innerText=request.num_result;
				});
			
				browser.tabs.executeScript(null, {
					code : script
				});*/
			}
		});
	});
});
