import { updates } from '../../../helpers.js';

/**
* @param {Request} request
*/
export default async function handler(request) {
  if (request.method === 'GET') {
    const stream = new ReadableStream({
      start(controller) {
        updates.addEventListener('update', e => {
          controller.enqueue(`event: ${e.detail.type}\ndata: ${JSON.stringify(e.detail.data)}\n\n`);
        });
      }
    });

    return new Response(stream, {
      headers: new Headers({
        'content-type': 'text/event-stream'
      })
    })
  }

  return new Response(null, { status: 405 });
}
