const Moralis = require("moralis/node");
const util = require('util');
const Web3 = require("web3")
const LPABI = require("./ABI/LPABI.json")

const serverUrl = "https://gpbv8sxoqdyd.usemoralis.com:2053/server";
const appId = "zuqaWH2SWprKq71UJIXQ4TLS1GxsfL9s3U8Yr64S";
const masterKey = "MhHrBXFFGqKwq1Obrh56pQDxC0LOPmeuDDg8tmhA";
const slist = []
const alreadyArr = [
  '0x55e1e020ca8f589b691dbc3e9cbce8845a400f97',
  '0x46eea8d5b37d2db51f35c1bc8c50cbf80fb0ffe5',
  '0x4a3def90ca5e8e6c53ec4889329bcf5714779f61',
  '0x66607bab7fda25696be1db6b326f6b5496071bff',
  '0xc32049468265aca324b56e6c1fd867dc6ad773c0',
  '0xa2879b11d45e53e6c0a9a3738674a1fd6bbad5c7',
  '0x73b0ada6fc72521316e97306f059852f808fcf5a',
  '0xb2cb81dcc0dcee37d2e435abaecb72d00608d6ab',
  '0xe8d96f03d32e67785d7ff20dfffb2069ff06bfb4',
  '0xdc2f48f5b303d7412aa5ab8e02a178534b560a18',
  '0x4f20cb7a1d567a54350a18dacb0cc803aebb4483',
  '0xaa4237995a8ddb6fc30c3c5bc4cb9c0c15ee7c4f',
  '0xc9525b100ea2b1e7e39d0bee3d4fa9386ca8469c',
  '0x3cafc22a10e6f5bac0c66d6242107a1be1495737',
  '0x07ef776d8ea8db7cfb11f8636aade26cec567304',
  '0x2c820c909b9f6fe6a62327615f0d0cb58c709baa',
  '0xf8a367e0f5d3fad40039f10b39ed28e8f9fa625e',
  '0x1b07cf63cc6dab7a996af41c1d9b8166f05995f1',
  '0x163ca0652609ea34b2daf93f6c6f64c5472c8f20',
  '0x0dc874fb5260bd8749e6e98fd95d161b7605774d',
  '0x19c00bbb5e494195c68937cda517a6ffd00685f5',
  '0x84fabd111c71a5a0b20e5864ffcb213c7429e556',
  '0x5f2f7a32021a7e1970c656c9084b5554de8e34e8',
  '0x53f470a909d7ce7f35e62f4470fd440b1ed5d8cd',
  '0x8052a415caf33d83c7567c72f2c1c9c181c1ea15',
  '0x6ae4d03d35d98330bfc315952624c5a756cd7939',
  '0x51963088c3bec10fabe76b72c8242c4e4b055f58',
  '0x999999999999a1043b030f09e500ff4cd4d8d9dd',
  '0xf7f01038e861f6f078992279be386aa936660d67',
  '0x9d9588c082634fd4c7f54cb0243d6792cfd7b4c4',
  '0xb2cb81dcc0dcee37d2e435abaecb72d00608d6ab',
  '0x4f8baffdbad98b57abb953c28ba0a38d195976b9',
  '0xe1a83c678e6ca74f779de0507408ce368a026ee9',
  '0x9ad9967a74a6270ea1203c81dc7438914b72ee61',
  '0xc200dad1034dabcfc9cb131435a10ffb9fb56720',
  '0xae8657c142711e59bad5413dabc44cfa404dddcc',
  '0x11eb6e36b22fbc98555e7ea4c6def23d5fdd83fc',
  '0x3353a924d3256567ead1d27d0f53a640a552421d',
  '0x077612f7a2791845f2dfe97255acd29a7d383596',
  '0xee42c415e140255d076c512d29a858740851cb3e',
  '0xdee2cd63da94dc04fc7136816a0b196deddbfaba',
  '0x8d7199a491666d543fb4335f08be149e70598054',
  '0x2c35a970a19b943bed591d55204034d8672de7ac',
  '0x37ecc09828ff4d70b43845b617d8a12adfaa29b3',
  '0x0cd2e51fa20053ec3ee8a7557689ae23dab9a6c3',
  '0x07d6256d5cfe583541f573451975526b998f107e',
  '0x17ff6d06be2a511a57d119c189fe4391f84a742c',
  '0x254e937b99afe27f9bac697d7e65fa7529495027',
  '0x6dd623f8b56dc03d18e14cca5be2b7ef80ff4b4e',
  '0x79f3f57718e7b0142d7ad2596b6114892c3bee95',
  '0xba97c17f12978986d304acb2040498d655cca222',
  '0x96174cc42a847c3c800544f7418af99833bc9f41',
  '0x3a0b30087cf3e577abc4915dd2be04a633e88ec8',
  '0x01a2bcbf4ac095e95ebf1fde37db1fc134f20a89',
  '0x9693e7bb2f530c7468a61412c46847e507ee0354',
  '0x3ec72e79a87925309a4cda9eaa224a3b887f06ae',
  '0x227685fe92a133f55ccc47c433f5d8209c3c3020',
  '0xccb253bf2fb43f020ac6eba0555bc27122fe5452',
  '0xfc1f9686a06f8613463ee366da1fe681cedae05f',
  '0x118fe9d1dc8efa98f3bf41618d9a3d7f049a61b1',
  '0xb7863a303db6057743747e8a12b7fc5d53389406',
  '0x0004a60d1495e9212f388fb8103ae2b2bd7d4638',
  '0xf6329aba0d249a7252abc6bd2a3ed75d4a9ef482',
  '0xc54c84e0f65e1c3b540ef85af988ab2b4a7ca742',
  '0xfac59b27182309f5d501fde1fecb54bd047c4acb',
  '0xc97acf688cfe0a4d3bf23e9f772af83698216470',
  '0xb77d29733f52752b398e9de4632567ddbea0de8f',
  '0xda664e32af82d1f96933acecdacb9395977eed64',
  '0xc0f811e78c1e35be3a9045963c887af07ea29dd6',
  '0x3d7d8cc79c6170c2faf1be24b9a641238108d440',
  '0xbf7ad99ec478b5224cf8bccfc0ddd1b654afb8c8',
  '0x783c602761e7e5c4e7119e9a60d0c75cbbcd5e5b',
  '0x4a22ea1c53e4e340a8d11a50f51dd7704caf6633',
  '0x415aae29c70f7a67ca01ba80909a4fcc8f3dfd7e',
  '0x9fc9ba827f682c19bbc9c7657a424dfe2c98ee52',
  '0xb56e2157aa2069924c66fbc3d989e465008ba760',
  '0xa969c0b845714241ad189fab464a22a4b37b89dd',
  '0x9879a6f2bd5d10a0ee6298b2e7aeb1ab34b5d30e',
  '0xef302d6d249e17d2c18d0773fb11203afb3f0961',
  '0x388cf74eecc679899c7dceeffa8e590fb8eabfae',
  '0x82901002bbd1adcd19b0202c48580aa7299ebcfb',
  '0xe1a83c678e6ca74f779de0507408ce368a026ee9',
  '0x392789df9c8f8bbb84e77787f0c06581542a05bb',
  '0x9fab764ece8663c347643c49c16d190ded7612dc',
  '0x2a344926b5c4f6a0b47212f0876beeaf10bb5888',
  '0xa502d4fb0d79180416ebbd2e3c76d20220bd91a0',
  '0x32b009179a104e75f91f931f5dfb5295bc8e28cf',
  '0x815070a584d52384a1cdbff844a38ae657e93ac8',
  '0xe11d73168bfec49e2b433b02fe739d4fdda3c9d0',
  '0xdfee40a82276d9bcfa3c346988cc1e83a664e276',
  '0x3b2cc694e68a27d1b68ef85a7fb29eeac0a4b67b',
  '0xd000019fb19f6ec6d95df13a733359d3f7f17c6f',
  '0xcf851a57ebdfd7a77efdd8800c58b92fb8831314',
  '0xa0f11db2bc5010fac366ca2ae1e685cccdaa855e',
  '0xb7863a303db6057743747e8a12b7fc5d53389406',
  '0x90d96e3f32d5b551b1419fa486cb9f9e837ced16',
  '0x047913102b3e14dd0e9fbb16a74475b707b781fd',
  '0xec12320565d7c46b385affa7b42ba15ab35d2957',
  '0x4a22ea1c53e4e340a8d11a50f51dd7704caf6633',
  '0x9fc9ba827f682c19bbc9c7657a424dfe2c98ee52',
  '0xdfee40a82276d9bcfa3c346988cc1e83a664e276',
  '0xdf4f13ca69072752827ffd528cd736d0537b9191',
  '0xe2c4fdb22f3c2138a0e57e74963589538e79872a',
  '0x91816e7ac4b709c1c4008f572a3a6fe430e784ee',
  '0x90eda0c5821cec476417f9c13e62836f96a89749',
  '0xad2844acbe8cbde5ea1eba469db6332019e95bc0',
  '0x63256332a480d4415abf6a50e5a87815c87a4af3',
  '0x9373e812b9f8ef4906c72469fd8c8722e1cbcf88',
  '0x2e49be1623fb5a03c05928148c64b5e2b1055bd2',
  '0x5d715c0bdebbc6929682babd0a7da865b165897d',
  '0x5de4bb974b8f6ef4b7ca741491453c012b9ad3e5',
  '0x87d63b96ca7695775fdde18ade27480143f9dfa0',
  '0xe4595de8880fe49ebe683741c8854c4c058e5411',
  '0x0a2827ccec771798e76732cc860ad9c58f05bf35',
  '0x5d70c9a9154f71c26412b36b538021c1178027e9',
  '0xb128d6007d5d0e9b341f2c66e9ae482304fb7fdc',
  '0x6b779ae702a4e139039151b05beb2730356047da',
  '0x764d2a35e271852d7972807128bc8ec275755e36',
  '0xc4360086c5aaa4d19d72d51aaa60f40bec71c48a',
  '0xb8815e6a78ff0ce1d15ef131d28dc0f69246e56a',
  '0xbe0a06c8880dab8c8a672cab2f1afbea33f2d428',
  '0x000002100e7c0d8bc84ca80afeb8284892e4ee61',
  '0x13bdd57818e84575db5595d54de2193fca53d616',
  '0xd533b17343d0ff44eb0e3f8b46d08f1402c6102c',
  '0xc2814998a7e83bce7cd3c0485dfd4b4b39497559',
  '0x26ea0b1d8a0258265ca5e838cb8a161e5d709031',
  '0x64568ace195d79423a4836e84babe4470c2c2067',
  '0x365e94d16816860861e6c024dece5077b92339ae',
  '0xfdd43923340736ffbcb31c808ac644922c1df05d',
  '0xb14c95d1844d5d8b00166e46338f5fc9546df9d5',
  '0x70e79ae118cabe8992c4069cf706ca79451b51e6',
  '0x4cb02d9201bfcc5ae542303fe195bd962b8e06f7',
  '0x83a2e86cb1fd721b88eb048ce1779df2957292f6',
]

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

