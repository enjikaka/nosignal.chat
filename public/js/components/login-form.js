import { registerFunctionComponent } from 'webact';
import { nostrWorker } from '../worker-interface.js';

function LoginForm() {
  const { html, postRender, $ } = this;

  html`
  <form>
    <label>
      nsec
      <input type="password" autocomplete="current-password" placeholder="nsecxxx" name="nsec">
    </label>
    <button>Log in</button>
  </form>
  `;

  postRender(() => {
    $('form').addEventListener('submit', async e => {
      e.preventDefault();

      const data = new FormData(e.target);
      const nsec = data.get('nsec');

      sessionStorage.setItem('nsec', nsec);

      const privateKey = await nostrWorker('decodePrivateKey', nsec);
      const publicKey = await nostrWorker('getPublicKey', privateKey);

      const body = new FormData();

      body.append('publicKey', publicKey);

      await fetch('/api/account', {
        method: 'post',
        body
      });

      document.dispatchEvent(new CustomEvent('router:navigate', {
        detail: {
          pathname: '/'
        }
      }));

      return false;
    });
  });
}

export default registerFunctionComponent(LoginForm, { name: 'login-form' });
