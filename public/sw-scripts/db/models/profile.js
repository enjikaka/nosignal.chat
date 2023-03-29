import { dexieDb } from "../db.js";
import { fetchProfileDataFromRelays } from '../../profiles-fetcher.js';

/** @typedef Profile
 * @prop {string} id
 * @prop {string} banner
 * @prop {number} website
 * @prop {string} nip05
 * @prop {string} picture
 * @prop {string} display_name
 * @prop {string} lud16
 * @prop {string} name
 */


/**
 * @param {Profile} data
 */
function saveProfile(data) {
  return dexieDb.profiles.put(data);
}

/**
 *
 * @param {string} id
 * @returns {Promise<Profile>}
 */
export async function getProfile(id) {
  const dbData = await dexieDb.profiles.get(id);

  if (dbData) {
    return Object.freeze(dbData);
  }

  const data = await fetchProfileDataFromRelays(id);

  await saveProfile({
    id,
    ...data
  });

  return Object.freeze(data);
}
