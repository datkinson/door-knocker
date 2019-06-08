module.exports.isAuthorized = function (req, res, next) {
    if (req.session.loggedin) {
        return next()
    } else {
        res.render('utilities/unauthorised', { title: 'Unauthorised', session: req.session })
    }
}
