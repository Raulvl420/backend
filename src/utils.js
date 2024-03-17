const { dirname } = require('path');
const __filename = require('url').fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

module.exports = __dirname;