import DocumentHelper from "./documentHelper.mjs";
import fromUuid from "./uuid.mjs";

const socketName = "system.gfv1";
const Socket = {};
export default Socket;

/**
 * Request active GM to update a document
 * @param document document to update
 * @param update update to apply to document
 * @returns Promise which is rejected if operation timed out or failed, or resloved if update was succesful
 */
Socket.gmUpdate = (document, update) => {
  return sendRequest({
    action: "gmUpdate",
    to: game.users.activeGM?.id,
    doc: document.uuid,
    update,
  });
};

/**
 * Handlers are run on recipient client.
 * Thrown SocketErrors appear on sending client.
 * Other Errors appear on recipient client (that ran the code)
 */
const routes = {
  gmUpdate: async (document, update) => {
    if (!DocumentHelper.canObserverEdit(document)) {
      throw new SocketError("Feature disabled in settings");
    }
    if (typeof update.system === "object") {
      Object.entries(update.system).forEach(([k, v]) => {
        update[`system.${k}`] = v;
      });
    }

    const properites = document?.system?._properties;
    if (!properites) {
      throw new SocketError("Cannot be updated this way");
    }
    const cleanUpdate = {};
    for (const p of properites) {
      const v = update[`system.${p}`];
      if (v !== undefined) {
        cleanUpdate[`system.${p}`] = v;
      }
    }
    return document.update(cleanUpdate);
  },
};

/**
 * Dispatch non-response messages depending on action
 */
async function handle(msg) {
  switch (msg.action) {
    case "gmUpdate":
      return routes.gmUpdate(await fromUuid(msg.doc), msg.update);
    default:
      throw new SocketError(`Invalid action: ${msg.action}`);
  }
}

/**
 * register this client to listen for socket broadcasts
 */
export function registerSocketListen() {
  console.log("GFV1 | Registering socket listen");

  game.socket.on(socketName, async (msg, caller) => {
    if (msg.to !== game.user.id) return; // not for us!
    if (msg.action === "response") return receiveResponse(msg);
    receiveRequest(msg, caller);
  });
}

async function receiveRequest(msg, caller) {
  try {
    const response = await handle(msg);
    return game.socket.emit(socketName, {
      to: caller,
      id: msg.id,
      action: "response",
      response,
    });
  } catch (err) {
    if (err instanceof SocketError) {
      return game.socket.emit(socketName, {
        to: caller,
        id: msg.id,
        action: "response",
        err: err.originMessage,
      });
    }
    throw err;
  }
}

const futures = new Map();
function receiveResponse(msg) {
  const future = futures.get(msg.id);
  if (!future)
    return console.warn(`GFV1 | Unexpected Socket response (ID: ${msg.id})`);

  if (msg.err) {
    return future.reject(msg.err);
  }
  if (msg.response) {
    return future.resolve(msg.response);
  }
}

/**
 * Dispatch a non-response message
 * @param {SocketMessage} msg
 * @returns Promise that resolves with recipient's return value, or rejects with a SocketError message
 */
function sendRequest(msg, timeout = 5000) {
  if (!msg.to) return Promise.reject("No recepient!");
  const id = (msg.id ??= foundry.utils.randomID());
  msg.id = id;
  const promise = new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      futures.delete(id);
      reject(new SocketError("Request Timeout"));
    }, timeout);

    futures.set(id, {
      resolve: (value) => {
        clearTimeout(t);
        futures.delete(id);
        resolve(value);
      },
      reject: (reason) => {
        clearTimeout(t);
        futures.delete(id);
        reject(new SocketError(reason));
      },
    });
  });

  game.socket.emit(socketName, msg);
  return promise;
}

class SocketError extends Error {
  constructor(message) {
    const m = String(message);
    super(`GFV1 | Socket error: ${m}`);
    this.originMessage = m;
  }
}
