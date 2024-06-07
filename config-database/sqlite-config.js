const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

let db = new sqlite3.Database('./database/tarefas-game-dev-db.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err != undefined && err != null) {
        console.log("Erro ao se conectar ao sqlite" + err.message);
        exit(1);
    }
});

module.exports = db;