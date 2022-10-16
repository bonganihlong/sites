var config = {};		
config.site = 'BusiSomething';
	
function setConfigs(){
	var t = localStorage.getItem(config.site + 'configs');
	
	if(localStorage.getItem(config.site + 'configs') == null){
		config.commitTime = 1000;		
		config.base = 'https://dev.azure.com';
		config.vs = 'https://vssps.dev.azure.com/kukhanya';
		config.fileserver = "";
		config.org = 'kukhanya';
		config.project = 'FormForm';
		config.projectCSS = 'CSS';
		config.url_org = config.base + "/" + config.org;
		config.repo_proj = "Sunglass";
		config.url_proj = config.url_org + "/" + config.project;
		config.url_projCSS = config.url_org + "/" + config.projectCSS;
		config.version = 'api-version=6.0';
		config.path_workitems = '_apis/wit/workitems?ids=###ids###&' + config.version;
		config.path_workitem = '_apis/wit/workitems/###ids###?' + config.version + '&$expand=all';
		config.path_wiql = '_apis/wit/wiql?' + config.version;
		config.path_batch = '_apis/wit/workitemsbatch?' + config.version;
		config.path_repo = '_apis/git/repositories?' + config.version;
		config.path_commit = "_apis/git/repositories/###id###/commits?&$top=1&searchCriteria.refName=refs/heads/main&" + config.version;
		config.path_push = "_apis/git/repositories/###id###/pushes?" + config.version;
		config.path_token = "_apis/tokens/pats?api-version=7.1-preview.1";
		config.path_comment = "_apis/wit/workitems/###id###/comments?" + config.version + '-preview.3';
		config.path_getcomment = "_apis/wit/workitems/###wid###/comments/###id###?" + config.version  + '-preview.3';
		config.user = localStorage.getItem(config.site + 'userId');
		config.path_session = '_apis/Token/SessionTokens?' + config.version + "-preview";
		config.team = 'FormFormTeam';
		config.url_team = config.url_proj + '/' + config.team;
		config.tokenDate = '';
		
		config.addlog = ['onload', 'loadRepos', 'Exception'];
		config.removelog = ['context'];
		config.addcomment = [];
		config.removecomment = [];
		
		config.postsource = ['getUpdatedWI', 'addWIs', 'uploadImage', 'processComment', 'loadComment'];
		config.getsource = ['loadCommit', 'processComment', 'loadComment', 'loadToken'];
		config.repoitems = ['loadToken', 'loadCommit', 'getUpdatedWI', 'addWIs', 'processComment', 'loadComment', 'uploadImage'];
		config.repo = "";
		config.key = "";
		config.device = "";
		config.maxDate = "";
		config.maxId;
		config.cssCount = 0;
		config.logId = 16923;
		config.whatsapp = "https://api.whatsapp.com/send?phone=27726359342&text=AccessSunglass";
		config.email = "mailto:bonganihlong@icloud.com?subject=RequestAccess&body=AccessSunglass";
		saveConfig();
	}else{
		config = JSON.parse(localStorage.getItem(config.site + 'configs'));
	}
}

function saveConfig(){
	localStorage.setItem(config.site + 'configs', JSON.stringify(config));
}

var index;
var idsArr = [];

function getId(url){
	if(( url.includes('workitems/') || url.includes('workItems/'))){
		var startindex = url.indexOf('workitems/');
		if(startindex == -1) startindex = url.indexOf('workItems/');
		var endindex = url.indexOf('?');
		return url.substring(startindex + 10, endindex == -1 ? url.length : endindex);
	}
}
function all(url, json, callBack, item, online, get) {	
	if(online.length == 0) return;
	log('all', 'allstart', "Getting from post: " + item + url + "--" + base + online[0] + get, ln());
	var id = getId(url);
	
	var base = (btoa(item + url + key).hashCode() + "").replace("-","C");
	log('all', 'allstart', "Getting from post: " + item + url + "--" + base + online[0] + get + id, ln());
	
	
	var request = window.indexedDB.open(config.site + "Database");
	
	request.onsuccess = function(event) {
		try {
			id = id == undefined ? 0 : id;
			var request = event.target.result.transaction("workitems", "readwrite").objectStore("workitems").get(id);
			
			request.onsuccess = function(e) {
				if(id > 0){
					var request = window.indexedDB.open(config.site + "Database");
					request.onsuccess = function(event) {
						var request = event.target.result.transaction("workitems", "readwrite").objectStore("workitems").get(Number(id));
						request.onsuccess = function(e) {
							if(e.target.result != undefined){
								if(id != config.maxId){
									removeWI(id);
								}
								allRequest(url, json, callBack, item, ['online'], get, base);
							}else{
									allRequest(url, json, callBack, item, online, get, base);
							}
						}
				        
				        request.onerror = function(e) {
								allRequest(url, json, callBack, item, online, get, base);
						}
					}
				}else{
					allRequest(url, json, callBack, item, online, get, base);
				}
				
			};
			
			request.onerror = function(e) {
				allRequest(url, json, callBack, item, online, get, base);
			};
			
		} catch (error) {
			//allRequest(url, json, callBack, item, online, get, base);
		}
	}
	
		
}

