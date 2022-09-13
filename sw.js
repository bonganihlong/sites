//
// helper methods
//

const putInCache = async (request, response) => {
	if(response.status == 200){
  const cache = await caches.open('sunglasscache');
	try{
  await cache.put(request, response);
	}catch(e){
		//console.log('Error cannot cache: ' + request.url.split('/').pop())
	
	}
	}
};

var noncached = [ "loader.js","sw.js", "commit"];
noncached = ['loader.js', 'commit'];
const cacheAndRespond = async ({ request, fallbackUrl }) => {
  // First try to get the resource from the cache
  if(request.url.includes("tracking.js")){
	  return new Response('Network error happened', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
  if(!noncached.includes(request.url.split('/').pop()) && !request.url.includes('commit')){
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  }
  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
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