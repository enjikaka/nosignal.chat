import { getProfile } from '../../../db/models/profile.js';
import { JSONResponse } from '../../../helpers.js';

/**
* @param {Request} request
*/
export default async function handler(request) {
  const url = new URL(request.url);
  const [, , , publicKey] = url.pathname.split('/');

  // Get from DB
  if (request.method === 'GET') {
    if (!publicKey) {
      return new JSONResponse(
        null,
        {
          status: 400
        }
      );
    }

    const profile = await getProfile(publicKey);

    return new JSONResponse(
      profile,
      {
        status: 200
      }
    );
  }
}