function allRequest(url, json, callBack, item, online, get, base ){
	var destUrl = url;
	switch (online[0]) {
		case 'online': destUrl = url + '#/' + base + '##refresh#';
			break;
		case 'onlinecache': destUrl = url;
			break;
		case 'site':  destUrl = config.fileserver + "images/" + base + ".js" + '#refresh#';
			break;
		case 'sitecache': destUrl = config.fileserver + "images/" + base + ".js";
			break;
	}
	
	var method = get ? 'GET' : online[0].includes('online') ? 'POST' : 'GET';
	var finalData = method == 'GET' ? null : json;
	
	
	$.ajax({
		url: destUrl,
		type : method,
		data: finalData,
		async: true,
		headers: { 'MainUrl': url, 'CacheUrl': base + ".js", 'Online': online[0], 'Item-Requested': item, 'Authorization': 'Basic ' + key,  'Access-Control-Allow-Origin': '*', 'Content-Type' : 'application/json'},
		cache: true,
		success: function (str,sta,xhr) {
			if(xhr.status == 200){
				log('all', 'success', "Calling handler: " + item + url + "--" + base + online[0] + get, ln());
				handleCaller(str, base, callBack, item, online[0]);
				
			}else{
					online.shift();
					all(url, json, callBack, item, online, get);
				}
		},
		failure: function (str,sta,xhr) {
			log('all', 'onfailure', "Not found " + url + item, ln());
			online.shift();
			all(url, json, callBack, item, online, get);
		},
		error: function (str,sta,xhr) {
			log('all', 'Error1', "Not found " + url + item, ln());
			if(str.status == 408 || str.status == 404){
				online.shift();
				all(url, json, callBack, item, online, get);
			} 
			if(str.status == 400 && item.includes('uploadImage') && str.responseJSON.message.includes('specified in the add operation already exists')){
				var index = str.responseJSON.message.indexOf('/images/');
				var finalindex = str.responseJSON.message.indexOf('.js');
				var filename = str.responseJSON.message.substring(index, finalindex - index + 13);
				json = JSON.parse(json);
				var edited = false;
				for(var i=json.commits[0].changes.length-1; i>=0; i--){
					if(json.commits[0].changes[i].changeType == 'add' && json.commits[0].changes[i].item.path == filename){
						json.commits[0].changes.splice(i, 1);
						//json.commits[0].changes[i].changeType = 'edit';
						edited = true;
					}
				}
				if(edited && json.commits[0].changes.length > 0){
					all(url, JSON.stringify(json), callBack, item, ['online'], get);
				}
			}
			log('all', 'Error3', "Done." + item, ln());
		},
	});
}
function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i] === nameKey) {
            return true;
        }
    }
	return false;
}

function searchIncludes(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (nameKey.includes(myArray[i])) {
            return true;
        }
    }
	return false;
}


function post(url, json, callBack, item){
	all(url, json, callBack, item, ['online'], false);
}

function get(url, callBack, item, online){
	all(url, null, callBack, item, online == undefined || online == null ? ['sitecache', 'onlinecache', 'site', 'online'] : online, true);
}

function handleCaller(context, base, callBack, item, online, get){	
	log('handleCaller', 'context', item + context , ln());
	if(context != "" && context != null && context != undefined){
		log('handleCaller', 'handleCaller', "Starting Callback" + item , ln());
		callBack(context);		
		log('handleCaller', 'handleCaller', "Starting to repo " + item , ln());
		if(!searchIncludes(item, config.repoitems)){
			var json = JSON.stringify(context);
			if(online == 'online'){	
				log('handleCaller', 'handleCaller', "Calling repoImage " + item , ln());
				
				repoImage("", json, base + ".js", 'rawtext');
					  
				log('handleCaller', 'handleCaller', "Done repoImage " + item , ln());
			}
			log('handleCaller', 'handleCaller', "Finished repoImage " + item , ln());
		}
	}
}

function fileExists(url) {
    if(url){
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
		req.setRequestHeader("Item-Requested", item);
				    
        req.send();
        return req.status==200;
    } else {
        return false;
    }
}

function getText(url){
    // read text from URL location
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
	request.setRequestHeader("Item-Requested", item);
				    
    request.send(null);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
                return request.responseText;
            }
        }
    }
}

function saveToken(){
	var data = $('#userId').val().split(':');
	if(data.length > 1){
		config[data[0]] = data[1];
	}else{
		config.user = data;
		config.token = $('#tokenId').val();
		localStorage.setItem(config.site + 'userId', config.user);
		localStorage.setItem(config.site + "token", config.token);
		$('#accessModal').modal('hide');
		saveConfig();
	}
}

document.onkeyup = function () {
  var e = e || window.event; // for IE to cover IEs window event-object
  if(e.altKey && e.which == 65) {
	  $('#accessModal').modal('show');
    return false;
  }
}

async function fetchWithAuthentication(url, authToken) {
	const headers = new Headers();
	headers.set('Authorization', authToken);
	headers.set('Access-Control-Allow-Origin', '*');
	headers.set('Accept-Encoding', 'gzip,deflate');
	headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	return await fetch(url, {
		headers
	});
}

async function displayProtectedImage(imageId, imageUrl, authToken, name) {
	try {
		const response = await fetchWithAuthentication(imageUrl, authToken);
		const blob = response.blob();		
		const objectUrl = window.URL.createObjectURL(blob);		
		const imageElement = document.getElementById(imageId);
		imageElement.src = objectUrl;
		
		var blobToBase64 = function(blob, callback) {
		var reader = new FileReader();
			reader.onload = function() {
				var dataUrl = reader.result;
				var base64 = dataUrl.split(',')[1];				
			};
			reader.readAsDataURL(blob);
		};
		//blobToBase64(blob, repoImage);
		
		document.getElementById(imageId + '_div').style.display = 'block';
	} catch (e) {
		logError('displayProtectedImage', 'Exception', imageUrl + ":" + imageId + name, ln(), e);
		
	}
}


