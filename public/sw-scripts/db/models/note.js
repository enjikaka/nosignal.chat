/** @typedef Note
 * @prop {string} id
 * @prop {string} content
 * @prop {number} created_at
 * @prop {string} pubkey
 * @prop {string} sig
 */

/**
 * @param {Note} data
 */
function saveNote(data) {
  return dexieDb.transaction('rw', dexieDb.notes, async () => {
    await dexieDb.notes.put(data);
  })
}

async function getNotes() {
  return dexieDb.notes.orderBy('created_at').reverse().filter(note => note.created_at >= (Date.now() / 1000)).toArray();
}

/**
 *
 * @param {string} hexId
 * @returns {Promise<Note>}
 */
async function getNote(hexId) {
  const dbData = await dexieDb.notes.get(hexId);

  if (dbData) {
    return Object.freeze(dbData);
  }

  const [, , data] = await relayRequest([
    "REQ",
    crypto.randomUUID(),
    {
      "ids": [hexId]
    },
    {
      "kinds": [1],
      "#e": [hexId]
    }
  ]);

  data.created_at = data.created_at * 1000;

  await saveNote(data);

  return Object.freeze(data);
}
