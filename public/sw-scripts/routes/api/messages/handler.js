import { getMessages } from '../../../db/models/message.js';
import { JSONResponse } from '../../../helpers.js';

/**
* @param {Request} request
*/
export default async function handler(request) {
  const url = new URL(request.url);

  // Get from DB
  if (request.method === 'GET') {
    const messages = await getMessages();

    return new JSONResponse(
      messages,
      {
        status: 200
      }
    );
  }

  // Post to relays
  if (request.method === 'POST') {
    return new Response(
      null,
      {
        status: 200
      }
    );
  }
}