var objs  = [];
function repoImage(imageUrl, base64, name, type, repeat){	
	var filename = imageUrl.split('/').pop() + name;
	var hasfile = false;
	for(var i=0; i<objs.length; i++){
		if(objs[i].filename == filename) hasfile = true;
	}
	if(filename != "" && !hasfile){	
		
		var obj = {};
		obj.filename = filename;
		obj.base64 = base64;
		obj.type = type;
		//if(objs.filter(item => item.filename == filename).length > 0) return;
		
		objs.push(obj);
		if(objs.length < 1) return; 
	}
	
	if(config.repo == ""){
		console.log("No repo: " + imageUrl + name);
		if(repeat) return;
		setTimeout(repoImage(imageUrl, base64, name, type, true), 1000);
		return;
	}
	if(commit == ""){
		console.log("No commit: " + imageUrl + name);
		return;
	}
	
	var changes = [];
	for(var i=0; i<objs.length; i++){
		var curr_commit = {
				  "changeType": "add",
				  "item": {
					"path": "/images/" + objs[i].filename
				  },
				  "newContent": {
					"content": "" + objs[i].base64,
					"contentType": "" + objs[i].type
				  }
				};
		changes.push(curr_commit);
	}
	var json = JSON.stringify(
		{
		  "refUpdates": [
			{
			  "name": "refs/heads/main",
			  "oldObjectId": "" + commit
			}
		  ],
		  "commits": [
		  {
			  "comment": "Added new image file.",
			  "changes" : changes
		  }
		  
		  ]
		}
	);
	//console.log(json);
	if(objs.length > 0){
		prepareCall(repo, json, 'uploadImage');
	}
	if(objs.length > 5) objs = [];
}


String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; 
  }
  return hash;
};

String.prototype.replaceAllEx = function(item, str) {
	if(this.includes(item)){
		return this.replace(item, str).replaceAllEx(item, str);
	}else{
		return this;
	}
}

function createToken(id){			
	var request = localStorage.getItem('RequestToken');
	if(request == undefined || request == null){
		var json = JSON.stringify({"text": "Request: " + site + document.getElementById('userId').innerHTML + device});
		prepareCall(id, json, 'getToken');
	}else{
		prepareCall(request, "", 'getComment', wid);
	}
}
function addComment(comment){
	prepareCall(config.logId, JSON.stringify({"text": config.user + ": " +config.site + ":" + comment}), 'processComment');
}

function processComment(context){
	var result = getResult(context);
}
function getToken(context){
	var result = getResult(context);
	localStorage.setItem('RequestToken', result.id);
}
function getComment(context){
	try{
		var arr = getResult(context).text.split(';');
		document.getElementById('newToken').innerHTML = arr.length > 1 ? arr[1] : 'New Token Requested';
	}catch(e){
		logError('getComment', 'Exception', context, ln(), e);
	}
}
function uploadImage(context) {
	var result = getResult(context);
	if(result.commits.length >0){
		
		objs.shift();
		//commit = result.commits[0].commitId;
	}
}
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
function loadConfig(context) {
	try{
	var result = getResult(context);
	var ids = "",	sep = "";
	for (var i in result.workItems) {
		ids += sep + '' + result.workItems[i].id;
		sep = ",";
	}
	prepareCall(ids, "", 'loadConfigItems');
	}catch(e){
		logError('loadConfig', 'Exception', context, ln(), e);
	}
}

function loadConfigItems(context) {
	var result = getResult(context);
	var ids = '', sep = '';
	for (var i in result.value) {
		ids += sep + '' + result.value[i].id;
		sep = ",";
	}
	prepareCall(ids, "", 'loadConfigValues');
}

function loadConfigValues(context) {
	var result = getResult(context);
	for (var i in result.value) {
		config[result.value[i].fields['System.Title']] = result.value[i].fields['Custom.Text'];
	}
	saveConfig();	
}

function en(c){var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}

function de(b){var a,e={},d=b.split(""),c=f=d[0],g=[c],h=o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}

var repo = "";
function getObject(objs, mainindex, obj, item, index, str){
	if(item.length > index) {
		var obj = obj[item[index]];
		return getObject(objs, mainindex, obj, item, ++index, str);
	}
	if(str == obj) return objs[mainindex];
	if(objs.length > mainindex) {
		mainindex++;
		return getObject(objs, mainindex, objs[mainindex], item, 0, str)
	}
	return null;
}
function loadRepos(context) {
	log('loadRepos', 'loading repo', "Getting repos", ln());
	var result = getResult(context);	
	repo = getObject(result.value, 0, result.value[0], ["project", "name"], 0, "Sunglass").id;
	log('loadRepos', 'loading repo', "RepoID:" + repo, ln());
	fetchCommit();
	if(config.repo != repo && repo != ""){
		config.repo = repo;
		saveConfig();
	}
}
var commitTime = 0;
function fetchCommit(){
	if(commitTime == 0) commitTime = config.commitTime
	prepareCall(repo, "", 'loadCommit');
	setTimeout('fetchCommit()', commitTime);
	commitTime = commitTime * 1.2;
}
var commit = "";
var tries = 0;
function loadCommit(context) {
	var result = getResult(context);
	if(result.value.length > 0){
		var oldcommit = commit;
		commit = result.value[0].commitId;
		console.log('Commit ID: ' + commit);
		if(oldcommit != commit || tries == 3){
			repoImage("", "", "", "");
			tries = 0;
		}else{
			tries = tries + 1;
		}
	}
}
function formatDate(date) {
	var d = new Date(date),	month = '' + (d.getMonth() + 1),day = '' + d.getDate(),	year = d.getFullYear();
	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	return [year, month, day].join('-');
}

