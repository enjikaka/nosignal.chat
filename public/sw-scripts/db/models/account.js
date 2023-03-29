import { dexieDb } from "../db.js";

export function setAccount(privateKey) {
  return dexieDb.account.put({ id: privateKey });
}

export async function getAccount() {
  const accounts = await dexieDb.account.toArray();

  return accounts[0];
}
