const Web3 = require('web3')
const web3 = new Web3('https://mainnet.infura.io/v3/1efc60f72ff14f738c91db5b35903c18')
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const fs = require('fs');
const { fromWei } = web3.utils
const abi = require('./ETH721ABI.json')

let txList = []
let detailList = []
let consoleProgress
let csvWriter

const csvWriterFormat = (outputFileName) => createCsvWriter({
    // excel output name
    path: `${outputFileName}.csv`, 
    //id: output data, title: excel title
    header: [ 
        {id: 'txhash', title: 'Txhash'},
        {id: 'project', title: 'Project'},
        {id: 'sellerGet', title: 'SellerGet'},
        {id: 'lootexGet', title: 'LootexGet'},
        {id: 'purchasePrice', title: 'Purchase Price'},
        {id: 'seller', title: 'Seller'},
        {id: 'buyer', title: 'Buyer'},
        {id: 'tokenId', title: 'TokenId'},
        {id: 'dateTime', title: 'Date/Time'},
        {id: 'date', title: 'Date'},
        {id: 'makerFeeRate', title: 'MakerFeeRate'},
        {id: 'royalties', title: 'Royalties'},
        {id: 'platformFee', title: 'PlatformFee'},
    ]
})

const progress = (total) => {
    let itemNowNum = 0
    return () => {
        itemNowNum ++
        return console.log(`${itemNowNum} / ${total}, done!`)
    }
}

const reduceDuplicateKey = (list) => 
    Object.values(list.reduce((acc, item) => {
        if (!acc[item.tx]) {
            acc[item.tx] = item
        }
        return acc;
    }, {}))

const writeToCsv = (detailList) =>
    csvWriter
        .writeRecords(detailList)
        .then(() => console.log('The CSV file was written successfully'));

const getData = async () => {
    for (let txItem of txList) {
        const r = await web3.eth.getTransactionReceipt(txItem.tx)
        const { logs, from } = r
        // console.log(logs.length)
        if (!logs[2] || logs.length < 3 || logs.length > 100) continue
        const projectAddress = logs[2].address

        const contract = new web3.eth.Contract(abi, projectAddress);
        const project = await contract.methods.name().call()


        let sellerGet
        let lootexGet
        if (logs.length < 6) {
            sellerGet = fromWei(web3.utils.hexToNumberString(logs[3].data), 'ether')
            if (logs[3].data === '0x') sellerGet = fromWei(web3.utils.hexToNumberString(logs[1].data), 'ether')
            lootexGet = fromWei(web3.utils.hexToNumberString(logs[4].data), 'ether')

        } else {
            sellerGet = fromWei(web3.utils.hexToNumberString(logs[4].data), 'ether')
            lootexGet = fromWei(web3.utils.hexToNumberString(logs[5].data), 'ether')
        }

        
        const seller = logs[1].topics[1].replace(logs[1].topics[1].substring(2,26), "")
        let buyer = from
        if (logs.length > 9) {
            buyer = logs[9].topics[2].replace(logs[9].topics[2].substring(2,26), "")
        }
        const tokenId = parseInt(logs[2].topics[3], 16)
        const purchasePrice = Number(sellerGet) + Number(lootexGet)
        const makerFeeRate = (lootexGet / purchasePrice).toFixed(4)
        let royalties = makerFeeRate >= 0.025 ? lootexGet - lootexGet * 0.025 / makerFeeRate : 0
        if (royalties < 0) royalties = 0
        const platformFee = makerFeeRate >= 0.025 ? lootexGet * 0.025 / makerFeeRate : lootexGet
        const dateTime = txItem.date
        const date = dateTime.split(' ')[0]

        const obj = {
            txhash: txItem.tx,
            project,
            sellerGet,
            lootexGet,
            purchasePrice,
            seller,
            buyer,
            tokenId,
            dateTime,
            date,
            makerFeeRate,
            royalties,
            platformFee
        }
        detailList.push(obj)
        consoleProgress()
    }
    writeToCsv(detailList)
}

const init = (inputFileName) => {
    fs.createReadStream(`${inputFileName}.csv`)
        .pipe(csv())
        .on('data', (row) => {
            txList.push(row)
        })
        .on('end', () => {
            txList = reduceDuplicateKey(txList)
            consoleProgress = progress(txList.length)
            const outputName = inputFileName.replace('txList', 'detailList')
            csvWriter = csvWriterFormat(outputName)
            getData()
        })
}

// init('txList_eth')

const getOneData = async () => {
    const util = require('util')
    const r = await web3.eth.getTransactionReceipt('0xe295730db2e65a0fc3d517f049a194d6d4e0fa65199b970a30381ea0ee53aa1e')
    console.log(util.inspect(r, { showHidden: false, depth: null, colors: true }))
    console.log(r.logs.length)
}
getOneData()

