const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const config = require('./config')
const applicationInit = require('./routes/application')
const keyboards = require('./routes/keyboards')

const app = express()

// Extract origin from APP_BASE_URL for CORS
let origin = '*'
try {
  const appUrl = new URL(config.APP_BASE_URL)
  origin = appUrl.origin
} catch (err) {
  console.error('Failed to parse APP_BASE_URL for CORS:', err.message)
  console.error('Using wildcard CORS instead')
}

app.use(bodyParser.json())
app.use(cors({ origin }))

if (config.ENABLE_DEV_SERVER) {
  applicationInit(app)
}

app.use(morgan('dev'))
app.get('/health', (req, res) => res.sendStatus(200))

app.use(keyboards)
config.ENABLE_GITHUB && app.use('/github', require('./routes/github'))

module.exports = app
