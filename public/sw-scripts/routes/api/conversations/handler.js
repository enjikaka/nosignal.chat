import { getAccount } from '../../../db/models/account.js';
import { getSenders, getMessages } from '../../../db/models/message.js';
import { JSONResponse } from '../../../helpers.js';
import { sendEvent } from "../../../messages-fetcher.js";

/**
* @param {Request} request
*/
export default async function handler(request) {
  const url = new URL(request.url);
  const [, , , publicKey] = url.pathname.split('/');
  const account = await getAccount();

  // Get from DB
  if (request.method === 'GET') {
    if (!publicKey) {
      const senders = await getSenders();

      return new JSONResponse(
        senders,
        {
          status: 200
        }
      );
    }

    const messages = await getMessages(publicKey, account.id);

    return new JSONResponse(
      messages,
      {
        status: 200
      }
    );
  }

  if (request.method === 'POST') {
    const signedEvent = await request.json();

    let text = 'ok';
    let status = 200;

    try {
      await sendEvent(signedEvent);
    } catch (e) {
      text = e;
      status = 400;
    }

    return new JSONResponse(
      text,
      {
        status
      }
    );
  }
}
