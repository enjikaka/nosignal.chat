import { registerFunctionComponent } from 'webact';
import './encrypted-direct-message.js';
import '@github/relative-time-element';

const dmToEDM = dm => document.createRange().createContextualFragment(`
  <encrypted-direct-message from="${dm.from}" to="${dm.to}">
    <p slot="content">${dm.content}</p>
    <relative-time slot="createdAt" format="relative" threshold="P7D" format-style="narrow" datetime="${new Date(dm.created_at * 1000).toISOString()}">${new Date(dm.created_at * 1000).toUTCString()}</relative-time>
  </encrypted-direct-message>
`);

function ConversationMessages({ publicKey }) {
  const { html, $, $$, postRender } = this;

  html`
    <div class="bg"></div>
    <section></section>
  `;

  postRender(async () => {
    const $section = $('section');
    const response = await fetch('/api/conversations/' + publicKey);
    const json = await response.json();

    const messages = json.map(dmToEDM);

    messages.forEach($msg => {
      requestAnimationFrame(() => {
        $section.appendChild($msg);
      });
    });

    const id = setInterval(() => {
      if ([...$$('encrypted-direct-message.loaded')].length === messages.length) {
        clearInterval(id);
        [...$$('encrypted-direct-message.loaded')].pop().scrollIntoView();
      }
    }, 20);

    const es = new EventSource('/api/updates');

    es.addEventListener('conversation', e => {
      const message = JSON.parse(e.data);

      if (message.from !== publicKey || message.to !== publicKey) {
        return;
      }

      const $msg = dmToEDM(message);

      requestAnimationFrame(() => $section.appendChild($msg));
      [...$$('encrypted-direct-message.loaded')].pop().scrollIntoView();
    });
  });
}

export default registerFunctionComponent(ConversationMessages, { name: 'conversation-messages' });
