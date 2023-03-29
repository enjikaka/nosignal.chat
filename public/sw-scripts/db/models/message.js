import { dexieDb } from "../db.js";

/** @typedef Message
 * @prop {string} id
 * @prop {string} content
 * @prop {number} created_at
 * @prop {string} pubkey
 * @prop {string} sig
 */

/**
 * @param {Message} data
 */
export function saveMessage(data) {
  return dexieDb.messages.put(data);
}

export async function getSenders() {
  return dexieDb.messages.orderBy('from').uniqueKeys();
}

export async function getMessages(from, to) {
  return dexieDb.messages
    .where('[from+to]')
    .anyOf([
      [from, to],
      [to, from]
    ])
    .sortBy('created_at');
}

/**
 *
 * @param {string} hexId
 * @returns {Promise<Note>}
 */
async function getMessage(hexId) {
  const dbData = await dexieDb.messages.get(hexId);

  if (dbData) {
    return Object.freeze(dbData);
  }

  return undefined;
}
