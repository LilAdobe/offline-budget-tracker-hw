const FILES_TO_CACHE = [
  "/",
  "./indexdb.js",
  "./index.html",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
  "./index.js",
  "./styles.css",
  "./bootstrap.min.css",
  "./font-awesome.min.css",
  "./chart.js@2.8.0.js"
];

const STATIC_CACHE = "static-cache-v1";
const RUNTIME_CACHE = "runtime-cache";

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      //.then(() => self.skipWaiting())
  );
});

// // The activate handler takes care of cleaning up old caches.
// self.addEventListener("activate", event => {
//   const currentCaches = [STATIC_CACHE, RUNTIME_CACHE];
//   event.waitUntil(
//     cachesy
//       .keys()
//       .then(cacheNames => {
//         // return array of cache names that are old to delete
//         return cacheNames.filter(
//           cacheName => !currentCaches.includes(cacheName)
//         );
//       })
//       .then(cachesToDelete => {
//         return Promise.all(
//           cachesToDelete.map(cacheToDelete => {
//             return caches.delete(cacheToDelete);
//           })
//         );
//       })
//       .then(() => self.clients.claim())
//   );
// });

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(cache => {
        return fetch(event.request.url)
        .then(response => {
          if(response.status == 200){
            cache.put(event.request.url, response.clone());

          }
          return response;
        })
          .catch((err) => {
            return   cache.match(event.request)
          
          });
      })
      .catch(err => console.log(err))
    );
    return;
  }

  //use cache first for all other requests for performance
  event.respondWith(
    fetch(event.request).catch(function(){
      return caches.match(event.request).then(function(response){
        if(response){
          return response
        }else if(event.request.headers.get("accept").includes("text/html")){
          return catches.match("/");
        }
      })
    })
    
  );

})
  // self.addEventListener('fetch', (event) => {
  //   if (event.request.url.startsWith(self.location.origin)) {
  //     event.respondWith(
  //       caches.match(event.request).then((cachedResponse) => {
  //         if (cachedResponse) {
  //           return cachedResponse;
  //         }
  
  //         return caches.open(RUNTIME_CACHE).then((cache) => {
  //           return fetch(event.request).then((response) => {
  //             return cache.put(event.request, response.clone()).then(() => {
  //               return response;
  //             });
  //           });
  //         });
  //       })
  //     );
  //   }
  // });