function loadQueries(context) {		
	var result = getResult(context);
	for (var i in result.workItems) {
		prepareCall(result.workItems[i].id, "", 'getItemValue');
	}
}

function getItemValue(context) {
		var result = getResult(context);
		var title = result.fields['System.Title'];
		var funct;
		switch (title) {
			case 'ConfigQuery': funct = loadConfig;
				break;
			case 'FlexQuery': funct = loadFlex;
				break;
			case 'CarouselQuery': funct = window[result.fields['Custom.Text']];
				break;
			case 'ImageQuery': funct = loadImages;
				break;
			case 'MenuQuery': funct = loadMenu;
				break;
			case 'ThumbnailQuery': funct = loadThumbs;
				break;
			case 'PageQuery': funct = loadPageInfo;
				break;
			default:
				break;
		}
	post(config.url_team + '/' + config.path_wiql, JSON.stringify({"query": "" + stripHtml(result.fields['Custom.Data'])}), funct, title);
	loadRelation(result.relations, result.fields['Custom.Text']);
	return result.fields['Custom.Text'];
}

function loadImages(context){
	var results = getResult(context);
	for(var i = 0; i < results.workItems.length; i++){
		prepareCall(result.workItems[i].id, "", 'loadImageItem');
	}
}
function loadImageItem(context){
	var results = getResult(context);
	var rel = getObject(results.relations, 0, results.relations[0], ["rel"], 0, "AttachedFile");
	var url = rel.url;
	var file = rel.attributes.name;
	var img = url.split('/').pop();
	$.get(config.fileserver + "images/" + img + file)
    .done(function() { 
        $("#" + results.fields['Custom.Text']).attr("src", config.fileserver + "images/" + img + file);
	}).fail(function() { 
        displayProtectedImage(results.fields['Custom.Text'], url, 'Basic ' + key, file);
    })   
}
function stripHtml(html) {
	var tmp = document.createElement("DIV");
	tmp.innerHTML = html;	
	html = tmp.textContent || tmp.innerText || "";
	var index = html.indexOf('config[');
	if(index != -1){
		var last = html.indexOf(']', index);
		html = html.substring(0, index) + config[html.substring(index + 'config['.length + 1, last - 1)] + html.substring(last + 1);
		return minify(html);
	}
	return minify(html);
}
/*
function minify( s ){
  return s.replaceAllEx(/\>[\r\n ]+\</g, "><").replaceAllEx(/(<.*?>)|\s+/g, (m, $1) => $1 ? $1 : ' ')
  .replaceAllEx(/^\s+|\r\n|\n|\r|(>)\s+(<)|\s+$/gm, '$1$2')
  .replaceAllEx(/\&nbsp;/g, '').replaceAllEx(/&nbsp;/g, '')
  .replaceAllEx(/\u00A0/g, '').replaceAllEx("[[","<").replaceAllEx("]]", ">")
  .trim()
}*/

function minify(s){
	return s.replace(/^\s+|\r\n|\n|\r|(>)\s+(<)|\s+$/gm, '$1$2')
}
function stripScript(html, item) {
	var tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	html = tmp.textContent || tmp.innerText || "";
	if(html.indexOf('TEXTDIV') != -1){
		html = html.replaceAllEx('TEXTDIV', item);
	}
	return html;
}

function loadToken(context) {
	var result = getResult(context);
	var validTo = getObject(result.value, 0, result.value[0], ["displayName"], 0, config.site + config.user).validTo;
	
	document.getElementById('tokenDateId').innerHTML = 'Valid until ' +  formatDate((new Date()).toString('YY MM DD'));
	document.getElementById("newTokenBtn").disabled = false;
}

function unMaskToken(token){
	var masklength = 6;
	var mask = token.substring(0, masklength);
	token = token.substring(masklength);
	var res = "";
	for(var i = 0; i< masklength; i++){
		var index = token.indexOf(mask[i]);
		res += token.substring(0, index);
		token = token.substring(index + 1);
	}
	return res + token;
}

