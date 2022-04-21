const Web3 = require('web3')
const axios = require('axios')
const util = require('util')
const web3 = new Web3('https://speedy-nodes-nyc.moralis.io/21052818e7371cc669c4a168/bsc/mainnet')

const abi = require('./BEP721ABI.json')
const Moralis = require('moralis/node')
Moralis.initialize("F5eiyTn5UeiHrY1YOkL2XWyzAx6zc5yQcxsgRyOO")
Moralis.serverURL = 'https://zkzfmiyfxvzp.moralishost.com:2053/server'

let txList = []
let detailList = []
let num = 0
Moralis
    .Web3API
    .account
    .getTokenTransfers({chain: "bsc",address: '0x44bc1e612e11d0acd2c43218ea55717ac28e3a40',limit: 100000})
    .then(data => {
        data.result.forEach(r => {
            txList.push(r.transaction_hash)
        })
        txList.forEach(txHash => {
            web3.eth.getTransactionReceipt(txHash).then(r => {
                const { logs, from } = r
                const { fromWei } = web3.utils
                const projectAddress = logs[2].address
                let project
                try {
                    const contract = new web3.eth.Contract(abi, projectAddress);
                    contract.methods.name().call().then(project => {
                        
                    })
                } catch (e) {
                    // does not have the `symbol` function or public property
                }
                if (project !== '0x55A11056E4253aB38Cc3B12b48cC9b94718090e2') return
                let sellerGet;
                let lootexGet;
            
                if (logs.length > 5) {
                    sellerGet = fromWei(String(parseInt(logs[4].data, 16)), 'ether')
                    lootexGet = fromWei(String(parseInt(logs[5].data, 16)), 'ether')
                } else {
                    if (logs[3].data == '0x') {
                        sellerGet = fromWei(String(parseInt(logs[1].data, 16)), 'ether')
                    } else {
                        sellerGet = fromWei(String(parseInt(logs[3].data, 16)), 'ether')
                    }
                    lootexGet = fromWei(String(parseInt(logs[4].data, 16)), 'ether')
                }
            
                const seller = logs[1].topics[1].replace(logs[1].topics[1].substring(2,26), "")
                const buyer = from
                const tokenId = parseInt(logs[2].topics[3], 16)
                const obj = {project,sellerGet,lootexGet,lootexGet,seller,buyer,tokenId}
                detailList.push(obj)
            })
        })
    })

setTimeout(() => {
    console.log(detailList.length)
}, 5000);

// const contract = new web3.eth.Contract(abi, '0x55A11056E4253aB38Cc3B12b48cC9b94718090e2');
// contract.methods.name().call().then(s => console.log(s))