const eventABI = {
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
  const from_block = 17247081
  await getLootList(chain, contracts, from_block)
  await getLPList(chain, contracts)
  console.log(slist.filter(i => !alreadyArr.includes(i)))
}())

// calculate loot
const getLootList = async (chain, contracts, from_block) => {
  const { stakedLoot } = contracts
  const param = {
    chain,
    from_block,
    // to_block: 17229735,
    topic: "0x34194be2f096bdb2ad418add902a4da76d3d6f6d387d86d857f56c7711ecca70",
    address: stakedLoot,
    abi: eventABI
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
    if ((amount >= 1000)) { // if loot staked amount > 1000 
      slist.push(receiver)
    }
  })
}

/* calculate loot:eth / loot:busd LP
 * LP的usd價值 = lootEthLP.getReserves() / lootEthLP.totalSupply() * account.stakedAmount
 * 從Deposited Event拿到LP的staked amount之後， 去算這個LP池的總價值（getReserves），
 * 然後除以總發行量（totalSupply），去拿到 valuePerAmount，再乘上該 account 的 stakedAmount 即可
 * 
 * 補充：getReserves[0]會是池裡LOOT的量，getReserves[1]會是ETH || BUSD（看哪條鏈），
 * 所以 LP 池的總價值 = getReserves[0] * LootPrice + getReserves[1] * EthPrice
*/

const getLPList = async (chain, contracts, from_block) => {
  const { SLP, LPAddress, wTokenAddress, lootTokenAddress } = contracts

  const param = {
    chain,
    from_block,
    topic: "0x34194be2f096bdb2ad418add902a4da76d3d6f6d387d86d857f56c7711ecca70",
    address: SLP,
    abi: eventABI
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
      slist.push(receiver)
    }
  })
}
