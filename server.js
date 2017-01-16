const http = require('http'),
  path = require('path'),
  url = require('url'),
  fs = require('fs'),
  low = require('lowdb'),
  querystring = require('querystring');


const ACCOUNTS_FILE = path.join(
  process.argv[1].match(/\/Users\/[a-zA-Z0-9_]+\//)[0],
  '.2fa_accounts.json')
const db = low(ACCOUNTS_FILE)
db.defaults({accounts: []}).value()

http.createServer((req, resp) => {
  const req_path = url.parse(req.url).pathname
  switch (true) {
    case /^\/$/.test(req_path):
    case /^\/index\.html$/.test(req_path):
      fs.readFile(path.join(process.cwd(), 'index.html'), 'binary', (err, data) => {
        if (err) {
          resp.writeHeader(500, {'Content-Type': 'text/plain'})
          resp.write(`${err}\n`)
          resp.end()
        } else {
          resp.writeHeader(200)
          resp.write(data, 'binary')
          resp.end()
        }
      })
      break
    case /^\/accounts$/.test(req_path):
      if (req.method === 'POST') {
        const bodyBuffer = []
        req.on('data', (chunk) => bodyBuffer.push(chunk))
          .on('end', () => {
            const {account_name, key} = querystring.parse(Buffer.concat(bodyBuffer).toString())
            if (account_name === undefined || key === undefined) {
              resp.writeHeader(400)
              resp.end()
            } else {
              console.log(JSON.stringify(db.get('accounts').toJSON()))
              const id = db.get('accounts').toJSON().length + 1
              const respBody = db.get('accounts').push({account_name, key, id}).value()
              resp.writeHeader(302, {'Location': '/'})
              resp.end()
            }
          })
      }
      if (req.method === 'GET') {
        resp.writeHeader(200, {'Content-Type': 'application/json'})
        resp.write(JSON.stringify({accounts: db.get('accounts').toJSON()}))
        resp.end()
      }
      break
    case /^\/accounts\/\d+$/.test(req_path):
      if (req.method === 'DELETE') {
        const id = /^\/accounts\/(\d+)$/.exec(req_path)[1]
        db.get('accounts').remove({id: Number(id)}).value()
        resp.writeHeader(200)
        resp.end()
      }
      break
    case /^\/static\/[a-zA-Z1-9_]+\.(js|css)$/.test(req_path):
      const static_file = path.join(process.cwd(), req_path)
      console.log(static_file)
      fs.readFile(static_file, 'binary', (err, data) => {
        if (err) {
          resp.writeHeader(500, {'Content-Type': 'text/plain'})
          resp.write(`${err}\n`)
          resp.end()
        } else {
          resp.writeHeader(200)
          resp.write(data, 'binary')
          resp.end()
        }
      })
      break
    default:
      resp.writeHeader(404)
      resp.end()
  }
}).listen(8004)
console.log('Listening on :8004')
        