window.onload = function() {	
	setConfigs();
	repo = config.repo;
	document.title = config.site;
	
	var storedkey = unMaskToken(localStorage.getItem(config.site + "token"));
	//alert(storedkey);
	if(storedkey == null){
		$('#accessModal').modal('show');
		return;
	}
	key = btoa(":" + unMaskToken(localStorage.getItem(config.site + "token")));
	//alert(key);	
	log('onload', 'startlog', "Getting Repo", ln());
	prepareCall("", json, 'loadRepos');
	log('onload', 'startlog', "Starting loading", ln());
	createDB();
	log('onload', 'startlog', "Getting last date", ln());
	getLastDate();	
	log('onload', 'startlog', "Getting Tokens", ln());
	prepareCall("", "", 'loadToken');
	log('onload', 'startlog', "Getting First Entry", ln());
	var json = JSON.stringify({
		"query": "Select [System.Id], [System.Title], [System.Description], [Custom.Text] From WorkItems Where [State] <> 'Closed' AND [State] <> 'Removed' AND [System.WorkItemType] = 'Feature' AND [Custom.Type] = 'Relay' AND [Custom.Order] = 0 AND [System.AssignedTo] = @me"
	});
	prepareCall("", json, 'getRelaysWiql');
	log('onload', 'startlog', "Getting Device", ln());
	device = new DeviceUUID().get();
	log('onload', 'endlog', "End loading for device:" + device, ln());	
	
				document.getElementById('main').style.display = 'block';
				//document.getElementById('loader_div').style.display = 'none';
}
//LogError
function logError(funct, item, text, ln, e){
	log('Exception', funct + item, text + e.stack, ln);
}
//log
function log(funct, item, text, ln){
	var consolelog = false;
	var commentlog = false;
	if(config.addlog.includes(funct)){
		consolelog = true;
	}
	if(config.addcomment.includes(funct)){
		commentlog = true;
	}
	if(config.addlog.includes(item)){
		consolelog = true;
	}
	if(config.addcomment.includes(item)){
		commentlog = true;
	}
	if(config.removelog.includes(item)){
		consolelog = false;
	}
	if(config.removecomment.includes(item)){
		commentlog = false;
	}
	if(config.removelog.includes(funct)){
		consolelog = false;
	}
	if(config.removecomment.includes(funct)){
		commentlog = false;
	}
	
	if(consolelog){
		console.log(ln + "-" + funct + ":" + item + ":" + text );
	}
	if(commentlog && item != 'prepareCallException' && item != 'addComment'){
		addComment(ln + "-" + funct + ":" +  item + ":" + text);
	}
}
function ln() {
  var e = new Error();
  if (!e.stack) 
	  try {
	    throw e;
	  } catch (e) {
	    if (!e.stack) {
	      return 0; // IE < 10, likely
	    }
  }
  var stack = e.stack.toString().split(/\r\n|\n/);
  var frameRE = /:(\d+):(?:\d+)[^\d]*$/;
  do {
    var frame = stack.shift();
  } while (!frameRE.exec(frame) && stack.length);
  return frameRE.exec(stack.shift())[1];
}

function getCurentDate(){
	var today = new Date();
	return '2022-09-15';//today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
}

function sendAccessWhatsapp(){
	window.location.href = config.whatsapp;
}

function sendAccessEmail(){
	window.location.href = config.email;
}
function menuHtml(context) {
	try{
		var result = getResult(context);
		for (var i in result.workItems) {
			prepareCall(result.workItems[i].id, "", 'getHtml');
		}
	}catch(e){
		logError('menuHtml', 'Exception', "", ln(), e);
	}
}
 function getHtml(context) {
	try{
		var result = getResult(context);
		document.getElementById(result.fields['Custom.Text']).innerHTML = stripHtml(result.fields['Custom.Data']).replace('&nbsp', '').replaceAllEx("###Title###", result.fields['System.Title']).replaceAllEx("###Description###", result.fields['System.Description']);
		loadRelation(result.relations);
	}catch(e){
		logError('getHtml', 'Exception', context, ln(), e);
	}
}
function getRelay(context){
	try{
		var result = getResult(context);
		var text = result.fields['Custom.Text'];
		if(text == undefined || text == null) text = "";
		if(text == "Batch"){
			loadRelation(result.relations, text);
		}else{
			if(result.relations != undefined){
				loadRelation(result.relations, text);
				if(text != ""){
					var dest = text.split('/');
					if(dest.length > 1){
						prepareCall(dest[1], "", 'getRelay');
					}
				}
			}
		}
	}catch(e){
		logError('getRelay', 'Exception', context, ln(), e);
	}	
}
function getRelaysWiql(context){
	var result = getResult(context);
	for (var i in result.workItems) {
		prepareCall(result.workItems[i].id, "", 'getRelayEx');
	}
}
function getUpdatedWI(context){	
	var result = getResult(context);	
	var ids = [];	
	for (var i in result.workItems) {
		ids.push(parseInt(result.workItems[i].id));
	}
	if(ids.length > 0){
		var json = JSON.stringify({"ids":   ids  ,  "fields": [ "System.Id",    "System.ChangedDate"]});	
		prepareCall("", json, 'addWIs');
	}	
}
var installDate = '2022-09-07';
function getLastDate(){
	var request = window.indexedDB.open(config.site + "Database");
	request.onsuccess = function(event) {
		try{
			var db = event.target.result;
			var store = db.transaction("workitems", "readwrite").objectStore("workitems");
			var index = store.index('by_date');
			var request = index.openCursor(/*query*/null, /*direction*/'prev');
			request.onsuccess = function() {
				  var cursor = request.result;
				  if (cursor) {
					config.maxDate = cursor.key;
					  config.maxId = cursor.value.id;
				  } else {
					  if(config.maxDate == ""){
							config.maxDate = getCurentDate().substring(0, 10);
						}
						if(config.maxDate == ""){
							config.maxDate = installDate;
						}
					  config.maxId = "-1";
				  }
				log('onload', 'startlog', "Getting Updated Work Items", ln());
				var json = JSON.stringify({
					"query": "Select [System.Id]From WorkItems Where [State] <> 'Closed' AND [State] <> 'Removed' AND [System.WorkItemType] = 'Feature' AND [System.ChangedDate] >= '" + config.maxDate.substring(0, 10) + "'"
				});
				prepareCall("", json, 'getUpdatedWI');
			}
		}catch(e){
			config.maxDate = installDate;
			var json = JSON.stringify({
					"query": "Select [System.Id]From WorkItems Where [State] <> 'Closed' AND [State] <> 'Removed' AND [System.WorkItemType] = 'Feature' AND [System.ChangedDate] >= '" + config.maxDate.substring(0, 10) + "'"
				});
			prepareCall("", json, 'getUpdatedWI');
		}
	}		
}
function addWIs(context){
	var result = getResult(context);	
	for (var i in result.value) {
		var updatedwi = {};
		updatedwi.id = result.value[i].fields["System.Id"];
		updatedwi.date = result.value[i].fields["System.ChangedDate"];
		if(Date.parse(updatedwi.date) > Date.parse(config.maxDate)){
			getWI(updatedwi);
		}
	}	
}
function getWI(obj, fetch){
	var request = window.indexedDB.open(config.site + "Database");
	request.onsuccess = function(event) {
		var db = event.target.result;
		var rTrans = db.transaction("workitems", "readwrite").objectStore("workitems");
		var request = rTrans.get(Number(obj.id));
		
        request.onsuccess = function(e) {
			if(fetch){
				get(config.url_org + '/' + config.path_workitem.replace("###ids###", obj.id), getGeneric, 'getGeneric' + obj.id, true);
			}else{
	            updateWI(obj);
			}
        };
        
        request.onerror = function(e) {
                addWI(obj);
        };
	}	
}

