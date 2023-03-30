# nosignal.chat

Experimental chat client for nostr.

## A small architecture overview (very hipster) 🛠

For a snappy user experience the heavy work (relay handling) is delegated to a Service Worker (SW). Nostr events are fetched in that, separate, thread and cached in IndexedDB. The Service Worker also handles rendering of pages and API-endpoints (there is no server - but we can fake one!). Basically acting as a full blown PHP server or something; you do a form post to send messages (which the Service Worker translates to a WebSocket message send instead) and you get messages by using an EventSource; Server Sent Events... but here it's Service Worker Sent Events.

UI-parts are made up with Web Components. Nothing fancy there really. Smash some HTML, CSS and JS together. All communication with the "front-end" (web components) and "back-end" (everything in the Service Worker) is done via fetch, EventSource and in one odd case BroadcastChannel. Clear and concise API.

## What about security? 🔑

If you choose to log in by pasting an nsec key then it is stored only in [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) and is never "sent to the back-end" (SW). Remember - there isn't even a server we can send it to! NIP-07 login is planned.

All message decryption is done on the front-end side with the nsec key in sessionStorage. All messages stored locally in IndexedDB is therefore encrypted. And when your session ends they are unreadable. 
