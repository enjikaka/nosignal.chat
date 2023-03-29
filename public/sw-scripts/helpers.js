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
