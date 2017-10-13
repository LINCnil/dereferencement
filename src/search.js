	 
function saveChanges() {
	var name = document.getElementById("name").value;
	var urls = [];

	if (!name && urls.length ==0) {
		localStorage.removeItem('Lethe');
		return;
	}
	
	var urls_elt = document.getElementsByClassName("url");
	for (var i = 0; i < urls_elt.length; ++i) {
		urls.push(urls_elt[i].value);
	}
	
	localStorage.setItem('Lethe', JSON.stringify({'name' : name, 'urls' : urls}));
}

function addUrl() {
	var div = document.getElementById("urls_extender");
	var elt = document.createElement("input");
	elt.setAttribute('type', 'text');
	elt.setAttribute('class', 'url');
	elt.setAttribute('placeholder', "Indiquez le(s) nom(s) de domaine à analyser");
	div.appendChild(elt);

	elt = document.createElement("br");
	div.appendChild(elt);
}

function getChanges(stored) {
	var urls_elt = document.getElementsByClassName("url");

	var name = stored['name'];
	var	urls = stored['urls'];
	
	document.getElementById("name").value = name;

	while (urls.length != urls_elt.length){
		addUrl();
	}
	
	urls.forEach(function(url, i, urls) {
		urls_elt[i].value = url;
	});
}
  
function setClean(){
	document.getElementById("name").value = "";
	document.getElementsByClassName("url")[0].value ="";

	var urls_node = document.getElementById("urls_extender");
	
	while (urls_node.firstChild) {
		urls_node.removeChild(urls_node.firstChild);
	}
	
	document.dispatchEvent(new Event("input"));
}

function setSearch() {
	var searchurl = document.getElementById("searchSelector").value;
	browser.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		browser.tabs.create({
			url : searchurl,
			index : tabs[0].index +1
		}, function(tab){
			//window.close();
		});
	});
}

function openCnil(url) {
	browser.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		browser.tabs.create({
			url : url
		});
	});
}

function launchSearch(form, bracket, url_only) {
	var name = document.getElementById("name").value;
	var urls = [];

	function add_http(url) {
		if (!/^(f|ht)tps?:\/\//i.test(url)) {
			url = "http://" + url;
		}
		return url;
	}


	var urls_elt = document.getElementsByClassName("url");
	for (var i = 0; i < urls_elt.length; ++i) {
		var value = urls_elt[i].value;
		if(value == "") continue;
		http = add_http(value);
		
		var a_elt = document.createElement('a');
		a_elt.href = decodeURIComponent(http);
		
		if (url_only){
			urls.push(a_elt.origin);
		}else{
			urls.push(a_elt.origin + a_elt.pathname);
		}
		
	}

	browser.tabs.executeScript(null, {
		file : "/src/inject_query.js"
	});

	var gettingActiveTab = browser.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		//browser.browserAction.setPopup({popup: "/src/result.html"}); //Temporary fix for chrome
		chrome.browserAction.setPopup({tabId:tabs[0].id, popup: "/src/result.html"});
		browser.tabs.sendMessage(tabs[0].id, {
			search_name : name,
			search_urls : urls,
			search_form : form,
			has_bracket : bracket
		},function(){
			window.location.href="/src/result.html";
			
		});
	});
}

function setOff(){
	document.getElementById("name").disabled = true;
	document.getElementById("go").disabled = true;
	
	var test = document.getElementsByClassName("url");
	url_els= document.getElementsByClassName("url")
	
	for (var i = 0; i < url_els.length; i++) {
		url_els[i].disabled = true;
	}
}

function setOn(){
	document.getElementById("name").disabled = false;
	document.getElementById("go").disabled = false;
	url_els= document.getElementsByClassName("url")
	
	for (var i = 0; i < url_els.length; i++) {
		url_els[i].disabled = false;
	}
	
}

document.addEventListener('DOMContentLoaded', function() {
	var search_selector = document.getElementById("searchSelector");
	
	search_selector.addEventListener("change", setSearch);
	
	// Set links
	document.getElementById("cnil-deref").addEventListener("click", function(){
		openCnil("https://www.cnil.fr/fr/le-droit-au-dereferencement");
	});
	
	document.getElementById("cnil").addEventListener("click", function(){
		openCnil("https://www.cnil.fr");
	});
	
	document.getElementById("clean").addEventListener("click", setClean);

	// Only save lethe information if supported by the browser
	if (typeof(Storage) !== "undefined") {
		document.addEventListener("input", saveChanges);
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

	setOff();
	
	var gettingActiveTab = browser.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		search_engine.forEach(function(search) {
			var opt = document.createElement('option');
			opt.innerHTML = search[0];
			opt.value = search[1];
			if (tabs[0].url.includes(search[1])) {
				opt.setAttribute("selected", "selected");
				
				setOn();
				
				document.getElementById("plus").addEventListener('click',
						addUrl, false);

				document.getElementById("go").addEventListener("click",
						function() {
							launchSearch(search[2], search[3], search[4])
						});
			}

			search_selector.appendChild(opt);
		});
	});
});
