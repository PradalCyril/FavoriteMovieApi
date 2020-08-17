const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const url = require('url');
const pool = require('./conf');
const port = process.env.PORT || 8800;

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

app.post('/users/signin', function (req, res, next) {
    console.log(req.body);
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).send(err)
        if (!user) return res.status(400).json({ flash: info.message });
        return (res.status(200).json({ user: user.email, flash: `${user.email} is connected` })
        )
    })(req, res, next)
});

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


passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: false
    },
    function (email, password, cb) {
        if (!email || !password) { return cb(null, false, req.flash('message', 'All fields are required.')); }
        pool.query('SELECT password, email FROM users WHERE email = ?', [email], (err, res) => {
            let hash = res[0].password;
            let isSame = bcrypt.compareSync(password, hash)
            if (err) {
                return cb(err, false, null)
            }
            if (!isSame) {
                return cb(null, false, { message: 'Incorrect email ou password.' })
            } else {
                const user = { email: res[0].email };
                return cb(null, user);
            }
        })


    }
));

app.listen(port, (err => {
    if (err)
        throw new Error('Something bad happened...');
    console.log(`server is listening on ${port}`);

}));