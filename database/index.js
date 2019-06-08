let couchDbConfig = {
    host: process.env.COUCHDB_HOST || 'localhost',
    port: process.env.COUCHDB_PORT || 5984,
    protocol: process.env.COUCHDB_PROTOCOL || 'http',
    username: process.env.COUCHDB_USER || null,
    password: process.env.COUCHDB_PASSWORD || null
}
let couchDbCredentials = ''
if (couchDbConfig.username !== null && couchDbConfig.password !== null) {
    couchDbCredentials = couchDbConfig.username + ':' + couchDbConfig.password + '@'
}
const nano = require('nano')(couchDbConfig.protocol + '://' + couchDbCredentials + couchDbConfig.host + ':' + couchDbConfig.port)

let database = {}
console.log('creating database object', database)

Promise.resolve(nano.db.create('users').catch(() => {
    console.log('unable to create database: users')
}))
database.users = nano.db.use('users')
// Promise.resolve(database.users.insert({ _id: 'admin', username: 'admin', password: 'admin' }).catch(
//     () => {
//         console.log('admin user already exists')
//     }
// ))
// console.log('creating users database', database)

Promise.resolve(nano.db.create('groups').catch(() => {
    console.log('unable to create database: groups')
}))
database.groups = nano.db.use('groups')
// console.log('creating groups database', database)

Promise.resolve(nano.db.create('sites').catch(() => {
    console.log('unable to create database: sites')
}))
database.sites = nano.db.use('sites')

Promise.resolve(nano.db.create('checks').catch(() => {
    console.log('unable to create database: checks')
}))
database.checks = nano.db.use('checks')
// console.log('creating sites database', database)

// async function createDatabase (databaseName) {
//     let dbConnector = null
//     await nano.db.create(databaseName).then((connector) => {
//         console.log('database ' + databaseName + ' successfully created')
//         dbConnector = connector
//     }).catch((err) => {
//         console.error(err)
//     })
//     return dbConnector
// }

// database.users = createDatabase('users')
// database.groups = createDatabase('groups')
// database.sites = createDatabase('sites')

module.exports = database
