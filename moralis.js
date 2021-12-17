const Moralis = require('moralis/node')

Moralis.initialize("F5eiyTn5UeiHrY1YOkL2XWyzAx6zc5yQcxsgRyOO")

Moralis.serverURL = 'https://zkzfmiyfxvzp.moralishost.com:2053/server'

let txList = []

Moralis
    .Web3API
    .account
    .getTokenTransfers({chain: "bsc",address: '0x44bc1e612e11d0acd2c43218ea55717ac28e3a40'})
    .then(data => {
        data.result.forEach(r => {
            txList.push(r.transaction_hash)
        })
        txList.forEach(d=>console.log(d))
    })
