var express = require('express')
var router = express.Router()
let database = require('../database')

/* GET users listing. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Users' })
    database.users.list({ include_docs: true }).then((results) => {
        results.rows.forEach((user) => {
            console.log('user', user.doc)
        })
        const users = results.rows.map((row) => row.doc)
        res.render('users', { title: 'Users', users: users })
    })
})

router.get('/create', function (req, res, next) {
    database.users.insert(
        {
            _id: '1',
            username: 'admin',
            passord: 'admin'
        }
    ).then((result) => {
        console.log('created user')
        res.render('index', { title: 'Created' })
    }).catch((err) => {
        console.error('unable to create user', err)
    })
})

module.exports = router
