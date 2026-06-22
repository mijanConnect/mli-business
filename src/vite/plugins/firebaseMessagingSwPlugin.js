import fs from "node:fs";
import path from "node:path";

const SERVICE_WORKER_PATH = "/firebase-messaging-sw.js";
const TEMPLATE_PATH = path.resolve(
  process.cwd(),
  "src/sw/firebase-messaging-sw.template.js",
);

function getFirebaseServiceWorkerSource(env) {
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");

  const replacements = {
    VITE_FIREBASE_API_KEY: env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: env.VITE_FIREBASE_APP_ID,
  };

  return template.replace(/__([A-Z0-9_]+)__/g, (match, key) => {
    if (!(key in replacements)) {
      return match;
    }

    return JSON.stringify(replacements[key] ?? "");
  });
}

export function firebaseMessagingSwPlugin(env) {
  let source = getFirebaseServiceWorkerSource(env);

  return {
    name: "firebase-messaging-sw-asset",
    buildStart() {
      source = getFirebaseServiceWorkerSource(env);
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if ((req.url || "").split("?")[0] !== SERVICE_WORKER_PATH) {
          next();
          return;
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        res.end(source);
      });
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "firebase-messaging-sw.js",
        source,
      });
    },
  };
}