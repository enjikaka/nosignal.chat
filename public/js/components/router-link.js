import { registerFunctionComponent } from 'webact';

function RouterLink() {
  const { $, css, html, postRender } = this;

  html`<slot></slot>`;

  css`
  :host {
    cursor: pointer;
    color: currentColor;
  }
  `;

  postRender(() => {
    $().addEventListener('click', () => {
      // document.querySelector('#app-navigation').classList.remove('open');

      const url = new URL($().getAttribute('href'), document.location.href);
      document.dispatchEvent(new CustomEvent('router:navigate', {
        detail: {
          pathname: url.pathname + url.search
        }
      }));
    });
  });
}

export default registerFunctionComponent(RouterLink, { name: 'router-link' });
