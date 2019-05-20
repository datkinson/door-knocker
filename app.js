var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const exphbs = require('express-handlebars')
const hbsFormHelper = require('handlebars-form-helper')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var sitesRouter = require('./routes/sites')

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

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/sites', sitesRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
