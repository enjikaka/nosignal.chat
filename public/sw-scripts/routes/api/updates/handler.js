import { updates } from '../../../helpers.js';

let controllers = new Map();

updates.addEventListener('update', event => {
  if (controllers.length === 0) {
    console.warn('No readable streams to send to.');
  }

  const te = new TextEncoder();
  const payload = te.encode('event: ' + event.detail.type + '\ndata: ' + JSON.stringify(event.detail.data) + '\n\n');

  controllers.forEach(controller => controller.enqueue(payload));
}, false);

/**
* @param {Request} request
*/
export default async function handler(request) {
  if (request.method === 'GET') {
    const uuid = crypto.randomUUID();

    return new Response(new ReadableStream({
      start(ctrl) {
        controllers.set(uuid, ctrl);
      },
      cancel() {
        controllers.delete(uuid);
      }
    }), {
      status: 200,
      headers: new Headers({
        'content-type': 'text/event-stream',
        'transfer-encoding': 'chunked',
        'connection': 'keep-alive',
        'cache-control': 'no-cache'
      })
    })
  }

  return new Response(null, { status: 405 });
}
