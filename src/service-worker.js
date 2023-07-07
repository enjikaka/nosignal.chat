import { clientsClaim, setCatchHandler, registerRoute, NavigationRoute, precacheAndRoute, createHandlerBoundToURL } from './sw-scripts/workbox.js';

import './sw-scripts/db/db.js';

import * as PageRoutes from './sw-scripts/routes/pages/index.js';
import * as APIRoutes from './sw-scripts/routes/api/index.js';

import { isAuthorized, HTMLResponse } from './sw-scripts/helpers.js';

import init from './sw-scripts/init.js';

init();

precacheAndRoute(self.__WB_MANIFEST);

async function renderPage(request) {
  const pathname = new URL(request.url).pathname.split('/pages').join('');

  const _isAuthorized = await isAuthorized();

  if (!_isAuthorized || pathname === '/login') {
    return PageRoutes.loginHandler(request);
  }

  if (pathname.includes('/conversations')) {
    return PageRoutes.conversationsHandler(request);
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
  ({ request }) => request.url.includes('/api/conversations'),
  async ({ request }) => APIRoutes.conversationsHandler(request),
  'POST'
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

self.skipWaiting();
clientsClaim();
