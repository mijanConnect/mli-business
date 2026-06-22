// Firebase compat build - keep version aligned with `firebase` in package.json.
importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: __VITE_FIREBASE_API_KEY__,
  authDomain: __VITE_FIREBASE_AUTH_DOMAIN__,
  projectId: __VITE_FIREBASE_PROJECT_ID__,
  storageBucket: __VITE_FIREBASE_STORAGE_BUCKET__,
  messagingSenderId: __VITE_FIREBASE_MESSAGING_SENDER_ID__,
  appId: __VITE_FIREBASE_APP_ID__,
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body || "New message",
    icon: payload.notification?.icon || "/favicon.ico",
    badge: "/favicon.ico",
    tag: payload.messageId || "notification",
    requireInteraction: payload.notification?.requireInteraction || false,
    data: payload.data || {},
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const clickedNotification = event.notification;
  const urlToOpen = clickedNotification.data?.link || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }

        return undefined;
      }),
  );
});