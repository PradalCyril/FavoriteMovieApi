const  mysql = require('mysql');
const  pool = mysql.createPool({
connectionLimit: 5,
host: 'us-cdbr-east-02.cleardb.com', // adresse du serveur
user: 'b695b618d584cb', // le nom d'utilisateur
password: '639d5ef4', // le mot de passe
database: 'heroku_64ac6370bd740ea', // le nom de la base de données,
waitForConnections: true
});

console.log("coucou")
module.exports = pool;