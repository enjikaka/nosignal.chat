import { getAccount } from "./db/models/account.js";
import { startSubscription } from "./messages-fetcher.js";

export default async function init() {
  const account = await getAccount();

  console.log('init', { account });

  if (account) {
    startSubscription(account.id);
  }
}
