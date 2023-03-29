import { html } from "../../../helpers.js";
import { startMutualSubscription } from "../../../messages-fetcher.js";
import { getAccount } from "../../../db/models/account.js";
import { getProfile } from "../../../db/models/profile.js";

/**
* @param {Request} request
*/
export default async function handler(request) {
  const url = new URL(request.url);
  const [, , , publicKey] = url.pathname.split('/');
  const account = await getAccount();
  const profile = await getProfile(publicKey);

  startMutualSubscription(publicKey, account.id);

  return html`
    <script src="/js/components/conversation-form.js"></script>
    <script src="/js/components/conversation-messages.js"></script>
    <script src="/js/components/nostr-profile-row.js"></script>
    <link rel="stylesheet" href="/css/conversations-page.css">
    <main>
    <div class="bg" style="background-image:url('${profile.banner}')"></div>
    <header>
      <router-link href="/">
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M10 14L3 7.5 10 1" stroke="currentColor" stroke-linecap="square"></path></svg>
      </router-link>
      <nostr-profile-row public-key="${publicKey}"></nostr-profile-row>
    </header>
    <conversation-messages public-key="${publicKey}"></conversation-messages>
    <conversation-form to="${publicKey}"></conversation-form>
    </main>
  `;
}
