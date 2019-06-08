var express = require('express')
var router = express.Router()
let database = require('../database')
let auth = require('../utilities/auth')

/* GET users listing. */
router.get('/', auth.isAuthorized, function (req, res, next) {
    // res.render('index', { title: 'Users' })
    database.users.list({ include_docs: true }).then((results) => {
        const users = results.rows.map((row) => row.doc)
        res.render('users', { title: 'Users', session: req.session, users: users })
    })
})

router.get('/login', function (req, res, next) {
    res.render('users/login', { title: 'Login', session: req.session, user: {} })
})

router.post('/login', function (req, res, next) {
    let username = req.body.username
    let password = req.body.password
    if (username && password) {
        database.users.list({ include_docs: true }).then(results => {
            results.rows.forEach(result => {
                if (result.doc.username === username) {
                    if (result.doc.password === password) {
                        req.session.loggedin = true
                        req.session.username = username
                        res.redirect('/')
                        res.end()
                    }
                }
            })
            console.log('invalid username or password')
            // res.render('users/login', { title: 'Login', session: req.session, user: { username: username }, error: 'Invalid username or password' })
        })
    } else {
        console.log('no username or password specified')
        res.render('users/login', { title: 'Login', session: req.session, user: { username: username }, error: 'Please enter username and password' })
    }
})

router.get('/logout', function (req, res, next) {
    req.session.loggedin = false
    req.session.username = null
    res.render('users/logout', { title: 'Logout', session: req.session, success: 'You have been logged out' })
})

router.get('/register', function (req, res, next) {
    res.render('users/register', { title: 'Register', session: req.session, user: {} })
})

router.post('/register', function (req, res, next) {
    database.users.insert(
        {
            _id: req.body.username,
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            email: req.body.email
        }
    )
        .then(
            (response) => {
                database.users.get(response.id)
                    .then(
                        (user) => {
                            console.log('Just created user:', user)
                            res.render('users/welcome', { title: 'Welcome', session: req.session, user: user })
                        }
                    ).catch(
                        (err) => {
                            res.render('users/register', { title: 'Register', session: req.session, user: {}, error: err })
                        }
                    )
            }
        ).catch(
            (err) => {
                res.render('users/register', { title: 'Register', session: req.session, user: {}, error: err })
            }
        )
})

router.get('/register-admin', function (req, res, next) {
    if (req.session.nousers) {
        res.render('users/register-admin', { title: 'Register Admin User', session: req.session, user: {} })
    } else {
        res.send('Admin already set up')
    }
})

router.post('/register-admin', function (req, res, next) {
    database.users.insert(
        {
            _id: 'admin',
            username: 'admin',
            firstName: 'admin',
            lastName: 'user',
            password: req.body.password,
            email: req.body.email
        }
    )
        .then(
            (response) => {
                database.users.get(response.id)
                    .then(
                        (user) => {
                            console.log('Set admin password')
                            req.session.nousers = false
                            req.session.loggedin = true
                            req.session.username = 'admin'
                            res.render('users/welcome', { title: 'Welcome', session: req.session, user: user })
                        }
                    ).catch(
                        (err) => {
                            res.render('users/register-admin', { title: 'Register', session: req.session, user: {}, error: err })
                        }
                    )
            }
        ).catch(
            (err) => {
                res.render('users/register-admin', { title: 'Register', session: req.session, user: {}, error: err })
            }
        )
})

module.exports = router
