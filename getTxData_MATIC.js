const Web3 = require('web3')
const web3 = new Web3('https://speedy-nodes-nyc.moralis.io/21052818e7371cc669c4a168/polygon/mainnet')
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
        let projectAddress = logs[2].address
        if (projectAddress == '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270') {
            projectAddress = logs[1].address
            if (projectAddress == '0x0000000000000000000000000000000000001010') {
                projectAddress = logs[4].address
            }
        }

        const contract = new web3.eth.Contract(abi, projectAddress);
        const project = await contract.methods.name().call()

        if (logs.length < 4) {
            console.log(txItem.tx)
            continue
        }


        let sellerGet = fromWei(web3.utils.hexToNumberString(logs[2].data), 'ether')
        if (logs[2].data == '0x') {
            sellerGet = fromWei(web3.utils.hexToNumberString(logs[1].data), 'ether')
        }
        let lootexGet = fromWei(web3.utils.hexToNumberString(logs[3].data), 'ether')
        if (logs.length == 6) {
            sellerGet = fromWei(web3.utils.hexToNumberString(logs[1].data), 'ether')
            lootexGet = fromWei(web3.utils.hexToNumberString(logs[4].data), 'ether')
        }
        if (logs.length > 7) {
            sellerGet = fromWei(web3.utils.hexToNumberString(logs[5].data), 'ether')
            lootexGet = fromWei(web3.utils.hexToNumberString(logs[6].data), 'ether')
        }
        if (logs[1].data == '0x' && logs[2].data == '0x') {
            sellerGet = fromWei(web3.utils.hexToNumberString(logs[3].data), 'ether')
            lootexGet = fromWei(web3.utils.hexToNumberString(logs[4].data), 'ether')
        }
        if (logs.length > 10) {
            sellerGet = fromWei(web3.utils.hexToNumberString(logs[6].data), 'ether')
            lootexGet = fromWei(web3.utils.hexToNumberString(logs[7].data), 'ether')
        }

        
        let seller = logs[1].topics[1].replace(logs[1].topics[1].substring(2,26), "")
        if (logs.length > 7) {
            seller = logs[7].topics[1].replace(logs[1].topics[1].substring(2,26), "")
        }
        if (logs.length == 5) {
            seller = logs[2].topics[1].replace(logs[1].topics[1].substring(2,26), "")
        }
        let buyer = from
        if (logs.length == 5) {
            buyer = seller = logs[2].topics[2].replace(logs[1].topics[1].substring(2,26), "")
        }

        let tokenId = parseInt(logs[1].topics[3], 16)
        if (!logs[1].topics[3]) {
            tokenId = parseInt(logs[2].topics[3], 16)
        }
        if (logs.length > 7) {
            tokenId = parseInt(logs[7].topics[3], 16)
        }
        if (logs.length > 10) {
            tokenId = parseInt(logs[5].topics[3], 16)
        }
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

// init('txList_pol_20')

const getOneData = async () => {
    const util = require('util')
    const r = await web3.eth.getTransactionReceipt('0x4781530b3abf3a2e9f5148da682180bd79087b82e4373bfc3e048aac606fe3b0')
    console.log(util.inspect(r, { showHidden: false, depth: null, colors: true }))
    console.log(r.logs.length)
}
getOneData()
// logs[3].address
