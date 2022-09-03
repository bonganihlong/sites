
function post(url, json, callBack, item) {
	var base = btoa(item + url + key);
	var data = getWithExpiry(base);
	if(data != null) {
		//console.log('PostingDB: ' + item);
		callBack(data);
		return;
	}
	
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Authorization', 'Basic ' + key);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onreadystatechange = function() {
		if(xhr.readyState == XMLHttpRequest.DONE){
			if (this.status == 200) { 
				handleCaller(this, base, callBack, item);
			}else{
				console.log('Posting failed: ' + url + ":" + item + ":" + json);
			}
			}
	}
	xhr.send(json);
}

var ttls = [];

function setWithExpiry(key, value, ttl) {
	const now = new Date();
	const item = {
		value: value,
		expiry: now.getTime() + ttl,
	}
	//localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
	const itemStr = localStorage.getItem(key)
	if (!itemStr) {
		return null
	}
	const item = JSON.parse(itemStr);
	const now = new Date();
	if (now.getTime() > item.expiry) {
		localStorage.removeItem(key);
		return null
	}
	return item.value;
}

var config = {};
config["ttl"] = 5000;
var ttls = {};
function handleCaller(context, base, callBack, item){	
	var currttl = ttls[item];
	if(currttl == null) currttl = config["ttl"];
	setWithExpiry(base, context.responseText, currttl);
	if(context.responseText != "" && context.responseText != null && context.responseText != undefined){
	callBack(context.responseText);
	}
}

function get(url, callBack, item) {
	var base = btoa(item + url + key);
	var data = getWithExpiry(base);
	//console.log('Getting len: ' + item + data);
	if(data != null) {
		callBack(data);
		return;
	}
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.setRequestHeader('Authorization', 'Basic ' + key);
	xhr.onreadystatechange  = function() {
		if(xhr.readyState == XMLHttpRequest.DONE){
			if (this.status == 200) {
				return handleCaller(this, base, callBack, item);
			}else{
				if(url.includes('Session') && this.status != 200 ){
					$('#accessModal').modal('show');
					document.getElementById('genTokenDiv').style.display = 'block';
				}
				console.log('Getting failed: ' + this.status + ":" + item + ":" + url);
			}
		}
	}
	xhr.send();
}


function saveToken(){
	localStorage.setItem(site + 'userId', $('#userId').val());
	localStorage.setItem(site + 'token', $('#tokenId').val());
	//alert(localStorage.getItem(site + "token"));
	$('#accessModal').modal('hide');
}

function fetchWithAuthentication(url, authToken) {
	const headers = new Headers();
	headers.set('Authorization', authToken);
	headers.set('Access-Control-Allow-Origin', '*');
	headers.set('Accept-Encoding', 'gzip,deflate');
	headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	return fetch(url, {
		headers
	});
}

async function displayProtectedImage(imageId, imageUrl, authToken, name) {
	try {
		const response = await fetchWithAuthentication(imageUrl, authToken);
		const blob = await response.blob();
		
		const objectUrl = URL.createObjectURL(blob);		
		
		const imageElement = document.getElementById(imageId);
		imageElement.src = objectUrl;
		
		var blobToBase64 = function(blob, callback) {
		var reader = new FileReader();
			reader.onload = function() {
				var dataUrl = reader.result;
				var base64 = dataUrl.split(',')[1];
				callback(imageUrl, base64, name);
			};
			reader.readAsDataURL(blob);
		};
		blobToBase64(blob, repoImage);
		
		document.getElementById(imageId + '_div').style.display = 'block';
	} catch (e) {
		console.log(e);
		console.log(imageUrl);
		console.log(imageId);
	}
}


function repoImage(imageUrl, base64, name){
	var filename = imageUrl.split('/').pop() + name;
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
			  "changes": [
				{
				  "changeType": "add",
				  "item": {
					"path": "/images/" + filename
				  },
				  "newContent": {
					"content": "" + base64,
					"contentType": "base64encoded"
				  }
				}
			  ]
			}
		  ]
		}
	);
	post(url_org + '/' + path_push.replace('###repositoryId###', repo), json, uploadImage, 'uploadImage');
}

