import { nostrTools } from '../workers/nostr.js';
// import { sa } from './db/models/profile.js';

const pool = new nostrTools.SimplePool();
const relays = [
  'wss://nostr.glate.ch',
  'wss://nos.lol',
  'wss://relay.damus.io',
  'wss://noster.online',
  'wss://relay.nostr.info'
];

export async function fetchProfileDataFromRelays(publicKey) {
  const event = await pool.get(relays, {
    authors: [publicKey],
    kinds: [0]
  });

  return JSON.parse(event.content);
}
