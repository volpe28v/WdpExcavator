const express = require('express')
const bodyParser = require('body-parser')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

const gihyo = require('./gihyo')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('port', port)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

app.post('/search', function (req, res){
  console.log(req.url);
  console.log(req.body);
  var query = req.body.query;
  console.log(query)

  gihyo.search(query)
    .then(function(results){
      res.send({ results: results })
    });
});

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
