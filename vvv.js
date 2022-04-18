const { ethers } = require("ethers")

async function signWhitelist(
  chainId,
  contractAddress,
  whitelistKey,
  tokenId,
  recipient
) {
  // Domain data should match whats specified in the DOMAIN_SEPARATOR constructed in the contract
  // https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol#L33-L43
  const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/6c145e774d8640e288f94d7263558483")

  const signer = provider.getSigner()

  const domain = {
    name: "MYNFTVoucher",
    version: "1",
    chainId,
    verifyingContract: contractAddress,
  };

  // The types should match the TYPEHASH specified in the contract
  // https://github.com/msfeldstein/EIP712-whitelisting/blob/main/contracts/EIP712Whitelisting.sol#L27-L28
  const types = {
    PresaleVoucher: [
      { name: "tokenId", type: "uint256" },
      { name: "recipient", type: "address" },
    ],
  };

  const sig = await signer._signTypedData(domain, types, {
    tokenId,
    recipient,
  });

  return sig
}

signWhitelist(4, "0x746847f03d08144a8090e3c697a571e2d6faf09e", "0x64568ACE195D79423a4836e84BabE4470c2C2067", 0, "0x64568ACE195D79423a4836e84BabE4470c2C2067")