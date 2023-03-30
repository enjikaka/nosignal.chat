import * as nostrTools from 'nostr-tools';
export * as nostrTools from 'nostr-tools';

/**
* Transform bech32 private key to hex private key.
*
* @param {string} nsec
* @returns {string} privateKey
*/
function decodePrivateKey(nsec) {
  const { data: privateKey } = nostrTools.nip19.decode(nsec);

  return privateKey;
}

/**
* Transform bech32 private key to bech32 public key.
*
* @param {string} nsec
*/
function nsecToNpub(nsec) {
  return nostrTools.nip19.npubEncode(nostrTools.getPublicKey(decodePrivateKey(nsec)));
}

async function decryptDirectMessage({ receiver, sender, content }) {
  const receiverPrivateKey = decodePrivateKey(receiver);

  let result;

  try {
    result = await nostrTools.nip04.decrypt(receiverPrivateKey, sender, content);
  } catch (e) {
    console.error(e)
  }

  return result;
}

onmessage = async ({ data }) => {
  if (data.type === 'decodePrivateKey') {
    postMessage({
      uuid: data.uuid,
      payload: decodePrivateKey(data.payload)
    });
  }

  if (data.type === 'getPublicKey') {
    postMessage({
      uuid: data.uuid,
      payload: nostrTools.getPublicKey(data.payload)
    });
  }

  if (data.type === 'nsecToNpub') {
    postMessage({
      uuid: data.uuid,
      payload: nsecToNpub(data.payload)
    });
  }

  if (data.type === 'decryptDirectMessage') {
    const payload = await decryptDirectMessage(data.payload);

    postMessage({
      uuid: data.uuid,
      payload
    });
  }

  postMessage({
    type: data.type,
    uuid: data.uuid,
    payload: 404
  });
}
