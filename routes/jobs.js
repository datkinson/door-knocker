var express = require('express')
var router = express.Router()
let database = require('../database')

/* GET all jobs listing. */
router.get('/', function (req, res, next) {
    database.checks.list({ include_docs: true }).then((results) => {
        let jobFound = false
        for (let i = 0; i < results.rows.length; i++) {
            let result = results.rows[i]
            let timeNow = Math.floor(Date.now() / 1000)
            let timeout = 60
            let expiredBefore = timeNow - timeout
            if (!result.doc.checkPending || result.doc.checkPending < expiredBefore) {
                // console.log('found check to be checked', result)
                jobFound = true
                result.doc.checkPending = timeNow
                database.checks.insert(result.doc).then(
                    res.json(result.doc)
                )
                break
            }
        }
        if (!jobFound) {
            res.json({})
        }
    })
})

router.post('/', function (req, res, next) {
    if (req.body.hasOwnProperty('id') && req.body.id !== undefined) {
        console.log('locating check with id: ' + req.body.id)
        database.checks.get(req.body.id, { include_docs: true }).then((check) => {
            console.log('found check:', check)
            if (!check.hasOwnProperty('responses')) {
                check.responses = []
            }
            check.responses.push(req.body)
            console.log('updated check:', check)
            database.sites.insert(check).then(
                (response) => {
                    res.send('ok')
                }
            )
        })
    } else {
        res.send('bad')
    }
})

module.exports = router
