import { nostrTools } from '../workers/nostr.js';
import { saveMessage } from './db/models/message.js';
import { updates } from './helpers.js';

const pool = new nostrTools.SimplePool();

async function fetchAndSaveMessage(id) {
  const { content, created_at, pubkey: from, sig, tags } = await pool.get(relays, {
    kinds: [4],
    ids: [id]
  });

  try {
    await saveMessage({ id, content, created_at, from, to, sig });
  } catch (e) {
    console.error(e);
  }
}

let sub;

export function startSubscription(publicKey) {
  if (!sub) {
    sub = pool.sub([
      'wss://nostr.glate.ch',
      'wss://nos.lol',
      'wss://relay.damus.io',
      'wss://noster.online',
      'wss://relay.nostr.info'
    ], [
      {
        "kinds": [4],
        "#p": [publicKey]
      }
    ]);

    sub.on('event', async event => {
      const { id, content, created_at, pubkey: from, sig, tags } = event;
      const to = tags.find(([x]) => x === 'p')[1];

      updates.dispatchEvent(new CustomEvent('update', {
        detail: {
          type: 'conversations',
          data: from
        }
      }));

      try {
        await saveMessage({ id, content, created_at, from, to, sig });
      } catch (e) {
        console.error(e);
      }
    });
  }
}

let mutualSub;

export function startMutualSubscription(from, to) {
  if (!mutualSub) {
    mutualSub = pool.sub([
      'wss://nostr.glate.ch',
      'wss://nos.lol',
      'wss://relay.damus.io',
      'wss://noster.online',
      'wss://relay.nostr.info'
    ], [
      {
        "kinds": [4],
        "#p": [from],
        "authors": [to]
      },
      {
        "kinds": [4],
        "#p": [to],
        "authors": [from]
      }
    ]);

    mutualSub.on('event', async event => {
      const { id, content, created_at, pubkey: from, sig, tags } = event;
      const to = tags.find(([x]) => x === 'p')[1];

      try {
        const message = { id, content, created_at, from, to, sig };

        updates.dispatchEvent(new CustomEvent('update', {
          detail: {
            type: 'conversation',
            data: message
          }
        }));

        await saveMessage(message);
      } catch (e) {
        console.error(e);
      }
    });
  }
}
