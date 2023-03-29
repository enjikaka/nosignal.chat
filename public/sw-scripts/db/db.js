import { Dexie } from '../modules.js';

export const dexieDb = new Dexie('nosignal');

dexieDb.version(1).stores({
  account: `
    ++id,
    npub
  `,
  messages: `
    ++id,
    created_at,
    content,
    sig,
    [from+to]
  `,
  profiles: `
    ++id,
    banner,
    website,
    nip05,
    picture,
    display_name,
    lud16,
    name
  `
});
