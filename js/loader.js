var commitTime = 1000;
var ttls = [];
var config = {};
var bases = {};
config["ttl"] = 5000;
var ttls = {};

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
var path_commit = "_apis/git/repositories/###repositoryId###/commits?&$top=1&searchCriteria.refName=refs/heads/main&" + version;
var path_push = "_apis/git/repositories/###repositoryId###/pushes?" + version;
var path_token = "_apis/tokens/pats?api-version=7.1-preview.1";
var path_comment = "_apis/wit/workItems/###id###/comments?api-version=6.0-preview.3";
var path_getcomment = "_apis/wit/workItems/###wid###/comments/###id###?api-version=6.0-preview.3"


var user = localStorage.getItem(site + 'userId');


var team = 'FormFormTeam';
var url_team = url_proj + '/' + team;
var tokenDate = '';

var idsArr = [];
var index;

var addlog = ['onload', 'loadRepos'];
var removelog = ['context'];
var addcomment = ['onload', 'Exception', 'getWI'];
//addcomment = [];
var removecomment = [];

function all(url, json, callBack, item, source, get) {	
	log('all', 'allstart', "Getting from post: " + item + url + "--" + base + source + get, ln());
	if(source == null || source == undefined) source = false;
	var storedItem;
	if(!source && url.includes('workitems/')){
		var startindex = url.indexOf('workitems/');
		var endindex = url.indexOf('?');
		storedItem = url.substring(startindex + 10, endindex);
		var has = getWI(storedItem);
		if(has != null) source = true;
	}
	if(item == "uploadImage") source = true;
	if(item == "loadCommit" || item == 'loadToken' || item == 'loadRepos' || item.includes('Css') || item.includes('Session')) source = true;
	var base = (btoa(item + url + key).hashCode() + "").replace("-","C");
	bases[base] = item + url + key ;
	log('all', 'allstart', "Getting from post: " + item + url + "--" + base + source + get + storedItem, ln());

	if(base.includes('1944924699')){
			var t = "";
		}
	
	$.ajax({
		url: source ? url : fileserver + "images/" + base + ".js",
		type : get ? 'GET' : source ? 'POST' : 'GET',
		data: get ? null : source ? json : null,
		async: true,
		headers: { 'Item-Requested': item, 'Authorization': 'Basic ' + key,  'Access-Control-Allow-Origin': '*', 'Content-Type' : 'application/json'},
		cache: true,
		success: function (str,sta,xhr) {
			if(xhr.status == 200){
				log('all', 'success', "Calling handler: " + item + url + "--" + base + source + get + storedItem, ln());
				(handleCaller)(str, base, callBack, item, source, get);
				if(storedItem != undefined && storedItem != maxId){
					log('all', 'success', "Removing item: " + storedItem, ln());
					removeWI(storedItem);
					log('all', 'success', "Removed item: " + storedItem, ln());
				}
			}else{
				log('all', 'failure', "Not found " + item + source + storedItem, ln());
				if(!source){
					log('all', 'failure', "Getting source " + item, ln());
					all(url, json, callBack, item, true, get);
				}
					log('all', 'failure', "Done." + item, ln());
			}
		},
		failure: function (str,sta,xhr) {
			log('all', 'onfailure', "Not found " + url + item, ln());
			if(!source){
					log('all', 'onfailure', "Getting source " + url + item, ln());
					all(url, json, callBack, item, true, get);
				}
			log('all', 'onfailure', "Done." + item, ln());
		},
		error: function (str,sta,xhr) {
				log('all', 'error', "Not found " + url + item, ln());
			if(!source){
					log('all', 'error', "Getting source " + url + item, ln());
					all(url, json, callBack, item, true, get);
				}
			log('all', 'error', "Done." + item, ln());
		},
	});	
}

var postsource = ['getUpdatedWI', 'addWIs', 'uploadImage'];

function post(url, json, callBack, item, source){
	if(source == null || source == undefined) source = false;
	if(postsource.includes(item)) source = true;
	all(url, json, callBack, item, source, false)
}

var getsource = ['loadCommit'];
function get(url, callBack, item, source){
	if(source == null || source == undefined) source = false;
	if(getsource.includes(item)) source = true;
	all(url, null, callBack, item, source, true)
}


