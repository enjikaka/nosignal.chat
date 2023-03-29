import { getAccount } from '../../../db/models/account.js';
import { getSenders, getMessages } from '../../../db/models/message.js';
import { JSONResponse } from '../../../helpers.js';

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
}
