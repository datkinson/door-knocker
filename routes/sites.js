var express = require('express')
var router = express.Router()
let database = require('../database')
let auth = require('../utilities/auth')

/* GET sites listing. */
router.get('/', auth.isAuthorized, function (req, res, next) {
    database.sites.list({ include_docs: true }).then((results) => {
        const sites = results.rows.map((row) => row.doc)
        res.render('sites', { title: 'Sites', session: req.session, sites: sites })
    })
})

router.get('/view/:siteId', auth.isAuthorized, function (req, res, next) {
    database.sites.get(req.params.siteId, { include_docs: true }).then((site) => {
        database.checks.fetch({ keys: site.checks }, { include_docs: true }).then(
            (checks) => {
                let siteChecks = []
                checks.rows.forEach(row => {
                    if ('id' in row) {
                        siteChecks.push(row.doc)
                    }
                })
                res.render('sites/view', { title: 'Site: ' + site.name, session: req.session, site: site, checks: siteChecks })
            }
        )
    })
})

router.get('/view/:siteId/check/:checkId', auth.isAuthorized, function (req, res, next) {
    database.checks.get(req.params.checkId, { include_docs: true }).then((check) => {
        res.render('sites/viewCheck', { title: 'Check: ' + check.name, session: req.session, check: check, siteId: req.params.siteId })
    })
})

router.get('/register', auth.isAuthorized, function (req, res, next) {
    res.render('sites/register', { title: 'Register', session: req.session, site: {} })
})

router.post('/register', auth.isAuthorized, function (req, res, next) {
    database.sites.insert(
        {
            ...req.body,
            ...{ 'checks': [] }

        }
    )
        .then(
            (response) => {
                database.sites.get(response.id)
                    .then(
                        (site) => {
                            console.log('Just created site:', site)
                            res.redirect('view/' + response.id)
                        }
                    ).catch(
                        (err) => {
                            res.render('sites/register', { title: 'Register', session: req.session, site: {}, error: err })
                        }
                    )
            }
        ).catch(
            (err) => {
                res.render('sites/register', { title: 'Register', session: req.session, site: {}, error: err })
            }
        )
})

router.get('/register/:siteId/check', auth.isAuthorized, function (req, res, next) {
    database.sites.get(req.params.siteId, { include_docs: true }).then((site) => {
        res.render('sites/registerCheck', { title: 'Add Check', session: req.session, site: site })
    })
})

router.post('/register/:siteId/check', auth.isAuthorized, function (req, res, next) {
    console.log('posted to route: /register/' + req.params.siteId + '/check')
    database.checks.insert(req.body).then((check) => {
        database.sites.get(req.params.siteId, { include_docs: true }).then(
            (site) => {
                if (!('checks' in site)) {
                    site.checks = []
                }
                site.checks.push(check.id)
                database.sites.insert(site).then(
                    (savedSite) => {
                        res.redirect('/sites/view/' + req.params.siteId + '/check/' + check.id)
                    }
                )
            }
        )
    })
})

router.get('/edit/:siteId', auth.isAuthorized, function (req, res, next) {
    database.sites.get(req.params.siteId, { include_docs: true }).then((site) => {
        res.render('sites/edit', { title: 'Edit Site: ' + site.name, site: site })
    })
})

router.post('/edit/:siteId', auth.isAuthorized, function (req, res, next) {
    database.sites.get(req.params.siteId, { include_docs: true }).then((site) => {
        let edditedSite = { ...site, ...req.body }
        database.sites.insert(edditedSite).then(
            (response) => {
                res.redirect('/sites/view/' + req.params.siteId)
            }
        )
    })
})

router.get('/edit/:siteId/check/:checkId', auth.isAuthorized, function (req, res, next) {
    database.checks.get(req.params.checkId, { include_docs: true }).then((check) => {
        res.render('sites/editCheck', { title: 'Edit Check: ' + check.name, session: req.session, check: check })
    })
})

router.post('/edit/:siteId/check/:checkId', auth.isAuthorized, function (req, res, next) {
    database.checks.get(req.params.checkId, { include_docs: true }).then((check) => {
        let edditedCheck = { ...check, ...req.body }
        delete edditedCheck._rev
        database.checks.insert(edditedCheck).then(
            (response) => {
                res.redirect('/sites/view/' + req.params.siteId + '/check/' + req.params.checkId)
            }
        )
    })
})

module.exports = router
