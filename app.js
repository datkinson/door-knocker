var createError = require('http-errors')
var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const exphbs = require('express-handlebars')
const hbsFormHelper = require('handlebars-form-helper')
let database = require('./database')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var sitesRouter = require('./routes/sites')
var jobsRouter = require('./routes/jobs')

var app = express()

const hbs = exphbs.create({
    defaultLayout: 'app',
    extname: '.hbs',
    layoutsDir: `${__dirname}/views/layouts/`,
    partialsDir: `${__dirname}/views/partials/`
})
hbsFormHelper.registerHelpers(hbs.handlebars, { namespace: 'form' })
app.engine('.hbs', hbs.engine)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
// app.set('view engine', 'hbs')
app.set('view engine', '.hbs')

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.json())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404))
// })

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

// First user middleware to detect if any users are in the database or not
app.use(function (req, res, next) {
    database.users.list({ include_docs: false }).then((results) => {
        if (results.rows.length < 1 && !req.session.nousers) {
            req.session.nousers = true
            res.redirect('/users/register-admin')
        } else {
            next()
        }
    })
})

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/sites', sitesRouter)
app.use('/jobs', jobsRouter)
module.exports = app
