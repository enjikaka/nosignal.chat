const worker = new Worker('/workers/nostr.js', { type: 'module' });

export function nostrWorker(type, payload) {
  const uuid = crypto.randomUUID();

  return new Promise((resolve, reject) => {
    const handleMessage = event => {
      if (event.data.uuid === uuid) {
        if (event.data.payload === 404) {
          reject(404);
        }

        resolve(event.data.payload);
      }
    };

    worker.addEventListener('message', handleMessage);

    worker.postMessage({
      type,
      uuid,
      payload
    });
  });
}
