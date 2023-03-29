import { registerFunctionComponent } from 'webact';

function ConversationForm({ to }) {
  const { html, css, $, postRender } = this;

  css`
    :host {
      padding: 1em;
    }

    form {
      width: 100%;
      display: flex;
      gap: 1em;
      align-items: center;
    }

    input {
      flex: 1;
      background-color: hsla(0deg 0% 73.33% / 80%);
      border-radius: 1rem;
      padding: 0 1em;
      height: 32px;
      font-size: 0.9em;
      border: 0;
      outline: none;
    }

    button {
      background-color: rgb(25 118 248);
      color: white;
      border: 0;
      height: 32px;
      width: 32px;
      border-radius: 50%;
      line-height: 32px;
    }

    button svg {
      transform: translateY(2px) translateX(-0.5px);
    }
  `;

  html`
    <form>
      <input type="text" placeholder="Message" name="message">
      <button>
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M14.5.5l.46.197a.5.5 0 00-.657-.657L14.5.5zm-14 6l-.197-.46a.5.5 0 00-.06.889L.5 6.5zm8 8l-.429.257a.5.5 0 00.889-.06L8.5 14.5zM14.303.04l-14 6 .394.92 14-6-.394-.92zM.243 6.93l5 3 .514-.858-5-3-.514.858zM5.07 9.757l3 5 .858-.514-3-5-.858.514zm3.889 4.94l6-14-.92-.394-6 14 .92.394zM14.146.147l-9 9 .708.707 9-9-.708-.708z" fill="currentColor"></path></svg>
      </button>
    </form>
  `;

  postRender(async () => {
    const $form = $('form');

    $form.addEventListener('submit', e => {
      e.preventDefault();

      return false;
    });
  });
}

export default registerFunctionComponent(ConversationForm, { name: 'conversation-form' });
