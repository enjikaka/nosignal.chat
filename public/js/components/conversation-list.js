import { registerFunctionComponent } from 'webact';
import { nostrWorker } from '../worker-interface.js';
import './nostr-profile-row.js';

const publicKeyToConversationLink = (from, self) => document.createRange().createContextualFragment(`
  <router-link href="/conversations/${from}">
    <nostr-profile-row public-key="${from}"${from === self ? ' self="self"' : ''}></nostr-profile-row>
  </router-link>
`);

function ConversationList() {
  const { css, html, $, postRender } = this;

  css`
  :host {
    padding: 1em;
    display: block;
  }

  router-link {
    display: block;
    margin: 1em 0;
  }
  `;

  html`
  <section>
      <header>
          <h2>Conversations</h2>
      </header>
  </section>
  `;

  postRender(async () => {
    const $section = $('section');
    const response = await fetch('/api/conversations');
    const json = await response.json();

    const nsec = sessionStorage.getItem('nsec');
    const privateKey = await nostrWorker('decodePrivateKey', nsec);
    const self = await nostrWorker('getPublicKey', privateKey);

    const $conversations = json.map(from => publicKeyToConversationLink(from, self));

    $conversations.forEach($conversation => requestAnimationFrame(() => $section.appendChild($conversation)));

    const es = new EventSource('/api/updates');

    es.addEventListener('conversations', e => {
      const data = JSON.parse(e.data);

      if (!$(`[public-key="${data}"]`)) {
        requestAnimationFrame(() => $section.appendChild(publicKeyToConversationLink(data)));
      }
    });
  });
}

export default registerFunctionComponent(ConversationList, { name: 'conversation-list' });
