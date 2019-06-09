#!/usr/bin/env node
let sleep = require('sleep')
const port = process.env.PORT || '5000'
const serverAddress = process.env.PORT || 'http://localhost:' + port

let request = require('request')
let path = serverAddress + '/jobs'

let timeToWait = 5

function isEmpty (obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false
        }
    }
    return true
}

function getJob (delay) {
    sleep.sleep(delay)
    request({
        url: path,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            if (isEmpty(response.body)) {
                console.log('no jobs found')
                console.log(response.body)
                getJob(timeToWait)
            } else {
                processJob(response.body)
                getJob(0)
            }
        }
    })
}

function processJob (job) {
    if (job.hasOwnProperty('url')) {
        request({ url: job.url }, (error, response, body) => {
            let hasErrored = false
            let reason = ''
            if (error) { hasErrored = true }
            if (response && job.hasOwnProperty('statusCode') && job.statusCode !== null && response.hasOwnProperty('statusCode')) {
                if (response.statusCode != job.statusCode) {
                    hasErrored = true
                    reason = 'Status Code Mismatch, expected ' + job.statusCode + ' but found: ' + response.statusCode
                }
            }
            if (hasErrored) {
                processError(job, response, reason)
            } else {
                processSuccess(job, response)
            }
        })
    }
}

function processError (job, response, reason) {
    console.log('job named ' + job.name + ' failed')
    if (response !== undefined) {
        postResponse({
            'statusCode': response.statusCode,
            'status': 'error',
            'reason': reason,
            'id': job._id,
            'check': job
        })
    }
}

function processSuccess (job, response) {
    console.log('job named ' + job.name + ' suceeded')
    postResponse({
        'statusCode': response.statusCode,
        'status': 'success',
        'id': job._id,
        'check': job
    })
}

function postResponse (report) {
    console.log('posting report: ', report)
    request.post(
        path,
        { json: report },
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(body)
            }
        }
    )
}

console.log('Worker started')

getJob(timeToWait)
