const keccak256 = require('keccak256')
const whitelist = require('./whitelist_2')

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
  console.log(root)
}

init()