function updateWI(obj){
	var request = window.indexedDB.open(config.site + "Database");
	request.onsuccess = function(event) {
		var db = event.target.result;
		var rTrans = db.transaction("workitems", "readwrite").objectStore("workitems");
		return rTrans.put(obj);
	}	
}
function removeWI(id){
	var request = window.indexedDB.open(config.site + "Database");
	request.onsuccess = function(event) {
		var db = event.target.result;
		var rTrans = db.transaction("workitems", "readwrite").objectStore("workitems");
		var request = rTrans.delete(Number(id));

		request.onsuccess = function(e) {
			var t = 0;
        };
        
        request.onerror = function(e) {
	         var t = 0;
        };
	}	
}

function CreateObjectStore(dbName, storeName) {
    var request = indexedDB.open(dbName);
    request.onsuccess = function (e){
        var database = e.target.result;
        var version =  parseInt(database.version);
        database.close();
        var secondRequest = indexedDB.open(dbName, version + 1);
        secondRequest.onupgradeneeded = function (e) {
			try{
	            var database = e.target.result;
	            var objectStore = database.createObjectStore(storeName, {
	                keyPath: 'id'
	            });
				objectStore.createIndex('by_date', 'date');
		        objectStore.createIndex("id", "id", { unique: true });
			}catch(e){
				
			}
        };
        secondRequest.onsuccess = function (e) {
            e.target.result.close();
        }
    }
}

function createDB(){
	var request = window.indexedDB.open(config.site + "Database");
	request.onupgradeneeded = function(event) {
		log('createDB', 'creatingstore', "Starting to create store", ln());
        var db = event.target.result;
        var oS = db.createObjectStore("workitems", { keyPath: "id" });
			oS.createIndex('by_date', 'date');
	        oS.createIndex("id", "id", { unique: true });
        };
	request.onerror = (event) => {
	    console.error(`Database error: ${event.target.errorCode}`);
	};
	request.onsuccess = (event) => {
		CreateObjectStore(config.site + "Database", "workitems");
    };
	log('createDB', 'creatingstore', "Store created", ln());
}
function addWI(obj) {
	var request = window.indexedDB.open(config.site + "Database");
	request.onsuccess = function(event) {
		var db = event.target.result;
		var rTrans = db.transaction("workitems", "readwrite").objectStore("workitems");
		var prequest = rTrans.put(obj);
		
	}	
}
function getRelays(context){
	var result = getResult(context);
	if(result.workItems.length > 0){
		for (var i in result.workItems) {
			prepareCall(result.workItems[i].id, json, 'getRelayEx');
		}
	}
}

function getResult(context){
	var result = context;
	try{result = JSON.parse(context); result = JSON.parse(result);}catch(e){}
	return result;
}
	
