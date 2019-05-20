var express = require('express')
var router = express.Router()
let database = require('../database')

/* GET sites listing. */
router.get('/', function (req, res, next) {
    database.sites.list({ include_docs: true }).then((results) => {
        const sites = results.rows.map((row) => row.doc)
        res.render('sites', { title: 'Sites', sites: sites })
    })
})

router.get('/view/:siteId', function (req, res, next) {
    database.sites.get(req.params.siteId, { include_docs: true }).then((site) => {
        res.render('sites/view', { title: 'Site: ' + site.name, site: site })
    })
})

router.get('/register', function (req, res, next) {
    res.render('sites/register', { title: 'Register', site: {} })
})

router.post('/register', function (req, res, next) {
    console.log('POST register')
    console.log(req.body)
    database.sites.insert(
        {
            name: req.body.name,
            url: req.body.url,
            searchString: req.body.searchString,
            responseCode: req.body.responseCode
        }
    )
        .then(
            (response) => {
                database.sites.get(response.id)
                    .then(
                        (site) => {
                            console.log('Just created site:', site)
                            res.render('sites/success', { title: 'Success', site: site })
                        }
                    ).catch(
                        (err) => {
                            res.render('sites/register', { title: 'Register', site: {}, error: err })
                        }
                    )
            }
        ).catch(
            (err) => {
                res.render('sites/register', { title: 'Register', site: {}, error: err })
            }
        )
})

router.get('/edit/:siteId', function (req, res, next) {
    database.sites.get(req.params.siteId, { include_docs: true }).then((site) => {
        res.render('sites/edit', { title: 'Edit Site: ' + site.name, site: site })
    })
})

router.post('/edit/:siteId', function (req, res, next) {
    database.sites.get(req.params.siteId, { include_docs: true }).then((site) => {
        let edditedSite = { ...site, ...req.body }
        database.sites.insert(edditedSite).then(
            (response) => {
                res.redirect('/sites/view/' + req.params.siteId)
            }
        )
    })
})

module.exports = router
