import { JSONResponse } from "../../../helpers.js";
import { setAccount } from "../../../db/models/account.js";
import { startSubscription } from "../../../messages-fetcher.js";

/**
* @param {Request} request
*/
export default async function handler(request) {
  if (request.method === 'POST') {
    const formData = await request.formData();

    if (!formData.has('publicKey')) {
      return new JSONResponse({
        error: 'Missing publicKey in the form data body'
      }, {
        status: 400
      });
    }

    const publicKey = formData.get('publicKey');

    await setAccount(publicKey);
    startSubscription(publicKey);

    return new JSONResponse(null, {
      status: 200
    });
  }
}
