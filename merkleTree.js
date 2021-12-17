const keccak256 = require('keccak256')

// const { MerkleTree } = require('merkletreejs')
// const leaves = [1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(x => keccak256(x).toString('hex'))
// const tree = new MerkleTree(leaves, keccak256)
// const root = tree.getRoot().toString('hex')
// const leaf = keccak256('10')
// const proof = tree.getProof(leaf).map(p => p.data.toString('hex'))
// console.log(tree.toString())

const whitelist = ["0xe5d4BbF2AfDe1405B675F32C045fA56354066Fab", "0x64568ACE195D79423a4836e84BabE4470c2C2067", "0xE862eE43CcC0ea717D3c55E509f4A2a1D7EFe8AD", "0x819F4FC584cBE84Edf5D138228BEC0616EAd7061", "0x018E1Cb1E7d9e206824635bE8383A1EF1B173983", "0x68856eb7b16abEbCcb7eD2Ad7eA40D76bAdbC0C6", "0x866e9c4c941f8f2A6e3e8A6aB0749E49E4034155", "0xF0913770d8a47C341c1E1f3cD17A7815D7785419", "0x109207B29E2261D4f51A7Be1CbB3600357DB9A37", "0x56C424306F436D8499a39Ff78C11D7A5e9cf5AFf", "0x64e19839639c35A62E102169623cBE3Ec7C88fcf", "0xC6E966f332251389533F292d99e26b7536E88BD6", "0xc7c94ADFD6FaA88AB69f8410B64BEf89d549D827", "0x26Ea0b1d8a0258265Ca5e838cb8a161E5d709031", "0x0e46fAe7e9c196dd5ec0017071690827253a6816", "0x8A7bb1eee9D64BC0269a84ca7a1a8267EC8579Ec", "0x21f77C3610f46Cf0dd772B10B87aCf0126b76708", "0x2eBcee46B17Fc31eDAcc7678D4c37001f0fF0344", "0xb0D041C0a4488667B32ceC7F26e8Fb2bFC83D0D3", "0x7b150b4824fFD29702830DF58F4d6F84C72CF775", "0x8C7F2e74816763C4B9DDAba6f3F7aaBcB091577A", "0x337d0077dB2b3eB449E72B839e1FF8514f3B1157", "0xa4b1b35ff4A7d60eb998981336d4649A7B0C86c1", "0xed4b344738036787d8bA415B0b22e6Ae3d060099", "0x0c9D41f431353c5e34E7Ce0eA9b926414F41AaC0", "0x27350043734CcA0b6C5d25514a8A515e471C9C35", "0xA7ba6b65fFF75290530eD423a4eB85d96C39E0df", "0x3c7CCe6BC49658bF1faaEDBeE705844876F01734", "0x5801CF6b4807338A969586062D72852D823E05c1", "0x7EaE91a0c315304FAB6d7d693DFdE1C4116b345F", "0xE4Af133532F748C60D589973cf25068419e42D8D", "0x7ac4a479D8c5d065247E773BFA75151735D62daA", "0x982Be015fD58C3AE3f502086921b0A6859FD0a35", "0x8b947619D01790E7b2Bf0fDb6DDe31a58C216cb2", "0xc3c2D28eE3B236710bDc83DAeA72bCC57ee151f1"]


const plantTree = (whitelist) => {
  const leaves = whitelist.map(x => keccak256(x).toString('hex'))
  const tree = [leaves]
  let layers = 0

  while (leaves.length > Math.pow(2, layers)) {
    let tempArr = []
    const layer = tree[layers]
  
    for (let i=0; i<layer.length; i++) {
      const _num = Math.floor(i / 2)
      if (!tempArr[_num]) {
        tempArr.push(layer[i])
      } else {
        if (tempArr[_num] <= layer[i]){
          tempArr[_num] = keccak256("0x" + tempArr[_num] + layer[i]).toString('hex')
        } else {
          tempArr[_num] = keccak256("0x" + layer[i] + tempArr[_num]).toString('hex')
        }
      }
    }
    tree.push(tempArr)
    layers++
  }
  return tree
}

const getProof = (whitelist, tree, leaf) => {
  let index = whitelist.indexOf(leaf)
  const proofs = []
  for (let node of tree) {
    if (node.length === 1) continue

    let proof
    if (index % 2 === 0){
      proof = node[index +1]
    } else {
      proof = node[index - 1]
    }

    if (proof) {
      proofs.push('0x' + proof)
    }
    index = Math.floor(index / 2)
  }
  return proofs
}

const getRoot = (tree) => '0x' + tree[tree.length -1][0]

const init = () => {
  const tree = plantTree(whitelist)
  const proof = getProof(whitelist, tree, "0x64568ACE195D79423a4836e84BabE4470c2C2067")
  const root = getRoot(tree)
  console.log(proof)
}

init()
