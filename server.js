
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

async function createDB (databaseName) {
    return nano.db.list().then(async (databaseList) => {
        if (databaseList.includes(databaseName)) {
            console.log('connected to existing database: ' + databaseName)
            return nano.db.use('doors')
        } else {
            return nano.db.create('doors').then((data) => {
                console.log('created new database: ' + databaseName)
                return nano.db.use('doors')
            })
        }
    })
}

async function app () {
    let database = await createDB('doors')
    const defaultUser = {
        _id: 'user_admin',
        username: 'admin',
        password: 'admin'
    }
    await database.insert(defaultUser).then(
        console.log('User: ' + defaultUser.username + ' added successfully')
    ).catch((err) => console.log('insert error:', err))
}

app()