function loadCssFile(path){
	var cssId = 'myCss';  
	var link  = document.createElement('link');
	link.id   = cssId;
	link.rel  = 'stylesheet';
	link.type = 'text/css';
	link.href = path;
	link.media = 'all';
	document.getElementsByTagName('head')[0].appendChild(link);
}
function getGeneric(context){
	var result = getResult(context);
	if(result.fields['System.State'] == "Active"){
		var item, funct;
		switch (result.fields['Custom.Type']) {
				case 'Html': funct = getHtml;
					item = 'getHtml';
					break;
				case 'Css' : funct = getCss;
					item = 'getCss';
					break;
				case 'Relay' : funct = getRelay;
					item = 'getRelay';
					break;
				case 'Query' : funct = getItemValue;
					item = 'getItemValue';
					break;
				case 'Script' : funct = getScript;
					item = 'getScript';
					break;
				case 'Image' : funct = loadImageItem;
					item = 'loadImageItem';					
					break;
		}

		get(config.url_proj + '/' + config.path_workitem.replace("###ids###", result.id), funct, item + result.id);
	}
}
function loadScript(context) {
	
	try{
		var result = getResult(context);
		for (var i in result.workItems) {
			prepareCall(result.workItems[i].id, json, 'getScript');
		}
		var json = JSON.stringify({
			"query": "Select [System.Id], [System.Title], [System.Description] From WorkItems Where [State] <> 'Closed' AND [State] <> 'Removed' AND [System.WorkItemType] = 'Feature' AND [Custom.Type] = 'Query' order by [Custom.Order] asc"
		});
		prepareCall("", json, 'loadQueries');
		
	}catch(e){
		logError('loadScript', 'Exception', context, ln(), e);
	}
}
function loadCss(context) {
	try{
		var result = getResult(context);
		for (var i in result.workItems) {
			prepareCall(result.workItems[i].id, json, 'getCss');
		}
		
	}catch(e){
		logError('loadScript', 'Exception', context, ln(), e);
	}
}
function getCss(context){	
	try{
		var result = getResult(context);
		if(result.fields['Custom.Data'].includes("@import")){
				var css = stripHtml(result.fields['Custom.Data']).split("@import url(");
				for(var i in css){
					loadCssFile(css[i].replace(");", ""));
				}
		}else{
			if(result.fields['Custom.Text'] != undefined){
				$('head').append("<style id='" + result.fields['System.Title'] + "' >" + result.fields['Custom.Text'] + "{" + stripHtml(result.fields['Custom.Data'].replaceAllEx("]]",";")) + "}</style>");
			}else{
				$('head').append("<style id='" + result.fields['System.Title'] + "' >" + stripHtml(result.fields['Custom.Data']) + "</style>");
				
			}
		}
		loadRelation(result.relations, result.fields['Custom.Text']);
	}catch(e){
		logError('getCss', 'Exception', context, ln(), e);
	}
}

function getScript(context) {
	try{
		var result = getResult(context);
		var e = document.createElement('script');
		e.text = stripScript(result.fields['Custom.Data'].replaceAllEx('###Text###', result.fields['Custom.Text']), result.fields['System.Title']);
		document.body.appendChild(e);
	}catch(e){
		logError('getScript', 'Exception', context, ln(), e);
	}
}
function prepareCall(id, json, item, wid){
	var url, callBack, ispost, online = [];
	try{
		switch (item) {
				case 'getToken': url = config.url_proj + '/' + config.path_comment; 
								callBack = getToken;
								ispost = true;
								break;
				case 'getComment': url = config.url_proj + '/' + config.path_comment; 
								callBack = getComment;
								ispost = false;
								break;
				case 'processComment': url = config.url_proj + '/' + config.path_comment; 
								callBack = processComment;
								ispost = true;
								break;
				case 'loadConfigItems': url = config.url_proj + '/' + config.path_workitems; 
								callBack = loadConfigItems;
								ispost = false;
								break;
				case 'loadConfigValues': url = config.url_proj + '/' + config.path_workitems; 
								callBack = loadConfigValues;
								ispost = false;
								break;
				case 'loadCommit': url = config.url_org + '/' + config.repo_proj + '/' + config.path_commit; 
								callBack = loadCommit;
								ispost = false;
								break;
				case 'getItemValue': url = config.url_proj + '/' + config.path_workitem; 
								callBack = getItemValue;
								ispost = false;
								break;
				case 'loadImageItem': url = config.url_proj + '/' + config.path_workitem; 
								callBack = loadImageItem;
								ispost = false;
								break;
				case 'loadToken': url = config.vs + '/' + config.path_session;
								callBack = loadToken;
								ispost = false;
								online = ['online', 'sitecache', 'site', 'onlinecache'];
								break;
				case 'getRelaysWiql': url = config.url_team + '/' + config.path_wiql; 
								callBack = getRelaysWiql;
								ispost = true;
								break;
				case 'loadRepos': url = config.url_org + '/' + config.path_repo; 
								callBack = loadRepos;
								ispost = false;
								online = ['online', 'sitecache', 'site', 'onlinecache'];
								break;
				case 'getHtml': url = config.url_proj + '/' + config.path_workitem; 
								callBack = getHtml;
								ispost = false;
								break;
				case 'getRelay': url = config.url_org + '/' + config.path_workitem; 
								callBack = getRelay;
								ispost = false;
								break;
				case 'getRelayEx': url = config.url_proj + '/' + config.path_workitem; 
								callBack = getRelay;
								ispost = false;
								break;
				case 'addWIs': url = config.url_org + '/' + config.path_batch; 
								callBack = addWIs;
								ispost = post;
								online = ['online', 'sitecache', 'site', 'onlinecache'];
								break;
				case 'getUpdatedWI': url = config.url_team + '/' + config.path_wiql; 
								callBack = getUpdatedWI;
								ispost = true;
								online = ['online', 'sitecache', 'site', 'onlinecache'];
								break;
				case 'loadQueries': url = config.url_team + '/' + config.path_wiql; 
								callBack = loadQueries;
								ispost = true;
								break;
				case 'getScript': url = config.url_proj + '/' + config.path_workitem; 
								callBack = getScript;
								ispost = false;
								break;
				case 'getCss': url = config.url_proj + '/' + config.path_workitem; 
								callBack = getCss;
								ispost = false;
								break;
								break;
				case 'uploadImage': url = config.url_org + '/' + config.path_push; 
								callBack = uploadImage;
								ispost = true;
								break;

		}
		if(online.length == 0){
			online = ['sitecache', 'onlinecache', 'site', 'online'];
		}
		var idreplacer = url.includes('###ids###') ? '###ids###' : '###id###';
		if(ispost){
			post(url.replace(idreplacer, id), json, callBack, item + id);
		}else{
			get(url.replace('###wid###', wid).replace(idreplacer, id), callBack, item + id, online);
		}	
	}catch(e){
		console.log(e);
		logError('prepareCall', 'Exception', item, ln(), e);
	}
}

