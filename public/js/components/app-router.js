import { registerFunctionComponent } from 'webact';
import './router-link.js';

const template = document.createElement('template');

function AppRouter() {
  const { postRender, $, html } = this;

  html`<slot></slot>`;

  async function renderRoute(pathname) {
    console.time('renderRoute');
    const hostElement = $(':host');

    const response = await fetch('/pages' + pathname, {
      headers: new Headers({
        'content-disposition': 'inline'
      })
    });

    if (response.ok) {
      const text = await response.text();

      template.innerHTML = text;

      const scriptSources = Array.from(template.content.childNodes)
        .filter(node => node instanceof HTMLScriptElement)
        .map(node => node.getAttribute('src'));

      requestAnimationFrame(() => {
        hostElement.replaceChildren(template.content);

        requestAnimationFrame(() => {
          scriptSources.forEach(src => import(src));
        });
      });

    } else if (navigator.serviceWorker.controller !== null) {
      hostElement.innerHTML = 'Sidan finns ej.';
    }
    console.timeEnd('renderRoute');
  }

  postRender(async () => {
    document.addEventListener('router:navigate', event => {
      if (event instanceof CustomEvent) {
        renderRoute(event.detail.pathname);
        history.pushState(null, null, event.detail.pathname);
      }
    });

    if (navigator.serviceWorker.controller !== null && sessionStorage.getItem('nsec') === null)  {
      document.dispatchEvent(new CustomEvent('router:navigate', {
        detail: {
          pathname: '/login'
        }
      }));

      return;
    }

    window.addEventListener('popstate', () => renderRoute(document.location.pathname + document.location.search), false);

    renderRoute(document.location.pathname + document.location.search);
  });
}

export default registerFunctionComponent(AppRouter, { name: 'app-router' });
