const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const axios = require('axios')
const csvWriter = createCsvWriter({
    path: 'teng.csv',
    header: [
        {id: 'id', title: 'id'},
        {id: 'address', title: 'address'},
        {id: 'name', title: 'name'},
        {id: 'description', title: 'description'},
        {id: 'imageUrl', title: 'imageUrl'},
        {id: 'iconUrl', title: 'iconUrl'},
        {id: 'externalUrl', title: 'externalUrl'},
        {id: 'symbol', title: 'symbol'},
        {id: 'schemaName', title: 'schemaName'},
        {id: 'totalSupply', title: 'totalSupply'},
        {id: 'createdDate', title: 'createdDate'},
        {id: 'slug', title: 'slug'},
        {id: 'allowedCurrency', title: 'allowedCurrency'},
        {id: 'blockchainId', title: 'blockchainId'},
        {id: 'chainId', title: 'chainId'},
        {id: 'updatedAt', title: 'updatedAt'},
        {id: 'relatedStores', title: 'relatedStores'},
        {id: 'datoId', title: 'datoId'},
        {id: 'makerFeeRate', title: 'makerFeeRate'},
    ]
});

// axios.get('https://api.dex.lootex.io/v2/contracts').then(data => {
//     const item = data.data.items.map(i => {
//         const {datoId,makerFeeRate} = i.meta
//         delete i.meta
//         return {
//             ...i,
//             datoId,
//             makerFeeRate
//         }
//     })
//     csvWriter
//         .writeRecords(item)
//         .then(()=> console.log('The CSV file was written successfully'));
// })



const csv = require('csv-parser');
const fs = require('fs');

let list = []
fs.createReadStream('sss.csv')
    .pipe(csv())
    .on('data', (row) => {
        list.push(row)
    })
    .on('end', () => {
    console.log(list)
    });
