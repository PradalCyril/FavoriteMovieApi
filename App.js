const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const url = require('url');
const pool = require('./conf');
const port = 8800;

// Support JSON-encoded bodies
app.use(bodyParser.json());
// Support URL-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/users/create', (request, response) => {
    const formData = request.body;

    if (!formData.firstname || !formData.lastname || !formData.email || !formData.password)
        return response.sendStatus(500);

    const userData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password
    }
    return pool.query(
        'INSERT INTO users SET ?', userData, (err, res) => {
            if (err) return console.log(err);
            return response.sendStatus(201);
        }
    )
})

app.get('/user/:id', (request, response) => {
    const { id } = request.params;
    return pool.query(`SELECT * from users where id = '${id}'`, (err, res) => {
        if (err) return console.log(err);
        return response.status(200).send({ payload: res });
    })
});

app.post('/film/add', (request, response) => {
    const formData = request.body;

    if (!formData.userId || !formData.filmId)
        return response.sendStatus(500);

    const favoriteData = {
        user_id: formData.userId,
        film_id: formData.filmId
    }
    return pool.query(
        'INSERT INTO favorite_film SET ?', favoriteData, (err, res) => {
            if (err) return console.log(err);
            return response.sendStatus(201);
        }
    )

})

app.delete('/film/remove', (request, response) => {
    const formData = request.body;

    if (!formData.userId || !formData.filmId)
        return response.sendStatus(500);

    return pool.query(
        `DELETE FROM favorite_film where user_id = ${formData.userId} and film_id = ${formData.filmId}`, (err, res) => {
            if (err) return console.log(err);
            return response.sendStatus(200);
        }
    )

})

app.get('/films/favorite', (request, response) => {
    const { id } = request.params;
    return pool.query(`SELECT * from favorite_film where user_id = '${id}'`, (err, res) => {
        if (err) return console.log(err);
        return response.status(200).send({ payload: res });
    })
});

app.get('/', (request, response) => response.send('Bienvenue sur mon server'));

app.listen(port, (err => {
    if (err)
        throw new Error('Something bad happened...');
    console.log(`server is listening on ${port}`);

}));