var express = require('express')
var router = express.Router()
let database = require('../database')

/* GET users listing. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Users' })
    database.users.list({ include_docs: true }).then((results) => {
        const users = results.rows.map((row) => row.doc)
        res.render('users', { title: 'Users', users: users })
    })
})

router.get('/register', function (req, res, next) {
    res.render('users/register', { title: 'Register', user: {} })
})

router.post('/register', function (req, res, next) {
    console.log('POST register')
    console.log(req.body)
    database.users.insert(
        {
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
                            res.render('users/welcome', { title: 'Welcome', user: user })
                        }
                    ).catch(
                        (err) => {
                            res.render('users/register', { title: 'Register', user: {}, error: err })
                        }
                    )
            }
        ).catch(
            (err) => {
                res.render('users/register', { title: 'Register', user: {}, error: err })
            }
        )
})

module.exports = router
