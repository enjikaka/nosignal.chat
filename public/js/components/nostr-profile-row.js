import { registerFunctionComponent } from 'webact';

function NostrProfileRow({ publicKey }) {
  const { $, css, html, postRender } = this;

  html`
    <img src="" alt="">
    <span></span>
  `;

  css`
    :host {
      display: flex;
      align-items: center;
      gap: 0.5em;
    }

    :host([reverse]) img {
      order: 2;
    }

    :host([reverse]) span {
      text-align: right;
    }

    img {
      width: 32px;
      height: 32px;
      display: block;
      border-radius: 50%;
    }

    span {
      flex: 1;
      font-family: 'Hubot Sans';
      font-weight: 600;
      text-transform: capitalize;
    }
  `;

  postRender(async () => {
    const $span = $('span');
    const $img = $('img');

    const response = await fetch(`/api/profile/${publicKey}`);
    const json = await response.json();

    $span.textContent = json.display_name;

    $img.setAttribute('src', json.picture);
    $img.setAttribute('alt', 'Profile picture for ' + json.display_name);
  });
}

export default registerFunctionComponent(NostrProfileRow, { name: 'nostr-profile-row' });
