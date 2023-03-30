# nosignal.chat

Experimental chat client for nostr.

## A small architecture overview (very hipster) 🛠

For a snappy user experience the heavy work (relay handling) is delegated to a [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) (SW). Nostr events are fetched in that, separate, thread and cached in IndexedDB. The Service Worker also handles rendering of pages and API-endpoints (there is no server - but we can fake one!). Basically acting as a full blown PHP server or something; you do a form post to send messages (which the Service Worker translates to a WebSocket message send instead) and you get messages by using an EventSource; [Server Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)... but here it's Service Worker Sent Events.

UI-parts are made up with Web Components via the helper library [Webact](https://github.com/enjikaka/webact). Nothing fancy there really. Smash some HTML, CSS and JS together. 

All communication with the "front-end" (web components) and "back-end" (everything in the Service Worker) is done via [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch), [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) and in one odd case the [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API). Clear and concise API for the front- and back-end.

## What about security? 🔑

If you choose to log in by pasting an nsec key then it is stored in [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) and is never "sent to the back-end" (SW). Remember - there isn't even a _real_ back-end we can send it to! And yes, NIP-07 login is planned!

All message decryption is done on the front-end side with the nsec key in sessionStorage. All messages cached in IndexedDB are encrypted. And when the browser has removed yout nsec from the temporary session storage; no one can load the app or inspect the database to read them. You need to login with the nsec key again for those to be visible.
