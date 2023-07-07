
# ERC1155Converter

  

The ERC1155Converter contract is a Solidity smart contract that facilitates the conversion of ERC1155 tokens into a new ERC1155 token (Wig NFT) through a token swap mechanism. It allows users to burn a specified amount of an existing ERC1155 token and mint a corresponding amount of the new ERC1155 token.

  

## Features

1. Token burning: Users can burn a specified amount of an existing ERC1155 token.

2. Token minting: Users can mint a corresponding amount of a new ERC1155 token (Wig NFT) in exchange for the burned tokens.

3. Customizable parameters: The contract allows the owner to customize various parameters, including the token addresses, proof for the token swap, quantity limit per wallet, price per token, purchase currency, and token IDs.

4. Access control: Only the contract owner has the ability to modify critical parameters.

  

## Getting Started

### Deployment

1. Deploy the ERC1155Converter contract to a supported Ethereum network (e.g., using Truffle or Remix).
2. Set the initial values for the following constructor parameters:
	 1. token: The address of the existing ERC1155 token contract.
	 2. merkleProof: To validate the token swap, you can obtain the merkle proof from the ERC1155 contract using the thirdWebSdk. 		    Utilize the function claimConditions.getClaimerProofs with the token ID and the address for which the merkle proof is required. 		Alternatively, you can also obtain the merkle proof using the merkletreejs library, as demonstrated in the 	        		    `scripts/generateMerkleRoot.js` file.
	 3. quantityLimitPerWallet: The maximum quantity of the new ERC1155 token that can be minted per wallet.
	 4. pricePerToken: The price per token for the token swap.
	 5. currency: The address of the currency used for the token swap.
	 6. hairTokenId: The token ID of the existing ERC1155 token being burned.
	 7. wigTokenId: The token ID of the new ERC1155 token (Wig NFT).
3. Update the Network Config in `hardhat.config.js` add RPC link, Account Private key (this will be owner of  ERC1155Converter Contract) and PolygonScan API Key to Verify The Contract
4. Run ``` bash npm  run  deploy_convertotContract:mumbai or yarn  deploy_convertotContract:mumbai ``` Update The Network and add respective configuration in `hardhat.config.js`
5. Lastly do a transcation on Erc1155 contract for adding the minter role for ERC1155Converter contract
	 
Deploy the contract to the desired Ethereum network.

### Usage

-   Before performing any token swaps, ensure that the ERC1155 token contract is deployed and the required tokens are available.
    
-   Only the owner of the contract has the privilege to update critical parameters. Use the provided functions to update the necessary values as needed.
    
-   Users can execute the `swapTokens` function to initiate the token swap process. This function will burn the required amount of the existing ERC1155 token and mint the corresponding amount of the new ERC1155 token (Wig NFT).

-	Claiming Perple Ferns Tokens are whitelisted and can be claimed only by ConvertorContract for this we need to generate Merkrle Root and Merkle Proof and update the claimConditions in ERC1155 contract and store the merkleproof in convertorContract
	
	- After Generating Merkle Root with necessary parameters , call setClaimConditions function on erc1155 Contract
	with parameters tokenId, claimConditions and resetEligibility flag
		
		-	claimConditions is tuple with paramters
			
			- startTimestamp (The unix timestamp after which the claim condition applies. The same claim condition applies until the `startTimestamp` of the next claim condition.)
			- maxClaimableSupply (he maximum total number of tokens that can be claimed under the claim condition.)
			- supplyClaimed ( At any given point, the number of tokens that have been claimed under the claim condition.)
			- quantityLimitPerWallet ( The maximum number of tokens that can be claimed by a wallet. )
			- merkleRoot ( The allowlist of addresses that can claim tokens under the claim condition.)
			- pricePerToken ( The price required to pay per token claimed. )
			- currency ( The currency in which the `pricePerToken` must be paid. )
			- metadata ( Claim condition metadata. )
	- Generate Merkle Proof for Given Merkle Root and update that in the ConvertorContract with the help of function updateMerkleProof
	
	- For generating Merkle Root and to get Merkle proof scripts can be found under scripts/generateMerkleRoot.js and scripts/getMerkleProof.js respectively