function createToken(){
	var filename = imageUrl.split('/').pop() + name;
	
var date = new Date();
date = date.addDays(5);
var user = document.getElementById('userId').innerHTML;

	var json = JSON.stringify(
		{
		  "displayName": "" + user + site + device,
		  "scope": "app_token",
		  "validTo": "" + date.toString,
		  "allOrgs": false
		}
	);
	post(url_org + '/' + path_token, json, uploadImage, 'uploadImage');
}

function getToken(){
	var result = JSON.parse(context);
		console.log('Uploaded Image: ' + uploadImage);
		document.getElementById('userId').innerHTML = result.patToken.token;
}

function uploadImage(context) {
		var result = JSON.parse(context);
		console.log('Uploaded Image: ' + uploadImage);
		commit = result.commits[0].commitId;
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}



var site = 'Sunglass';
document.title = site;



var base = 'https://dev.azure.com';
var org = 'kukhanya';
var project = 'FormForm';
var projectCSS = 'CSS';
var url_org = base + "/" + org;
var url_proj = url_org + "/" + project;
var url_projCSS = url_org + "/" + projectCSS;
var version = 'api-version=6.0';
var path_workitems = '_apis/wit/workitems?ids=#ids#&' + version;
var path_workitem = '_apis/wit/workitems/#ids#?' + version + '&$expand=all';
var path_wiql = '_apis/wit/wiql?' + version;
var path_batch = '_apis/wit/workitemsbatch?' + version;
var path_repo = '_apis/git/repositories?' + version;
var path_commit = "_apis/git/repositories/###repositoryId###/commits?&$top=1&searchCriteria.refName=refs/heads/main" + version;
var path_push = "_apis/git/repositories/###repositoryId###/pushes?" + version;
var path_token = "_apis/tokens/pats?api-version=7.1-preview.1";


var user = 'Bongani';
localStorage.setItem('userId', user);
config['userId'] = user;

var team = 'FormFormTeam';
var url_team = url_proj + '/' + team;
var tokenDate = '';

var idsArr = [];
var index;



function loadConfig(context) {
		var result = JSON.parse(context);
		var ids = "",
			sep = "";
		for (var i in result.workItems) {
			ids += sep + '' + result.workItems[i].id;
			sep = ",";
		}
		get(url_proj + '/' + path_workitem.replaceAll("#ids#", ids), loadConfigItems, 'loadConfigItems' + ids);
}

function loadConfigItems(context) {
	var result = JSON.parse(context);
	var ids = '',
		sep = '';
	for (var i in result.relations) {
		ids += sep + '' + result.relations[i].url.split('/').pop();
		sep = ",";
	}
	get(url_proj + '/' + path_workitems.replaceAll("#ids#", ids), loadConfigValues, 'loadConfigValues' + ids);
}


function loadConfigValues(context) {
		var result = JSON.parse(context);
		for (var i in result.value) {
			console.log("Config: " + result.value[i].fields['System.Title'] + ":" + result.value[i].fields['Custom.Text']);
			config[result.value[i].fields['System.Title']] = result.value[i].fields['Custom.Text'];
			//document.body.innerHTML = document.body.innerHTML.replaceAll("config['" + result.value[i].fields['System.Title'] +"']" , config[result.value[i].fields['System.Title']]);
		}
}

var repo = "";
function loadRepos(context) {
		var result = JSON.parse(context);
		repo = result.value.find(item => item.project.name == "Sunglass").id;
		get(url_org + "/" + site + '/' + path_commit.replace('###repositoryId###', repo), loadCommit, 'loadCommit');
}
var commit = "";
function loadCommit(context) {
		var result = JSON.parse(context);
		//console.log('Commit ' + context);
		commit = result.value[0].commitId;
}

var jsonConfig = JSON.stringify({
	"query": "Select [System.Id], [System.Title], [System.State] From WorkItems Where [State] <> 'Closed' AND [State] <> 'Removed' AND [System.WorkItemType] = 'Feature' AND [Custom.Type] = 'Config' AND [System.Title] = 'Sunglass' order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc"
});




