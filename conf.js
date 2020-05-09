const  mysql = require('mysql');
const  pool = mysql.createPool({
connectionLimit: 5,
host :  'localhost', // adresse du serveur
user :  'root', // le nom d'utilisateur
password :  'Sete-347', // le mot de passe
database :  'moviesandme', // le nom de la base de données
});

module.exports = pool;
