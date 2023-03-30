import { skipWaiting, clientsClaim, setCatchHandler, registerRoute, NavigationRoute, precacheAndRoute, createHandlerBoundToURL } from './sw-scripts/workbox.js';

import './sw-scripts/db/db.js';

import * as PageRoutes from './sw-scripts/routes/pages/index.js';
import * as APIRoutes from './sw-scripts/routes/api/index.js';

import { HTMLResponse } from './sw-scripts/helpers.js';

import init from './sw-scripts/init.js';

init();

precacheAndRoute([{"revision":"aca7e902b7800b6fbb2b7ef95b2b41db","url":"css/conversations-page.css"},{"revision":"53b1bd85179bc462ea7a919587388cd9","url":"css/fonts.css"},{"revision":"05bcbd3ff429c6f7bcd4b07aad613109","url":"css/main.css"},{"revision":"cf5a23d8e4592a2518d0681c22f8fb6b","url":"demo.html"},{"revision":"f9816439ef048126e158e8eef86e9ad4","url":"index.html"},{"revision":"2ca160bcafdaf8f0b8f1a8174dd52ce1","url":"js/app.js"},{"revision":"ab1d8973e593001d3d94dba31f6d2ea9","url":"js/components/app-router.js"},{"revision":"73143b512032c0d2009d3d876db410ef","url":"js/components/conversation-form.js"},{"revision":"9651c2e0b6bbdafcdb0f185e23e42760","url":"js/components/conversation-list.js"},{"revision":"a037535933f23e3423c0d245be476a13","url":"js/components/conversation-messages.js"},{"revision":"acef251d7ebad0eab4087e5313c7d9ea","url":"js/components/encrypted-direct-message.js"},{"revision":"76c3ab1cd831b3ad577fa19ff92a0cef","url":"js/components/login-form.js"},{"revision":"7d2ce30b621ab8169a67db05c7f8c11a","url":"js/components/nostr-profile-row.js"},{"revision":"8df3ccc45e39989c945fe10c3fa2a5b8","url":"js/components/router-link.js"},{"revision":"54cad0eeb5628dac3c1db2612417526a","url":"js/worker-interface.js"},{"revision":"446f629af9badc7c4ebf947d236df839","url":"sw-scripts/db/db.js"},{"revision":"02982d28c2b37be2e456f87d0a4f06d9","url":"sw-scripts/db/models/account.js"},{"revision":"ed30f057277488273fdfeaf62663c067","url":"sw-scripts/db/models/message.js"},{"revision":"cc3903758d4bb751ade4b47c09388585","url":"sw-scripts/db/models/note.js"},{"revision":"25dc2d02ce938aec3bf205d3cb93badd","url":"sw-scripts/db/models/profile.js"},{"revision":"2bf0fd5fa7fb3d6887bd2814a63681f1","url":"sw-scripts/helpers.js"},{"revision":"959bd48efe585cad7d140b0afbea7e9c","url":"sw-scripts/init.js"},{"revision":"ae4f9932abeb6746a9a6ccb6acc7e0c8","url":"sw-scripts/messages-fetcher.js"},{"revision":"9c01c9a373aaa2a8feb9bbad94965551","url":"sw-scripts/modules.js"},{"revision":"d48e3d5d2b84121c08d24397be409af3","url":"sw-scripts/profiles-fetcher.js"},{"revision":"a7b45729ac1b27ade6466e4e1541d586","url":"sw-scripts/routes/api/account/handler.js"},{"revision":"b06df0ec20b1cf07b9de728ed3d42c1c","url":"sw-scripts/routes/api/conversations/handler.js"},{"revision":"77c1e378d786acc6caf8764f753394ef","url":"sw-scripts/routes/api/index.js"},{"revision":"4a5acb89a98aeea253276c24d16448bc","url":"sw-scripts/routes/api/messages/handler.js"},{"revision":"fa3c9d6e501f9b6d5a6f07ad561d0d77","url":"sw-scripts/routes/api/profile/handler.js"},{"revision":"1c90e8b3360fc6128fbd2ceda4acc60e","url":"sw-scripts/routes/api/updates/handler.js"},{"revision":"94a9c1e88f69d4e031f38828cef8b052","url":"sw-scripts/routes/pages/conversations/handler.js"},{"revision":"451dc91390b38724c64497e465d25e65","url":"sw-scripts/routes/pages/index.js"},{"revision":"02509cccb7ca5081e304b66d43b2f8ec","url":"sw-scripts/routes/pages/index/handler.js"},{"revision":"a61093db5042d0ad73769bbaae5749ca","url":"sw-scripts/routes/pages/index/index.html"},{"revision":"77ccc7656e247e6ddf513104074dce1e","url":"sw-scripts/routes/pages/login/handler.js"},{"revision":"59347f39875c0ff958e7c11b5919660e","url":"sw-scripts/routes/pages/login/index.html"},{"revision":"68cb87eca3e2af9434faed9b3c3b808e","url":"sw-scripts/workbox.js"},{"revision":"e69fac4b98387fd2750a4357e2bdca39","url":"workers/modules.js"},{"revision":"6c8d1d203e0451386faea2592b44f914","url":"workers/nostr.js"}]);

function renderPage(request) {
  const pathname = new URL(request.url).pathname.split('/pages').join('');

  if (pathname.includes('/conversations')) {
    return PageRoutes.conversationsHandler(request);
  }

  if (pathname === '/login') {
    return PageRoutes.loginHandler(request);
  }

  if (pathname === '/') {
    return PageRoutes.indexHandler(request);
  }

  return undefined;
}

async function pagesHandler(request) {
  console.log('pagesHandler', request);
  const body = await renderPage(request);

  if (body === undefined) {
    return new Response('Not found', { status: 404 });
  }

  return new HTMLResponse(body);
}

registerRoute(
  ({ request }) => request.url.includes('/pages/'),
  async ({ request }) => pagesHandler(request)
);

registerRoute(
  ({ request }) => request.url.includes('/api/updates'),
  async ({ request }) => APIRoutes.updatesHandler(request)
);

registerRoute(
  ({ request }) => request.url.includes('/api/profile/'),
  async ({ request }) => APIRoutes.profileHandler(request)
);

registerRoute(
  ({ request }) => request.url.includes('/api/messages'),
  async ({ request }) => APIRoutes.messagesHandler(request)
);

registerRoute(
  ({ request }) => request.url.includes('/api/conversations'),
  async ({ request }) => APIRoutes.conversationsHandler(request)
);

registerRoute(
  ({ request }) => request.url.includes('/api/account'),
  async ({ request }) => APIRoutes.accountHandler(request),
  'POST'
);

const indexHandler = createHandlerBoundToURL('/index.html');

registerRoute(new NavigationRoute(indexHandler, {
  allowlist: [
    new RegExp('/')
  ]
}));

skipWaiting();
clientsClaim();
