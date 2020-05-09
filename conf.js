const  mysql = require('mysql');
const  pool = mysql.createPool({
connectionLimit: 5,
host: 'us-cdbr-east-06.cleardb.net', // adresse du serveur
user: 'b060e2950db88f', // le nom d'utilisateur
password: 'a9b6d338', // le mot de passe
database: 'heroku_f75ddff329f7583', // le nom de la base de données,
waitForConnections: true
});

module.exports = pool;