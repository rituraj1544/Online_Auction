import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs.js';

let client;
let bidSubscription;
let auctionSubscription;
const bidListeners = new Set();
const auctionListeners = new Set();

function ensureBidSocket() {
  if (client && client.active) {
    return client;
  }

  client = new Client({
    webSocketFactory: () => new SockJS('/ws'),
    reconnectDelay: 5000,
    debug: () => {},
  });

  client.onConnect = () => {
    if (bidSubscription) {
      bidSubscription.unsubscribe();
    }
    bidSubscription = client.subscribe('/topic/bids', (message) => {
      const payload = JSON.parse(message.body);
      bidListeners.forEach((listener) => listener(payload));
    });

    if (auctionSubscription) {
      auctionSubscription.unsubscribe();
    }
    auctionSubscription = client.subscribe('/topic/auctions', (message) => {
      const payload = JSON.parse(message.body);
      auctionListeners.forEach((listener) => listener(payload));
    });
  };

  client.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
  };

  client.activate();
  return client;
}

export function createBidSocket(onMessageReceived) {
  if (typeof onMessageReceived === 'function') {
    bidListeners.add(onMessageReceived);
  }

  return ensureBidSocket();
}

export function disconnectBidSocket(onMessageReceived) {
  if (typeof onMessageReceived === 'function') {
    bidListeners.delete(onMessageReceived);
  } else {
    bidListeners.clear();
  }

  if (bidListeners.size > 0) {
    return;
  }

  if (bidSubscription) {
    bidSubscription.unsubscribe();
    bidSubscription = null;
  }
  if (client) {
    client.deactivate();
    client = null;
  }
}

export function createAuctionSocket(onMessageReceived) {
  if (typeof onMessageReceived === 'function') {
    auctionListeners.add(onMessageReceived);
  }

  return ensureBidSocket();
}

export function disconnectAuctionSocket(onMessageReceived) {
  if (typeof onMessageReceived === 'function') {
    auctionListeners.delete(onMessageReceived);
  } else {
    auctionListeners.clear();
  }
}
