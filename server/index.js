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

var PAGE_NUMBER = 20;
app.post('/search', function (req, res){
  var query = req.body.query;
  var number = req.body.number;

  var search_requests = [];
  for(var i = 0; i < number; i += PAGE_NUMBER){
    search_requests.push(gihyo.search(query, i));
  }

  Promise.all(search_requests)
    .then(function(results){
      var found_tocs = Array.prototype.concat.apply([], results);
      res.send({ results: found_tocs})
    })
    .catch(function(err){
      console.log(err);
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
