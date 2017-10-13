var browser = chrome;

function fill_url(request, sender, sendResponse) {
	
	var urls  = request.search_urls.filter(Boolean);
	var query = request.search_name +" ";
	var has_bracket = request.has_bracket;
	
	if (urls.length >1 && has_bracket == true){
		query += '(';
	}
	
	
	query += 'site:';
	query += urls.join (" OR site:");
	
	if (urls.length >1 && has_bracket == true){
		query += ')';
	}

	element = document.querySelector(request.search_form);
	if (typeof element.q !== 'undefined' ){
		element.q.value = query;
	}else if (typeof element.p !== 'undefined' ){
		element.p.value = query;
	}else if (typeof element.query !== 'undefined' ){
		element.query.value = query;
	}
	
	element.submit();

 /* */
  browser.runtime.onMessage.removeListener(fill_url);
}

browser.runtime.onMessage.addListener(fill_url);
