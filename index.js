const api = require('etherscan-api').init('71AIZK69W95XYYSZKM5AQYQXMZMA2839RB');
const balance = api.account.balance('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae');
const block = api.proxy.eth_blockNumber();
block.then(({ result }) => {
    const blockNum = parseInt(result, 16)
    const txs = [];
    for(let i = 0; i < blockNum; i++) {
        const blockByNum = api.proxy.eth_getBlockByNumber(result);
        blockByNum.then(({ result }) => {
            for(let j = 0; j < result.transactions.length; j++) {
                if( result.transactions[j].to == 0x64568ACE195D79423a4836e84BabE4470c2C2067 )
                    txs.push(block.transactions[j]);
            }
            console.log(txs)
        })
    }
});