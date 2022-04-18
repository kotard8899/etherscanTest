const ethers = require("ethers");
const Web3 = require("web3")


// These constants must match the ones used in the smart contract.
const SIGNING_DOMAIN_NAME = "FNFT-Voucher";
const SIGNING_DOMAIN_VERSION = "1";

/**
 * JSDoc typedefs.
 *
 * @typedef {object} PresaleVoucher
 * @property {ethers.BigNumber | number} tokenId the id of the un-minted NFT
 * @property {ethers.Signer.getAddress()} recipient the recipient address to redeem this NFT
 * @property {ethers.BytesLike} signature an EIP-712 signature of all fields in the NFTVoucher, apart from signature itself
 */

/**
 * LazyMinter is a helper class that creates NFTVoucher objects and signs them, to be redeemed later by the FashionNFT contract.
 */
class LazyMinter {
  /**
   * Create a new LazyMinter targeting a deployed instance of the FashionNFT contract.
   *
   * @param {Object} options
   * @param {ethers.Contract} contract an ethers Contract that's wired up to the deployed contract
   * @param {ethers.Signer} signer a Signer whose account is authorized to mint NFTs on the deployed contract
   */
  constructor({ contract, signer }) {
    this.contract = contract;
    this.signer = signer;
  }

  /**
   * Creates a new NFTVoucher object and signs it using this LazyMinter's signing key.
   *
   * @param {ethers.BigNumber | number} tokenId the id of the un-minted NFT
   * @param {ethers.Signer.getAddress()} recipient the account to redeem this NFT
   *
   * @returns {PresaleVoucher}
   */
  async createVoucher(tokenId, recipient) {
    const voucher = { tokenId, recipient };
    const domain = await this._signingDomain();
    const types = {
      PresaleVoucher: [
        { name: "tokenId", type: "uint256" },
        { name: "recipient", type: "address" },
      ],
    };
    const signature = await this.signer._signTypedData(domain, types, voucher);
    return {
      ...voucher,
      signature,
    };
  }

  /**
   * @private
   * @returns {object} the EIP-721 signing domain, tied to the chainId of the signer
   */
  async _signingDomain() {
    if (this._domain != null) {
      return this._domain;
    }
    const chainId = await this.contract.getChainID();
    this._domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contract.address,
      chainId,
    };
    return this._domain;
  }
}


module.exports = {
  LazyMinter,
};
