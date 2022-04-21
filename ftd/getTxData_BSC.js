const Web3 = require('web3')
// const web3 = new Web3('https://speedy-nodes-nyc.moralis.io/21052818e7371cc669c4a168/eth/rinkeby')
const web3 = new Web3('https://speedy-nodes-nyc.moralis.io/21052818e7371cc669c4a168/bsc/mainnet')
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const fs = require('fs')
const { fromWei } = web3.utils
const abi = require('./BEP721ABI.json')

let txList = []
let detailList = []
let consoleProgress
let csvWriter

const csvWriterFormat = (outputFileName) => createCsvWriter({
    // excel output name
    path: `${outputFileName}.csv`,
    //id: output data, title: excel title
    header: [
        { id: 'txhash', title: 'Txhash' },
        { id: 'project', title: 'Project' },
        { id: 'sellerGet', title: 'SellerGet' },
        { id: 'lootexGet', title: 'LootexGet' },
        { id: 'purchasePrice', title: 'Purchase Price' },
        { id: 'seller', title: 'Seller' },
        { id: 'buyer', title: 'Buyer' },
        { id: 'tokenId', title: 'TokenId' },
        { id: 'dateTime', title: 'Date/Time' },
        { id: 'date', title: 'Date' },
        { id: 'makerFeeRate', title: 'MakerFeeRate' },
        { id: 'royalties', title: 'Royalties' },
        { id: 'platformFee', title: 'PlatformFee' },
    ]
})

const progress = (total) => {
    let itemNowNum = 0
    return () => {
        itemNowNum++
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
    txList = [{tx: '0x07acc2ac65c9b884870a116778ea345c14449fd8612b24b3fb4864cf82a2adc1', date: '2021', symbol: 'wbnb'}]
    for (let txItem of txList.slice(0, 10)) {
        const r = await web3.eth.getTransactionReceipt(txItem.tx)
        const { logs, from } = r
        if (!logs[2]) continue
        const projectAddress = logs[2].address

        const contract = new web3.eth.Contract(abi, projectAddress);
        const project = await contract.methods.name().call()


        let sellerGet
        let lootexGet

        if (logs.length > 5) {
            sellerGet = fromWei(web3.utils.hexToNumberString(logs[4].data), 'ether')
            lootexGet = fromWei(web3.utils.hexToNumberString(logs[5].data), 'ether')
        } else {
            if (logs[3].data == '0x') {
                sellerGet = fromWei(web3.utils.hexToNumberString(logs[1].data), 'ether')
            } else {
                sellerGet = fromWei(web3.utils.hexToNumberString(logs[3].data), 'ether')
            }
            lootexGet = fromWei(web3.utils.hexToNumberString(logs[4].data), 'ether')
        }

        const seller = logs[1].topics[1].replace(logs[1].topics[1].substring(2, 26), "")
        const buyer = from
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
    // writeToCsv(detailList)
    console.log(detailList)
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

// init('txList-8')


const getOneData = async () => {
    const util = require('util')
    const r = await web3.eth.getTransactionReceipt('0x622cc36cdad16dd07b7951c4ba953c7e1d22119983e1f590a256b31a9c6d5eb6')
    console.log(util.inspect(r, { showHidden: false, depth: null, colors: true }))
    console.log(r.logs.length)
}
getOneData()