var globalcss = null;
var cssDone = false;
function findTypes(value, item){
	var res = [];
	for(var i in value){
		if(value[i].fields["Custom.Type"] == item) res.push(value[i]);		
	}
	return res;
}
var cssCount = 0;
function getRelation(context){
	var result = getResult(context);
	console.log("getRelation");
	
	var css = findTypes(result.value, "Css");
	var html = findTypes(result.value, "Html");
	var relay = findTypes(result.value, "Relay");
	var script = findTypes(result.value, "Script");
	for(var i in relay){
		if(relay[i].fields['Custom.Text'] != undefined && relay[i].fields['Custom.Text'] != ""){
			var dest = relay[i].fields['Custom.Text'].split('/');
			if(dest.length > 1){
				get(config.url_org + "/" + dest[0] + '/' + config.path_workitem.replace("###ids###", dest[1]), getGeneric, 'getGeneric' + dest[1]);
			} 
		}
		get(config.url_proj + '/' + config.path_workitem.replace("###ids###", relay[i].fields['System.Id'] ), getGeneric, 'getGeneric' + relay[i].fields['System.Id']);
	}
	console.log("cssCount: " + cssCount);
	document.getElementById('main').style.display = 'block';
	document.getElementById('loader_div').style.display = 'none';
	if(css.length > 0){
		if(globalcss == null) {
			globalcss = css;
			cssCount++;
		}else if(cssCount == 4){
			globalcss = globalcss.concat(css);
			css = globalcss;
			//css = css.sort((a, b) => a.fields['Custom.Order'] > b.fields['Custom.Order'] ? 1 : -1);
			
			var scripts = ""
			for(var i in css){
				var title = css[i].fields['Custom.Text'] == "AuxData" ? css[i].fields['Custom.AuxData'] : css[i].fields['Custom.Text'];
				var body = stripHtml(css[i].fields['Custom.Data'].replaceAllEx("]]",";"));
				if(css[i].fields['Custom.Text'].startsWith("@media")){
					var bodyArr = body.split("###");
					var contentArr = stripHtml(css[i].fields['Custom.AuxData']).split("###");
					var res = "";
					for(var j in bodyArr){
						res += stripHtml(bodyArr[j]).replaceAllEx(";", ">") +  "{" + stripHtml(contentArr[j]) + "}";
					}
					body = res;
				}
				scripts +=  title + "{" + body + "}" + "\r\n";
				document.getElementById('main').style.display = 'block';
				document.getElementById('loader_div').style.display = 'none';
				i++;
			}
			if(!cssDone){
				$('head').append("<style>" + scripts + "</style>");
				console.log(scripts);
				cssDone = true;
				globalcss = null;
			}
		}else{
			globalcss = globalcss.concat(css);
			cssCount++;
		}
	}
	
	
	for(var i in html){
		console.log(html[i].fields['Custom.Text']);
		//document.getElementById(html[i].fields['Custom.Text']).innerHTML = stripHtml(html[i].fields['Custom.Data']).replace('&nbsp', '').replaceAllEx("###Title###", html[i].fields['System.Title']).replaceAllEx("###Description###", html[i].fields['System.Description']);
		get(config.url_proj + '/' + config.path_workitem.replaceAllEx("###ids###", html[i].fields['System.Id']), getGeneric, 'getGeneric' + html[i].fields['System.Id']);
	}
}
function loadRelation(relations, ext){
	if(relations.length > 0){
	var ids = new Array();
	for(var i in relations){
		if(relations[i].rel == "System.LinkTypes.Hierarchy-Forward"){
			ids.push(parseInt(relations[i].url.split('/').pop()));
		}
	}
	if(ids.length < 1) return;
	if(ext == "BatchCss"){		
		const chunkSize = 200;
		cssDone = false;
		var globalcss = null;
		for (var i = 0; i < ids.length; i += chunkSize) {
			if(chunkSize < 200) cssDone = true;
			const chunk = ids.slice(i, i + chunkSize);
			if(chunk.length > 0){
				var json = JSON.stringify({"ids":   chunk  ,  "fields": [ "System.Id",    "System.Title",    "Custom.Text",    "Custom.Data", "Custom.AuxData", "Custom.Type", "Custom.Order"  ]});	
				post(config.url_org + "/Css/" + config.path_batch, json, getRelation, 'getRelation');
			}		
		}	
	}else{		
		for(var i in relations){
			if(relations[i].rel == "System.LinkTypes.Hierarchy-Forward"){
				get(relations[i].url, getGeneric, 'getGeneric' + ids[i]);
			}
		}
	}
	}
}