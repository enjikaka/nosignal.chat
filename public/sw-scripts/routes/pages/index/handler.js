/**
* @param {Request} request
*/
export default async function handler() {
  return (await fetch('/sw-scripts/routes/pages/index/index.html')).text();
}
