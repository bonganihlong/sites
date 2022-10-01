//
// helper methods
//

const putInCache = async (url, response) => {
	if(response.status == 200){
  const cache = await caches.open('sunglasscache');
	try{
	  await cache.put(url, response);
	}catch(e){
		//console.log('Error cannot cache: ' + request.url.split('/').pop())
	
	}
	}
};

var noncached = [ "loader.js","sw.js", "commit", 'index.html'];
const cacheAndRespond = async ({ request, fallbackUrl }) => {
  // First try to get the resource from the cache
  
	var url = request.url + "";
	url = url.replace('#refresh#','');
	var hasrefresh = false;
	if(request.url.includes("#refresh#")){
		hasrefresh = true;
		var js = request.url.split('/').pop().replace("#refresh#", "");
		url = url.replace('#/' + js, '');
	  try{
		  await caches.delete(url);
		  await caches.delete("images/" + js.replace('#', '') + ".js");
	}catch(e){
		  console.log(e);
		console.log('Error cannot remove cache: ' + request.url.split('/').pop())
	
	}
  }
	if(url.includes("tracking.js")){
	  return new Response('Network error happened', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
  if(!noncached.includes(request.url.split('/').pop()) && !request.url.includes('commit')){
	  const responseFromCache = await caches.match(url);
	  if (responseFromCache  && !hasrefresh) {
	    return responseFromCache;
	  }
  }
  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    putInCache(url, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    responseFromCache = await caches.match(url);
	  if (responseFromCache && !hasrefresh) {
	    return responseFromCache;
	  }
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

//install

self.addEventListener('install', (event) => {
  console.log('installing sw')
  event.waitUntil(
    caches.open('sunglasscache').then((cache) => {
		console.log('opening');
      return cache.addAll([
        './index.html'
      ]);
    })
  );
});

// listen for requests
self.addEventListener('fetch', function (event) {
	// Bug fix
	// https://stackoverflow.com/a/49719964
	if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;


  event.respondWith(
    cacheAndRespond({
      request: event.request,
      fallbackUrl: './loading.gif'
    })
  );

});