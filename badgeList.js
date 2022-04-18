const Moralis = require("moralis/node");
const util = require('util');
const Web3 = require("web3")
const LPABI = require("./ABI/LPABI.json")

const serverUrl = "https://gpbv8sxoqdyd.usemoralis.com:2053/server";
const appId = "zuqaWH2SWprKq71UJIXQ4TLS1GxsfL9s3U8Yr64S";
const masterKey = "MhHrBXFFGqKwq1Obrh56pQDxC0LOPmeuDDg8tmhA";
const plist = []
const glist = []

const ethContracts = {
  stakedLoot: "0xe366f742a0d7a679446198487550a362076833a5",
  SLP: "0xab08b85be2066165deae128d582d62e5377209b8",
  LPAddress: "0x30feee843fcae357406cefce0973a054286a4d75",
  wTokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  lootTokenAddress: "0x721a1b990699ee9d90b6327faad0a3e840ae8335",
}
const bscContracts = {
  stakedLoot: "0x750Fc63264c0d08472387DA13e39428be4a7892D",
  SLP: "0x263A00d1fFe57fd3aBC5e87E4A475e1341Cb769F",
  LPAddress: "0x155d200920a3b0cf11a97838715ab69a110c8995",
  wTokenAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  lootTokenAddress: "0x14a9a94e555fdd54c21d7f7e328e61d7ebece54b",
}

const ABI = {
  "anonymous": false,
  "inputs": [
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "duration",
      "type": "uint256"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "receiver",
      "type": "address"
    },
    {
      "indexed": true,
      "internalType": "address",
      "name": "from",
      "type": "address"
    }
  ],
  "name": "Deposited",
  "type": "event"
}

;(async function() {
  const chain = "bsc"
  const contracts = chain === "eth" ? ethContracts : bscContracts
  await Moralis.start({ serverUrl, appId, masterKey })
  await getLootList(chain, contracts)
  await getLPList(chain, contracts)
  console.log({ plist, glist})
}())

// calculate loot
const getLootList = async (chain, contracts) => {
  const { stakedLoot } = contracts
  const param = {
    chain,
    from_block: 14067452,
    topic: "0x34194be2f096bdb2ad418add902a4da76d3d6f6d387d86d857f56c7711ecca70",
    address: stakedLoot,
    abi: ABI
  }
  
  const r = await Moralis.Web3API.native.getContractEvents(param) // get event logs
  let rStrArr = [] // for checking if already push into rArr
  let rArr = []
  r.result.forEach(i => {
    const { amount, duration, receiver } = i.data
    const _a = Number(amount) / Math.pow(10,18)
    const _d = Number(duration)
    const index = rStrArr.indexOf(receiver)

    if (_d >= 31449600) { // if duration > 52 weeks
      if (index === -1) { // if not in the array
        rStrArr.push(receiver)
        rArr.push({ amount: _a, receiver })
      } else { // if someone deposits multiple times, add up the amount
          rArr[index].amount += _a
      }
    }
  })

  rArr.forEach(i => {
    const { amount, receiver } = i
    if ((amount >= 1000 || amount * 1.5 >= 1000)) { // if loot staked amount > 1000 || total staked value > $1000
      if (amount >= 10000 || amount * 1.5 >= 10000) {
        plist.push(receiver) // purple
      } else {
        glist.push(receiver) // gold
      }
    }
  })
}

// calculate loot:eth / loot:busd LP
const getLPList = async (chain, contracts) => {
  const { SLP, LPAddress, wTokenAddress, lootTokenAddress } = contracts
  const param = {
    chain,
    from_block: 14067452,
    topic: "0x34194be2f096bdb2ad418add902a4da76d3d6f6d387d86d857f56c7711ecca70",
    address: SLP,
    abi: ABI
  }

  const r = await Moralis.Web3API.native.getContractEvents(param)
  let rStrArr = []
  let rArr = []
  r.result.forEach(i => {
    const { amount, duration, receiver } = i.data
    const _a = Number(amount) / Math.pow(10,18)
    const _d = Number(duration)
    const index = rStrArr.indexOf(receiver)
    if (_d >= 31449600) {
      if (index === -1) {
        rStrArr.push(receiver)
        rArr.push({ amount: _a, receiver })
      } else {
          rArr[index].amount += _a
      }
    }
  })

  const web3 = new Web3(`https://speedy-nodes-nyc.moralis.io/21052818e7371cc669c4a168/${chain}/mainnet`)
  const lpContract  = new web3.eth.Contract(LPABI, LPAddress)
  const { getReserves, totalSupply, balanceOf } = lpContract.methods

  const [reserves, supply] = await Promise.all([
    getReserves().call(),
    totalSupply().call(),
  ])

  const lootTV = (await Moralis.Web3API.token.getTokenPrice({
    chain: chain,
    address: lootTokenAddress
  })).usdPrice * Number(reserves[0])

  const wTokenTV = (await Moralis.Web3API.token.getTokenPrice({
    chain: chain,
    address: wTokenAddress
  })).usdPrice * Number(reserves[1])


  const valuePerAmount = (wTokenTV + lootTV) / Number(supply)

  rArr.forEach(i => {
    const { amount, receiver } = i
    const value = amount * valuePerAmount
    if (value >= 1000) {
      if (value >= 10000) {
        plist.push(receiver)
      } else {
        glist.push(receiver)
      }
    }
  })
}