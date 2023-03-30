import './components/app-router.js';

const authChannel = new BroadcastChannel('auth');

authChannel.addEventListener('message', e => {
  if (e.data === 'authorized?') {
    authChannel.postMessage(sessionStorage.getItem('nsec') !== null);
  }
});