var repoitems = ['loadToken', 'loadCommit'];
function handleCaller(context, base, callBack, item, source, get){	
	if(base.includes('233676904')){
			var t = "";
		}
	
	log('handleCaller', 'context', item + context , ln());
	if(context != "" && context != null && context != undefined){
		log('handleCaller', 'handleCaller', "Starting Callback" + item , ln());
		callBack(context);		
		log('handleCaller', 'handleCaller', "Starting to repo " + item , ln());
		if(!repoitems.includes(item)){
			var json = JSON.stringify(context);
			if(source){	
				log('handleCaller', 'handleCaller', "Calling repoImage " + item , ln());
				repoImage("", json, base + ".js", 'rawtext');
				log('handleCaller', 'handleCaller', "Done repoImage " + item , ln());
			}
			log('handleCaller', 'handleCaller', "Finished repoImage " + item , ln());
		}
	}
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


function repoImage(imageUrl, base64, name, type, repeat){
	
	var filename = imageUrl.split('/').pop() + name;
	if(filename == undefined) return;
	
	var obj = {};
	obj.filename = filename;
	obj.base64 = base64;
	obj.type = type;
	if(filename.includes('233676904')){
			var t = "";
		}
	if(objs.filter(item => item.filename == filename).length > 0) return;
	
	if(repo == ""){
		console.log("No repo: " + imageUrl + name);
		if(repeat) return;
		setTimeout(repoImage(imageUrl, base64, name, type, true), 1000);
		return;
	}
	if(commit == ""){
		console.log("No commit: " + imageUrl + name);
		return;
	}
	objs.push(obj);
	if(objs.length < 1) return; 
	
	var changes = [];
	for(var i=0; i<objs.length; i++){
		if(objs[i].filename.includes('233676904')){
			var t = "";
		}
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
	console.log(json);
	post(url_org + '/' + path_push.replace('###repositoryId###', repo), json, uploadImage, 'uploadImage' + name);
	commitTime = 1000;
	objs = [];
}

var objs  = [];

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function createToken(id){
	var obj = {
	  name: bases
	};

	console.log();
	var fileContent = JSON.stringify(obj);
			var bb = new Blob([fileContent ], { type: 'text/plain' });
			var a = document.createElement('a');
			a.download = "bases.js";
			a.href = window.URL.createObjectURL(bb);
			a.click();
			
	var request = localStorage.getItem('RequestToken');
	if(request == undefined || request == null){
	var user = document.getElementById('userId').innerHTML;

	var json = JSON.stringify(
		
		  {
			"text": "Request: " + site + user + device
		  }
		
	);
	post(url_proj + '/' + path_comment.replace('###id###', id), json, getToken, 'getToken');
}else{
	get(url_proj + '/' + path_getcomment.replace('###wid###', id).replace('###id###', request), getComment, 'getComment');
	
	}
}

function addComment(comment){
	var json = JSON.stringify(
		
		  {
			"text": user + ": " + site + ":" + comment
		  }
		);
		post(url_proj + '/' + path_comment.replace('###id###', 16923), json, processComment, 'processComment');
}

function processComment(context){
	var result = getResult(context);
}

function getToken(context){
	var result = getResult(context);
	localStorage.setItem('RequestToken', result.id);
}

function getComment(context){	
	var result = getResult(context);
	var arr = result.text.split(';');
	if(arr.length > 1){
		document.getElementById('newToken').innerHTML = arr[1];
	}else{
		document.getElementById('newToken').innerHTML = 'New Token Requested';
	}
}

function uploadImage(context) {
		var result = getResult(context);
		console.log('Uploaded Image: ' + uploadImage);
		if(result.commits.length >0){
			commit = result.commits[0].commitId;
		}
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}










function loadConfig(context) {
		var result = getResult(context);
		var ids = "",
			sep = "";
		for (var i in result.workItems) {
			ids += sep + '' + result.workItems[i].id;
			sep = ",";
		}
		get(url_proj + '/' + path_workitem.replaceAll("#ids#", ids), loadConfigItems, 'loadConfigItems' + ids);
}

function loadConfigItems(context) {
	var result = getResult(context);
	var ids = '',
		sep = '';
	for (var i in result.relations) {
		ids += sep + '' + result.relations[i].url.split('/').pop();
		sep = ",";
	}
	get(url_proj + '/' + path_workitems.replaceAll("#ids#", ids), loadConfigValues, 'loadConfigValues' + ids);
}


function loadConfigValues(context) {
		var result = getResult(context);
		for (var i in result.value) {
			console.log("Config: " + result.value[i].fields['System.Title'] + ":" + result.value[i].fields['Custom.Text']);
			config[result.value[i].fields['System.Title']] = result.value[i].fields['Custom.Text'];
			
			//document.body.innerHTML = document.body.innerHTML.replaceAll("config['" + result.value[i].fields['System.Title'] +"']" , config[result.value[i].fields['System.Title']]);
		}
}

var repo = "";
function en(c){var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}

function de(b){var a,e={},d=b.split(""),c=f=d[0],g=[c],h=o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}

function loadRepos(context) {
		log('loadRepos', 'loadinging repo', "Getiing repos", ln());
		var result = getResult(context);
		log('loadRepos', 'loadinging repo', "Getting is", ln());
		repo = result.value.find(item => item.project.name == "Sunglass").id;
		log('loadRepos', 'loadinging repo', "RepoID:" + repo, ln());
		fetchCommit();
}


function fetchCommit(){
	get(url_org + "/" + site + '/' + path_commit.replace('###repositoryId###', repo), loadCommit, 'loadCommit');
	setTimeout('fetchCommit()', commitTime);
	commitTime = commitTime * 1.2;
}

var commit = "";
function loadCommit(context) {
	var result = getResult(context);
	if(result.value.length > 0){
		commit = result.value[0].commitId;
		console.log('Commit ' + commit);
	}
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
	var result = getResult(context);
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
		var result = getResult(context);
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
	var results = getResult(context);
	for(var i = 0; i < results.workItems.length; i++){
		console.log("image: " + results.workItems[i].id);
		get(url_proj + '/' + path_workitem.replaceAll("#ids#", results.workItems[i].id), loadImageItem, 'loadImageItem'   + results.workItems[i].id);
	}
}

var fileserver = "http://localhost:7070/";
function loadImageItem(context){
	var results = getResult(context);
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
	var result = getResult(context);
	var date = new Date(result.value.find(x => x.displayName == site + 'Token').validTo);
	tokenDate = date.toString('YY MM DD');
	document.getElementById('tokenDateId').innerHTML = 'Valid until ' +  formatDate(tokenDate);
	document.getElementById("newTokenBtn").disabled = false;
}

var key = "";
var device = "";
window.onload = function() {
	//alert(localStorage.getItem(site + "token"));
	var storedkey = localStorage.getItem(site + "token");
	if(storedkey == null || key == storedkey){
		$('#accessModal').modal('show');
		return;
	}
	key = btoa(":" + localStorage.getItem(site + "token"));
	//alert(key);
	log('onload', 'startlog', "Starting loading", ln());
	createDB();
	log('onload', 'startlog', "Getting last date", ln());
	getLastDate();
	
	log('onload', 'startlog', "Getting Tokens", ln());
	get('https://vssps.dev.azure.com/kukhanya' + '/_apis/Token/SessionTokens?api-version=5.0-preview', loadToken, 'loadToken');	
	log('onload', 'startlog', "Getting First Entry", ln());
	var json = JSON.stringify({
		"query": "Select [System.Id], [System.Title], [System.Description], [Custom.Text] From WorkItems Where [State] <> 'Closed' AND [State] <> 'Removed' AND [System.WorkItemType] = 'Feature' AND [Custom.Type] = 'Relay' AND [System.AssignedTo] = @me"
	});
	post(url_team + '/' + path_wiql, json, getRelaysWiql, 'getRelaysWiql');
	
	log('onload', 'startlog', "Getting Repo", ln());
	get(url_org + '/' + path_repo, loadRepos, 'loadRepos');
	log('onload', 'startlog', "Getting Device", ln());
	device = new DeviceUUID().get();
	log('onload', 'endlog', "End loading for device:" + device, ln());
	
}

function logError(funct, item, text, ln, e){
	log('Exception', funct + item, text + e.stack, ln);
}
function log(funct, item, text, ln){
	var consolelog = false;
	var commentlog = false;
	if(addlog.includes(funct)){
		consolelog = true;
	}
	if(addcomment.includes(funct)){
		commentlog = true;
	}
	if(addlog.includes(item)){
		consolelog = true;
	}
	if(addcomment.includes(item)){
		commentlog = true;
	}
	if(removelog.includes(item)){
		consolelog = false;
	}
	if(removecomment.includes(item)){
		commentlog = false;
	}
	if(removelog.includes(funct)){
		consolelog = false;
	}
	if(removecomment.includes(funct)){
		commentlog = false;
	}
	
	if(consolelog){
		console.log(ln + "-" + funct + ":" + item + ":" + text );
	}
	if(commentlog){
		addComment(ln + "-" + funct + ":" +  item + ":" + text);
	}
}
function ln() {
  var e = new Error();
  if (!e.stack) try {
    // IE requires the Error to actually be throw or else the Error's 'stack'
    // property is undefined.
    throw e;
  } catch (e) {
    if (!e.stack) {
      return 0; // IE < 10, likely
    }
  }
  var stack = e.stack.toString().split(/\r\n|\n/);
  // We want our caller's frame. It's index into |stack| depends on the
  // browser and browser version, so we need to search for the second frame:
  var frameRE = /:(\d+):(?:\d+)[^\d]*$/;
  do {
    var frame = stack.shift();
  } while (!frameRE.exec(frame) && stack.length);
  return frameRE.exec(stack.shift())[1];
}

function getCurentDate(){
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	
	today = yyyy + '-' + mm + '-' + dd;
	return today;
}

function sendAccessWhatsapp(){
window.location.href = "https://api.whatsapp.com/send?phone=27726359342&text=AccessSunglass";
}

function sendAccessEmail(){
window.location.href = "mailto:bonganihlong@icloud.com?subject=RequestAccess&body=AccessSunglass";
}

function menuHtml(context) {
	try{
		var result = getResult(context);
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
		var result = getResult(context);
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
	var result = getResult(context);
	console.log("getRelation");
	
	var css = result.value.filter(item => item.fields["Custom.Type"] == "Css");
	var html = result.value.filter(item => item.fields["Custom.Type"] == "Html");
	var relay = result.value.filter(item => item.fields["Custom.Type"] == "Relay");
	var script = result.value.filter(item => item.fields["Custom.Type"] == "Script");
	for(var i in relay){
		if(relay[i].fields['Custom.Text'] != undefined && relay[i].fields['Custom.Text'] != ""){
			var dest = relay[i].fields['Custom.Text'].split('/');
			if(dest.length > 1){
				get(url_org + "/" + dest[0] + '/' + path_workitem.replaceAll("#ids#", dest[1]), getGeneric, 'getGeneric' + dest[1]);
			} 
		}
		get(url_proj + '/' + path_workitem.replaceAll("#ids#", relay[i].fields['System.Id'] ), getGeneric, 'getGeneric' + relay[i].fields['System.Id']);
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
		//document.getElementById(html[i].fields['Custom.Text']).innerHTML = stripHtml(html[i].fields['Custom.Data']).replace('&nbsp', '').replaceAll("###Title###", html[i].fields['System.Title']).replaceAll("###Description###", html[i].fields['System.Description']);
		get(url_proj + '/' + path_workitem.replaceAll("#ids#", html[i].fields['System.Id']), getGeneric, 'getGeneric' + html[i].fields['System.Id']);
	}
}


function getRelay(context){
	try{
		var result = getResult(context);
		var text = result.fields['Custom.Text'];
		if(text == undefined || text == null) text = "";
		//console.log(context);
		console.log("Relay:" + result.id +  text);
		if(text == "Batch"){
			loadRelation(result.relations, text);
		}else{
			loadRelation(result.relations, text);
			if(text != ""){
				var dest = text.split('/');
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
	var result = getResult(context);
	for (var i in result.workItems) {
		get(url_proj + '/' + path_workitem.replaceAll("#ids#", result.workItems[i].id), getRelay, 'getRelay' + result.workItems[i].id);
	}
}

var workitems = [];
var maxDate = "";
var maxId;

function getUpdatedWI(context){
	var result = getResult(context);
	var ids = [];
	for (var i in result.workItems) {
		ids.push(parseInt(result.workItems[i].id));
	}
	if(ids.length > 0){
		var json = JSON.stringify({"ids":   ids  ,  "fields": [ "System.Id",    "System.ChangedDate"]});	
		post(url_org + "/Css/" + path_batch, json, addWIs, 'addWIs');
	}
	
}


function getLastDate(){
	var request = window.indexedDB.open(site + "Database", 1);
	request.onsuccess = function(event) {
		var db = event.target.result;
		var store = db.transaction("workitems", "readwrite").objectStore("workitems");
		var index = store.index('by_date');
		var request = index.openCursor(/*query*/null, /*direction*/'prev');
		request.onsuccess = function() {
		  var cursor = request.result;
		  if (cursor) {
			maxDate = cursor.key;
			  maxId = cursor.value.id;
			    console.log('max date is: ' + cursor.key);
		  } else {
			  if(maxDate == ""){
					maxDate = getCurentDate().substring(0, 10);
				}
				if(maxDate == ""){
					maxDate = '2022-09-07';
				}
			  maxId = "-1";
		    console.log('no records!');
		  }
			maxDate = maxDate.substring(0, 10);
			log('onload', 'startlog', "Getting Updated Work Items", ln());
			json = JSON.stringify({
				"query": "Select [System.Id]From WorkItems Where [State] <> 'Closed' AND [State] <> 'Removed' AND [System.WorkItemType] = 'Feature' AND [System.ChangedDate] > '" + maxDate + "'"
			});
			post(url_team + '/' + path_wiql, json, getUpdatedWI, 'getUpdatedWI');
				};
			}		
}



function addWIs(context){
	var result = getResult(context);	
	var css = result.value.filter(item => item.fields["Custom.Type"] == "Css")
	for (var i in result.value) {
		var updatedwi = {};
		updatedwi.id = result.value[i].fields["System.Id"] ;
		updatedwi.date = result.value[i].fields["System.ChangedDate"] 
	
		if(getWI(updatedwi.id) != null){
			updateWI(updatedwi);
		}else{
			addWI(result.value[i].id, updatedwi.date);
		}
	}	
}

function getWI(id){
	var request = window.indexedDB.open(site + "Database", 1);
	request.onsuccess = function(event) {
		var db = event.target.result;
		var rTrans = db.transaction("workitems", "readwrite").objectStore("workitems");
		var obj = null;
		try{obj = rTrans.get(id)}catch(e){
			logError('getWI', 'Excpetion', "Not found " + id, ln(), e);
		}
		return obj;
	}	
}

function updateWI(obj){
	var request = window.indexedDB.open(site + "Database", 1);
	request.onsuccess = function(event) {
		var db = event.target.result;
		var rTrans = db.transaction("workitems", "readwrite").objectStore("workitems");
		return rTrans.put(obj);
	}	
}

function removeWI(id){
	var request = window.indexedDB.open(site + "Database", 1);
	request.onsuccess = function(event) {
		var db = event.target.result;
		var rTrans = db.transaction("workitems", "readwrite").objectStore("workitems");
		return rTrans.delete(id);
	}	
}

function createDB(){
	var request = window.indexedDB.open(site + "Database", 1);
	request.onupgradeneeded = function(event) {
		log('createDB', 'creatingstore', "Starting to create store", ln());
        var db = event.target.result;
        var oS = db.createObjectStore("workitems", { keyPath: "id" });
			oS.createIndex('by_date', 'date');
	        oS.createIndex("id", "id", { unique: true });
        };
		log('createDB', 'creatingstore', "Store created", ln());
}

function addWI(id, date) {

    var request = window.indexedDB.open(site + "Database", 1);

    var b = (function () {
      var c = [];
      return function () {
        c.push({id: id, date: date});
        return c;
        }
    })();

    request.onerror = function(event) {
        log('addWI', 'Excpetion', "Not found " + id, ln());;
        };

    var d = b();
    d.forEach(function(rest) {
        console.log("I: ", d);
        });

    request.onupgradeneeded = function(event) {

        var db = event.target.result;

        var oS = db.createObjectStore("workitems", { keyPath: "id" });
			oS.createIndex('by_date', 'date');
	        oS.createIndex("id", "id", { unique: true });
        };

    request.onsuccess = function(event) {
        var db = event.target.result;

        var rTrans = db.transaction("workitems", "readwrite").objectStore("workitems"); 

        d.forEach(function(item) {
            rTrans.add(item);
            });

        rTrans.oncomplete = function () {
            //console.log("CONGRATULATIONS.");
            }
        };

    request.onupgradeneeded.onerror = function(event) {
         log('addWI', 'Excpetion', "Could not upgrade ", ln());;
        }
    }


function getRelays(context){
	var result = getResult(context);
	if(result.workItems.length > 0){
		console.log("getRelays"  + result.workItems[0].id);	
		for (var i in result.workItems) {
			get(url_proj + '/' + path_workitem.replaceAll("#ids#", result.workItems[i].id), getRelay, 'getRelay' + result.workItems[i].id);
		}
	}
}

function getResult(context){
	var result = context;
	try{result = JSON.parse(context); result = JSON.parse(result);}catch(e){}
	return result;
}
	

function getGeneric(context){
	var result = getResult(context);
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
		var result = getResult(context);;
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
		var result = getResult(context);
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
	var result = getResult(context);
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
	var result = getResult(context);
	console.log("---" + stripScript(result.fields['System.Title']).replace('\t', ''));
	var e = document.createElement('script');
	e.text = stripScript(result.fields['Custom.Data'].replaceAll('###Text###', result.fields['Custom.Text']), result.fields['System.Title']);
	document.body.appendChild(e);
		}catch(e){
	console.log(e);
	console.log("Error:" + context);
}


}



