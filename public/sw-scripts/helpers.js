export const updates = new EventTarget();

const authChannel = new BroadcastChannel('auth');

export function isAuthorized() {
  return new Promise(resolve => {
    authChannel.addEventListener('message', event => resolve(Boolean(event.data)));
    authChannel.postMessage('authorized?');
  });
}

export class JSONResponse extends Response {
  /**
   * @param {BodyInit} body
   * @param {ResponseInit} init
   */
  constructor(body, init) {
    super(JSON.stringify(body), {
      headers: new Headers({
        'content-type': 'application/json'
      }),
      ...init
    });
  }
}

export class HTMLResponse extends Response {
  /**
   * @param {BodyInit} body
   * @param {ResponseInit} init
   */
  constructor(body, init) {
    super(body, {
      headers: new Headers({
        'content-type': 'text/html'
      }),
      ...init
    });
  }
}

export const html = String.raw;
