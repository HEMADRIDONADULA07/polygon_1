// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "erc721a/contracts/ERC721A.sol";
contract hemadri is ERC721A{
    address public owner;
    uint256 public maximum = 5;
    string url = "https://gateway.pinata.cloud/ipfs/QmXzZnvJAuzSiEUi95eP5LwUzuQjhL4vS8MniSMZYp2YoJ/";
    string public prompt =
        "hello, this is hemadri";//prompt message

    constructor() ERC721A("hemadri", "MVSO") {
        owner = msg.sender;
    }
    // Modifier 
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action!");
        _;
    }

    // Function to mint NFTs
    function mint(uint256 quantity) external payable onlyOwner{
        require(totalSupply() + quantity <= maximum ,"minting more than 5 nfts is not allowed");
        _mint(msg.sender, quantity);
    }

    function _baseURI() internal view override returns (string memory){
        return url;
    }
//function for displaying prompt message
    function promptmessage() external view returns (string memory) {
        return prompt;
    }
}