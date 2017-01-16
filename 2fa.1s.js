#!/usr/bin/env /usr/local/bin/node
const bitbar = require('bitbar'),
  authenticator = require('authenticator'),
  ncp = require('copy-paste'),
  fs = require('fs'),
  path = require('path'),
  spawn = require('child_process').spawn,
  tcpPortUsed = require('tcp-port-used'),
  low = require('lowdb');


const ACCOUNTS_FILE = path.join(
  process.argv[1].match(/\/Users\/[a-zA-Z0-9_]+\//)[0],
  '.2fa_accounts.json')

const SERVER_DIRECTORY = path.join(
  process.argv[1].match(/\/Users\/[a-zA-Z0-9_]+\//)[0],
  '.config/bitbar-2fa')

const db = low(ACCOUNTS_FILE)

const items = [
  {
    text: ':lock:',
    color: bitbar.darkMode ? 'white' : 'red',
    dropdown: false
  },
  bitbar.sep
]


function fileInServerDir(fname) {
  return path.join(SERVER_DIRECTORY, fname)
}


function startAccountsServer() {
  tcpPortUsed.check(8004).then((inUse) => {
    if (!inUse) {
      const serverProc = spawn(process.argv[0], [fileInServerDir('server.js')], {
        cwd: SERVER_DIRECTORY,
        detached: true,
        stdio: [
          'ignore',
          fs.openSync(fileInServerDir('server_out.log'), 'a'),
          fs.openSync(fileInServerDir('server_err.log'), 'a')
        ]
      })
      serverProc.unref()
      fs.writeFile(fileInServerDir('server.pid'), serverProc.pid, 'utf8')
      spawn('/bin/sh', ['-c', 'open http://localhost:8004'])
    }
  })
}


function parseData(accounts) {
  accounts.map('id').value().map((accountId) => {
    const {account_name, key, id} = db.get('accounts').find({id: accountId}).value()
    if (account_name != undefined && key != undefined && id != undefined) {
      const token = authenticator.generateToken(key)
      items.push({text: account_name})
      items.push({
        text: token,
        bash: process.argv[1],
        param1: token,
        terminal: false,
        refresh: true
      })
      items.push(bitbar.sep)
    }
  })
}

if (process.argv.length == 2) {
  try {
    parseData(db.get('accounts'))
  } catch (e) {
    items[0].text = ':exclamation:'
    items.push({
      text: e.toString()
    })
  }
  const [text, param1] = fs.existsSync(fileInServerDir('server.pid')) ? ['Stop Server', 'stopserver'] : ['Start Server', 'startserver']
  items.push({
    text,
    bash: process.argv[1],
    param1,
    terminal: false,
    refresh: true
  })
  bitbar(items)
} else {
  switch(process.argv[2]) {
    case 'copy':
      ncp.copy(process.argv[3])
      break
    case 'startserver':
      startAccountsServer()
      break
    case 'stopserver':
      spawn('sh', ['-c',
        `pkill -F ${fileInServerDir('server.pid')}; rm ${fileInServerDir('server.pid')}`
      ])
  }
}