function formatDate(date) {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2)
		month = '0' + month;
	if (day.length < 2)
		day = '0' + day;

	return [year, month, day].join('-');
}

function loadQueries(context) {		
	var result = JSON.parse(context);
	for (var i in result.workItems) {
		getItemText(result.workItems[i].id);
	}
}

function getItemText(id) {
	get(url_proj + '/' + path_workitem.replaceAll("#ids#", id), getItemValue, 'getItemValue' + id);
}
 
 function loadcarousels(title, funct){
post(url_team + '/' + path_wiql, JSON.stringify({
					"query": "" + queries[title]
				}), window[funct], title);
 }

function getItemValue(context) {
		var result = JSON.parse(context);
		var title = result.fields['System.Title'];
		queries[title] = stripHtml(result.fields['Custom.Data']);
		console.log(title);
		switch (title) {
			case 'ConfigQuery':
				post(url_team + '/' + path_wiql, JSON.stringify({
					"query": "" + queries[title]
				}), loadConfig, title);
				break;
			case 'FlexQuery':
				post(url_team + '/' + path_wiql, JSON.stringify({
					"query": "" + queries[title]
				}), loadFlex, title);
				break;
			case 'CarouselQuery':
				loadcarousels(title, result.fields['Custom.Text']);
				break;
			case 'ImageQuery':
				post(url_team + '/' + path_wiql, JSON.stringify({
					"query": "" + queries[title]
				}), loadImages, title);
				break;
			case 'MenuQuery':
				post(url_team + '/' + path_wiql, JSON.stringify({
					"query": "" + queries[title]
				}), loadMenu, title);
				break;
			case 'ThumbnailQuery':
				post(url_team + '/' + path_wiql, JSON.stringify({
					"query": "" + queries[title]
				}), loadThumbs, title);
				break;
			case 'PageQuery':
				post(url_team + '/' + path_wiql, JSON.stringify({
					"query": "" + queries[title]
				}), loadPageInfo, title);
				break;
			default:
				break;
		}
		loadRelation(result.relations, result.fields['Custom.Text']);
		return result.fields['Custom.Text'];
}

function loadImages(context){
	var results = JSON.parse(context);
	for(var i = 0; i < results.workItems.length; i++){
		console.log("image: " + results.workItems[i].id);
		get(url_proj + '/' + path_workitem.replaceAll("#ids#", results.workItems[i].id), loadImageItem, 'loadImageItem'   + results.workItems[i].id);
	}
}

var fileserver = "https://bonganihlong.github.io/sites/";
function loadImageItem(context){
	var results = JSON.parse(context);
	var rel = results.relations.find(attachment => attachment.rel == "AttachedFile");
	var url = rel.url;
	var file = rel.attributes.name;
	var img = url.split('/').pop();
	console.log("Image " + results.fields['Custom.Text'] + ":" + img);
	$.get(fileserver + "images/" + img + file)
    .done(function() { 
        $("#" + results.fields['Custom.Text']).attr("src", fileserver + "images/" + img + file);
		console.log("Image found: " + img);
    }).fail(function() { 
        displayProtectedImage(results.fields['Custom.Text'], url, 'Basic ' + key, file);
    })
   
}

