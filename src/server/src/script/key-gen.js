const { createHash } = require("crypto");

let args = process.argv.slice(2);
const user = args[0];
const data = args[1];

/**
 * Generate bot key to authorize on server with (user + key) -> to base64
 * @param {string} data - telegram or discord's ID
 * @param {string} key
 * @returns A hash string is botkey to verify that request is actually from bot
 */
function genBotKey(user, key) {
    const hash = createHash("sha256")
        .update(user + key)
        .digest("hex");
    const bodyKey = {
        user,
        hash,
    };
    return Buffer.from(JSON.stringify(bodyKey)).toString("base64");
}

/**
 *                                               (your_id)  (BOT_KEY in .env)
 *                                                  ^          ^
 * @example node src/server/src/script/key-gen.js 123123 my_secret_key
 */
console.log(genBotKey(user, data));
