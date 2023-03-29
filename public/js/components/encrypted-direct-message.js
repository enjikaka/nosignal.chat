import { registerFunctionComponent } from 'webact';
import { nostrWorker } from '../worker-interface.js';

function EncryptedDirectMessage({ from, to }) {
  const { css, html, $, postRender } = this;

  css`
  :host {
    margin: 1em;
    display: flex;
    justify-content: flex-start;
  }

  article {
    background-color: rgb(25 25 25);
    min-width: 20ch;
    max-width: 50ch;
    color: white;
    border-radius: 6px;
    font-size: 0.9em;
    hyphens: auto;
    text-rendering: optimizeLegibility;
  }

  ::slotted(p) {
    display: none;
    padding: 0.6em;
    margin: 0;
    will-change: contents;
  }

  :host(.loaded) ::slotted(p) {
    display: block;
  }

  :host(.self) {
    justify-content: flex-end;
  }

  :host(.self) article {
    background-color: rgb(25 118 248);
  }

  ::slotted([slot="createdAt"]) {
    float: right;
    font-size: 0.8em;
    padding: 0 0.8em 0.8em;
    color: rgba(255 255 255 / 70%);
  }
  `;

  html`
    <article>
      <header>
        <slot name="dispayName"></slot>
      </header>
      <slot name="content"></slot>
      <slot name="createdAt"></slot>
    </article>
  `;

  postRender(async () => {
    const $content = $(':host').querySelector('[slot="content"]');

    const nsec = sessionStorage.getItem('nsec');
    const privateKey = await nostrWorker('decodePrivateKey', nsec);
    const publicKey = await nostrWorker('getPublicKey', privateKey);
    const originSelf = from === publicKey;

    if (originSelf) {
      $(':host').classList.add('self');
    }

    const plainText = await nostrWorker('decryptDirectMessage', {
      receiver: nsec,
      sender: originSelf ? to : from,
      content: $content.textContent,
      originSelf
    });
    $content.textContent = plainText;
    $(':host').classList.add('loaded');
  });
}

export default registerFunctionComponent(EncryptedDirectMessage, { name: 'encrypted-direct-message' });
