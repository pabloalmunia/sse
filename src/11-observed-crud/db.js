import sqlite3 from 'sqlite3';

const FILE = './data/tasks.db';

let db     = new sqlite3.Database(FILE, sqlite3.OPEN_READWRITE, (err) => {
  if (err && err.code === "SQLITE_CANTOPEN") {
    return createDatabase();
  } else if (err) {
    console.error("Getting error " + err);
    process.exit(1);
  }
});

function createDatabase () {
  db = new sqlite3.Database(FILE, (err) => {
    if (err) {
      console.error("Getting error " + err);
      process.exit(1);
    }
    createTables(db);
  });
}

function createTables (db) {
  db.exec(`
    CREATE TABLE tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        done INTEGER DEFAULT 0 NOT NULL
    );`
  );
}


const params = (keys, separator) => keys.map(k => `${k}=?`).join(separator);

/**
 * Execute an INSERT sentence
 * @param {string} table
 * @param {object} data
 * @param {boolean} [debug=false]
 * @returns {Promise<unknown>}
 */
export function insert (table, data, debug) {
  return new Promise((resolve, reject) => {
    const keys     = Object.keys(data);
    const values   = Object.values(data);
    const sentence = `INSERT INTO ${ table } (${ keys.join(', ') }) VALUES (${ keys.fill('?').join(', ') })`;
    debug && console.log(sentence);
    db.run(sentence, values, function (err) {
      err ? reject(err) : resolve(this.lastID);
    });
  })
}

/**
 * Execute a SELECT sentence
 * @param {string} table
 * @param {object|number} [filter={}]
 * @param {boolean} [debug=false]
 * @returns {Promise<Array>}
 */
export function select (table, filter = {}, debug) {
  return new Promise((resolve, reject) => {
    if (typeof filter !== 'object') {
      filter = {id: filter};
    }
    const keys     = Object.keys(filter);
    const values   = Object.values(filter);
    const sentence = `SELECT * FROM ${ table } ${keys.length ? `WHERE ${ params(keys, ' AND ') }` : ''}`;
    debug && console.log(sentence);
    db.all(sentence, values, function (err, rows) {
      err ? reject(err) : resolve(rows);
    });
  });
}

/**
 * Execute an UPDATE sentence
 * @param {string} table
 * @param {object|number} filter
 * @param {object} data
 * @param {boolean} [debug=false]
 * @returns {Promise<number>}
 */
export function update (table, filter, data, debug) {
  return new Promise((resolve, reject) => {
    if (typeof filter !== 'object') {
      filter = {id: filter};
    }
    const filterKeys   = Object.keys(filter);
    const filterValues = Object.values(filter);
    const dataKeys     = Object.keys(data);
    const dataValues   = Object.values(data);
    const sentence     = `UPDATE ${ table } SET ${ params(dataKeys, ', ') } WHERE ${ params(filterKeys, ' AND ') }`;
    debug && console.log(sentence);
    db.run(sentence, [...dataValues, ...filterValues], function (err) {
      err ? reject(err) : resolve(this.changes);
    });
  });
}

/**
 * Execute an DELETE sentence
 * @param {string} table
 * @param {object|number} filter
 * @param {boolean} [debug=false]
 * @returns {Promise<number>}
 */
export function del (table, filter, debug) {
  return new Promise((resolve, reject) => {
    if (typeof filter !== 'object') {
      filter = {id: filter};
    }
    const keys   = Object.keys(filter);
    const values = Object.values(filter);
    const sentence     = `DELETE FROM ${ table } WHERE ${ params(keys, ' AND ') }`;
    debug && console.log(sentence);
    db.run(sentence, values, function (err) {
      err ? reject(err) : resolve(this.changes);
    });
  });
}

export default {
  insert,
  select,
  update,
  delete: del
}