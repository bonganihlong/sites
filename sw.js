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

const removeItemFromCache = async (name) => {
  for (const entry of await caches.keys()) {
	  if(!name.includes('.js')){
		  name = new URL(name);
		  name = name.href.replace(name.origin, '');
	  }
    caches.open(entry).then(async cache => {
      return await cache.delete(name);
    });
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
		  await removeItemFromCache(url);
		  await removeItemFromCache("images/" + js.replace('#', '') + ".js");
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
  if(!noncached.includes(request.url.split('/').pop()) && !request.url.includes('commit') && !request.url.includes('online')){
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
    responseFromCache = await caches.match(url.replace('#/online#', ''));
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