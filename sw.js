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
	  if(!name.includes('.js') && name.includes('http')){
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
  var hasrefresh = false;
  try {
		  var url = request.url + "";
		var js = request.url.split('/').pop().replace("#refresh#", "");
		if(request.url.includes('#refresh#')){
			hasrefresh = true;
			url = url.replace('#refresh#','');
			const responseFromNetwork = await fetch(request);
			url = url.replace('#/' + js, '');
			await removeItemFromCache(url);
			await removeItemFromCache("images/" + js.replace('#', '') + ".js");
			putInCache(url, responseFromNetwork.clone());
			putInCache("images/" + js.replace('#', '') + ".js", responseFromNetwork.clone());
			return responseFromNetwork;
		}
	  if(!noncached.includes(request.url.split('/').pop()) && !request.url.includes('commit') && !request.url.includes('online')){
		  const responseFromCache = await caches.match(url);
		  if (responseFromCache  && !hasrefresh) {
			return responseFromCache;
		  }
	  }
	  const responseFromNetwork = await fetch(request);
	  return responseFromNetwork;
  } catch (error) {
		  if(!hasrefresh){
			  const responseFromCache = await caches.match(url);
			  return responseFromCache;
		  }
		    return new Response('Network error happened', {
		      status: 408,
		      headers: { 'Content-Type': 'text/plain' },
		    });
  }
};

function customHeaderRequestFetch(request) {
  // decide for yourself which values you provide to mode and credentials
  var headers = [];
	for (const pair of request.headers.entries()) {
    headers[pair[0]] = pair[1];
  }
	const newRequest = new Request(request, {
    headers: {
      'OnlineMode': 'online',
		"Item-Requested": headers["Item-Requested"],
		"Authorization": headers["Authorization"],
		"Content-Type": headers["Content-Type"],
		"Access-Control-Allow-Origin": "*"
		
    }
  })
  return fetch(newRequest)
}

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