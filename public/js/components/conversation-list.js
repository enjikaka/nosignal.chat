import { registerFunctionComponent } from 'webact';
import { nostrWorker } from '../worker-interface.js';
import './nostr-profile-row.js';

const publicKeyToConversationLink = publicKey => document.createRange().createContextualFragment(`
  <router-link href="/conversations/${publicKey}">
    <nostr-profile-row public-key="${publicKey}"></nostr-profile-row>
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
    // const publicKey = await nostrWorker('getPublicKey', privateKey);

    const $conversations = json.map(publicKeyToConversationLink);

    $conversations.forEach($conversation => requestAnimationFrame(() => $section.appendChild($conversation)));

    const es = new EventSource('/api/updates');

    es.addEventListener('conversations', e => {
      if (!$(`[public-key="${e.data}"]`)) {
        requestAnimationFrame(() => $section.appendChild(publicKeyToConversationLink(e.data)));
      }
    });
  });
}

export default registerFunctionComponent(ConversationList, { name: 'conversation-list' });
