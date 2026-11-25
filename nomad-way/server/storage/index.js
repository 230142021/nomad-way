'use strict';
// Picks the storage backend: PostgreSQL when DATABASE_URL is set, otherwise a local JSON file.
module.exports = process.env.DATABASE_URL ? require('./postgres') : require('./jsonfile');
