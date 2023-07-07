import { nostrTools } from '../workers/nostr.js';
import { saveMessage } from './db/models/message.js';
import { updates } from './helpers.js';

const pool = new nostrTools.SimplePool();
const relays = [
  'wss://nostr.sidnlabs.nl',
  'wss://relay.plebstr.com',
  'wss://relay.snort.social',
  'wss://relay.damus.io',
  'wss://nostr.glate.ch',
  'wss://nos.lol',
  'wss://noster.online'
];

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

export function sendEvent (signedEvent) {
  return new Promise((resolve, reject) => {
    const pub = pool.publish(relays, signedEvent);

    pub.on('ok', () => resolve())
    pub.on('failed', reason => reject(reason))
  });
}

let sub;

export function startSubscription(publicKey) {
  if (!sub) {
    sub = pool.sub(relays, [
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
    mutualSub = pool.sub(relays, [
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
