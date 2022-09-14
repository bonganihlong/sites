if (navigator && navigator.serviceWorker) {
    var serviceWorker = navigator.serviceWorker.register('./sw.js');
    //navigator.serviceWorker.addEventListener('message', (message) => {console.log(message);})
}


if (navigator && navigator.storage) {
    var storageManager = navigator.storage
    //storageManager.estimate().then((result)=> console.log(result));
}