function stripHtml(html) {
	let tmp = document.createElement("DIV");
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

function minify( s ){
  return s.replaceAll(/\>[\r\n ]+\</g, "><").replaceAll(/(<.*?>)|\s+/g, (m, $1) => $1 ? $1 : ' ')
  .replaceAll(/^\s+|\r\n|\n|\r|(>)\s+(<)|\s+$/gm, '$1$2')
  .replaceAll(/\&nbsp;/g, '').replaceAll(/&nbsp;/g, '')
  .replaceAll(/\u00A0/g, '').replaceAll("[[","<").replaceAll("]]", ">")
  .trim()
}

function stripScript(html, item) {
	let tmp = document.createElement("DIV");
	tmp.innerHTML = html;
	html = tmp.textContent || tmp.innerText || "";
	if(html.indexOf('TEXTDIV') != -1){
		html = html.replaceAll('TEXTDIV', item);
	}
	return html;
}
var queries = []

function loadToken(context) {
	//console.log(context);
	var result = JSON.parse(context);
	var date = new Date(result.value.find(x => x.displayName == site + 'Token').validTo);
	tokenDate = date.toString('YY MM DD');
	document.getElementById('tokenDateId').innerHTML = 'Valid until ' +  formatDate(tokenDate);
	document.getElementById("newTokenBtn").disabled = false;
}

var key = "";
var device = "";
window.onload = function() {
	//alert(localStorage.getItem(site + "token"));
	key = btoa(":" + localStorage.getItem(site + "token"));
	//alert(key);
	get('https://vssps.dev.azure.com/kukhanya' + '/_apis/Token/SessionTokens?api-version=5.0-preview', loadToken, 'loadToken');	

	var json = JSON.stringify({
		"query": "Select [System.Id], [System.Title], [System.Description] From WorkItems Where [State] <> 'Closed' AND [State] <> 'Removed' AND [System.WorkItemType] = 'Feature' AND [Custom.Type] = 'Relay' AND [System.AssignedTo] = @me"
	});
	post(url_team + '/' + path_wiql, json, getRelaysWiql, 'getRelaysWiql');
	get(url_org + '/' + path_repo, loadRepos, 'loadRepos');
	device = new DeviceUUID().get();
	
}

function sendAccessWhatsapp(){
window.location.href = "https://api.whatsapp.com/send?phone=27726359342&text=AccessSunglass";
}

function sendAccessEmail(){
window.location.href = "mailto:bonganihlong@icloud.com?subject=RequestAccess&body=AccessSunglass";
}

function menuHtml(context) {
	try{
		var result = JSON.parse(context);
		//console.log(context);
		for (var i in result.workItems) {
			get(url_proj + '/' + path_workitem.replaceAll("#ids#", result.workItems[i].id), getHtml, 'getHtml' + result.workItems[i].id);
		}
	}catch(e){
	console.log(context);
}
}

async function getHtml(context) {
	try{
		var result = JSON.parse(context);
		console.log(result.fields['System.Title'] + "-" + result.fields['Custom.Text']);
		document.getElementById(result.fields['Custom.Text']).innerHTML = stripHtml(result.fields['Custom.Data']).replace('&nbsp', '').replaceAll("###Title###", result.fields['System.Title']).replaceAll("###Description###", result.fields['System.Description']);
		loadRelation(result.relations);
	}catch(e){
		console.log(e);
		console.log(context);
	}
}




function loadRelation(relations, ext){
	if(relations.length > 0){
	var ids = new Array();
	var sep = "";
	var arr = relations.filter(item => item.rel == "System.LinkTypes.Hierarchy-Forward");
	for(var i in arr){
			ids.push(parseInt(arr[i].url.split('/').pop()));
		}
	
	console.log("loadRelation" + ext);
	//console.log("loadRelation" + ids);
	if(ext == "BatchCss"){	
		console.log(arr[i].url);	
		const chunkSize = 200;
		cssDone = false;
		var globalcss = null;
		for (let i = 0; i < ids.length; i += chunkSize) {
			if(chunkSize < 200) cssDone = true;
			const chunk = ids.slice(i, i + chunkSize);
			if(chunk.length > 0){
				var json = JSON.stringify({"ids":   chunk  ,  "fields": [    "System.Id",    "System.Title",    "Custom.Text",    "Custom.Data", "Custom.AuxData", "Custom.Type", "Custom.Order"  ]});	
				post(url_org + "/Css/" + path_batch, json, getRelation, 'getRelation');
			}		
		}	
	}else{		
		for(var i in arr){
			get(arr[i].url, getGeneric, 'getGeneric' + ids[i]);
		}
	}
	}
}

var globalcss = null;
var cssDone = false;
var cssCount = 0;
function getRelation(context){
	var result = JSON.parse(context);
	console.log("getRelation");
	
	var css = result.value.filter(item => item.fields["Custom.Type"] == "Css");
	var html = result.value.filter(item => item.fields["Custom.Type"] == "Html");
	var relay = result.value.filter(item => item.fields["Custom.Type"] == "Relay");
	var script = result.value.filter(item => item.fields["Custom.Type"] == "Script");
	for(var i in relay){
		if(relay[i].fields['Custom.Text'] != undefined && relay[i].fields['Custom.Text'] != ""){
			var dest = relay[i].fields['Custom.Text'].split('/');
			if(dest.length > 1){
				//get(url_org + "/" + dest[0] + '/' + path_workitem.replaceAll("#ids#", dest[1]), getGeneric, 'getGeneric' + dest[1]);
			} 
		}
		get(url_proj + '/' + path_workitem.replaceAll("#ids#", relay[i].fields['System.Id'] ), getGeneric, 'getGeneric' + relay[i].fields['System.Id']);
	}
	console.log("cssCount: " + cssCount);
	if(css.length > 0){
		if(globalcss == null) {
			globalcss = css;
			cssCount++;
		}else if(cssCount == 6){
			globalcss = globalcss.concat(css);
			css = globalcss;
			css = css.sort((a, b) => a.fields['Custom.Order'] > b.fields['Custom.Order'] ? 1 : -1);
			
			var scripts = ""
			for(var i in css){
				var title = css[i].fields['Custom.Text'] == "AuxData" ? css[i].fields['Custom.AuxData'] : css[i].fields['Custom.Text'];
				var body = stripHtml(css[i].fields['Custom.Data'].replaceAll("]]",";"));
				if(css[i].fields['Custom.Text'].startsWith("@media")){
					var bodyArr = body.split("###");
					var contentArr = stripHtml(css[i].fields['Custom.AuxData']).split("###");
					var res = "";
					for(var j in bodyArr){
						res += stripHtml(bodyArr[j]).replaceAll(";", ">") +  "{" + stripHtml(contentArr[j]) + "}";
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
				//console.log(scripts);
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
		//document.getElementById(html[i].fields['Custom.Text']).innerHTML = stripHtml(html[i].fields['Custom.Data']).replace('&nbsp', '').replaceAll("###Title###", html[i].fields['System.Title']).replaceAll("###Description###", html[i].fields['System.Description']);
		get(url_proj + '/' + path_workitem.replaceAll("#ids#", html[i].fields['System.Id']), getGeneric, 'getGeneric' + html[i].fields['System.Id']);
	}
}


function getRelay(context){
	try{
		var result = JSON.parse(context);
		//console.log(context);
		console.log("Relay:" + result.id + result.fields['Custom.Text'] );
		if(result.fields['Custom.Text'] == "Batch"){
			loadRelation(result.relations, result.fields['Custom.Text']);
		}else{
			loadRelation(result.relations, result.fields['Custom.Text']);
			if(result.fields['Custom.Text'] != undefined && result.fields['Custom.Text'] != ""){
				var dest = result.fields['Custom.Text'].split('/');
				if(dest.length > 1){
					get(url_org + "/" + dest[0] + '/' + path_workitem.replaceAll("#ids#", dest[1]), getRelay, 'getRelay' + dest[1]);
				}
			}else{
				
			}
		}
	}catch(e){
		console.log(e);
		console.log(context);
	}	
}

function getRelaysWiql(context){
	var result = JSON.parse(context);
	console.log("getRelaysWiql: " + result.workItems[0].id);	
	for (var i in result.workItems) {
		get(url_proj + '/' + path_workitem.replaceAll("#ids#", result.workItems[i].id), getRelay, 'getRelay' + result.workItems[i].id);
	}
}

function getRelays(context){
	var result = JSON.parse(context);
	if(result.workItems.length > 0){
		console.log("getRelays"  + result.workItems[0].id);	
		for (var i in result.workItems) {
			//get(url_proj + '/' + path_workitem.replaceAll("#ids#", result.workItems[i].id), getRelay, 'getRelay' + result.workItems[i].id);
		}
	}
}

function getGeneric(context){
	var result = JSON.parse(context);
	console.log("Generic " + result.id + result.fields['Custom.Type'] + result.fields['System.State']);
	if(result.fields['System.State'] == 'New' || result.fields['System.State'] == "Active"){
	switch (result.fields['Custom.Type']) {
			case 'Html':
				get(url_proj + '/' + path_workitem.replaceAll("#ids#", result.id), getHtml, 'getHtml' + result.id);
				break;
			case 'Css' :
				//get(url_proj + '/' + path_workitem.replaceAll("#ids#", result.id), getCss, 'getCss' + result.id);
				break;
			case 'Relay' :
				get(url_proj + '/' + path_workitem.replaceAll("#ids#", result.id), getRelay, 'getRelay' + result.id);
				break;
			case 'Query' :
				get(url_proj + '/' + path_workitem.replaceAll("#ids#", result.id), getItemValue, 'getItemValue' + result.id);
				break;
			case 'Script' :
				get(url_proj + '/' + path_workitem.replaceAll("#ids#", result.id), getScript, 'getScript' + result.id);
				break;
			case 'Image' :
				get(url_proj + '/' + path_workitem.replaceAll("#ids#", result.id), loadImageItem, 'loadImageItem' + result.id);
				break;
	}
	}
}

function loadCssFile(path){
var cssId = 'myCss';  // you could encode the css path itself to generate id..

    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = path;
    link.media = 'all';
    head.appendChild(link);

}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

async function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function loadScript(context) {
	
	try{
		var result = JSON.parse(context);
		for (var i in result.workItems) {
			get(url_proj + '/' + path_workitem.replaceAll("#ids#", result.workItems[i].id), getScript, 'getScript' + result.workItems[i].id);
		}
		var json = JSON.stringify({
			"query": "Select [System.Id], [System.Title], [System.Description] From WorkItems Where [State] <> 'Closed' AND [State] <> 'Removed' AND [System.WorkItemType] = 'Feature' AND [Custom.Type] = 'Query' order by [Custom.Order] asc"
		});
		post(url_team + '/' + path_wiql, json, loadQueries, 'loadQueries');
		
		}catch(e){
	console.log(e);
	console.log(context);
}
}

function loadCss(context) {
	try{
		var result = JSON.parse(context);
		console.log("CSSFILES: " + result.workItems.length);
		for (var i in result.workItems) {
			get(url_proj + '/' + path_workitem.replaceAll("#ids#", result.workItems[i].id), getCss, 'getCss' + result.workItems[i].id);
		}
		
		}catch(e){
	console.log(e);
	console.log(context);
}
}

function getCss(context){	
try{
	//console.log(context);
	var result = JSON.parse(context);
	console.log(result.fields['System.Title'] + " --css-- ");
	if(result.fields['Custom.Data'].includes("@import")){
			console.log("CSSFILES: " + stripHtml(result.fields['Custom.Data']));
			var css = stripHtml(result.fields['Custom.Data']).split("@import url(");
			for(var i in css){
				loadCssFile(css[i].replace(");", ""));
				console.log("CSSFILES: " + css[i]);
			}
	}else{
		if(result.fields['Custom.Text'] != undefined){
			$('head').append("<style id='" + result.fields['System.Title'] + "' >" + result.fields['Custom.Text'] + "{" + stripHtml(result.fields['Custom.Data'].replaceAll("]]",";")) + "}</style>");
		}else{
			console.log("CSS: " + context);
		}
	}
	loadRelation(result.relations, result.fields['Custom.Text']);
}catch(e){
	console.log(e);
	console.log(context);
}
}

function getScript(context) {
	try{
	var result = JSON.parse(context);
	console.log("---" + stripScript(result.fields['System.Title']).replace('\t', ''));
	var e = document.createElement('script');
	e.text = stripScript(result.fields['Custom.Data'].replaceAll('###Text###', result.fields['Custom.Text']), result.fields['System.Title']);
	document.body.appendChild(e);
		}catch(e){
	console.log(e);
	console.log("Error:" + context);
}


}



