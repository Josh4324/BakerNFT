// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BakerNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;
    /**
     * @dev _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`.
     */
    string _baseTokenURI;

    address payable _owner;

    // _paused is used to pause the contract in case of an emergency
    bool public _paused;

    struct MarketItem {
        address owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) MarketItems;

    modifier onlyWhenNotPaused() {
        require(!_paused, "Contract currently paused");
        _;
    }

    /**
     * @dev ERC721 constructor takes in a `name` and a `symbol` to the token collection.
     * name in our case is `Baker NFTs` and symbol is `BNFT`.
     * Constructor for Baker NFT takes in the baseURI to set _baseTokenURI for the collection.
     */
    constructor(string memory baseURI) ERC721("Baker NFT", "BNFT") {
        _owner = payable(msg.sender);
        _baseTokenURI = baseURI;
    }

    function buyNFT(uint256 tokenId) public payable {
        require(
            msg.value >= MarketItems[tokenId].price,
            "Price must be equal to listing price"
        );
        _transfer(MarketItems[tokenId].owner, msg.sender, tokenId);
        MarketItems[tokenId].sold = true;
        MarketItems[tokenId].owner = msg.sender;
    }

    /**
     * @dev _baseURI overides the Openzeppelin's ERC721 implementation which by default
     * returned an empty string for the baseURI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev setPaused makes the contract paused or unpaused
     */
    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }

    /**
     * @dev create NFTs
     */
    function createNFT(uint256 price) public onlyOwner returns (uint256) {
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();
        _mint(msg.sender, newTokenId);
        MarketItem memory item = MarketItem(msg.sender, price, false);
        MarketItems[newTokenId] = item;
        return newTokenId;
    }

    function getMarket(uint256 tokenId)
        public
        view
        returns (MarketItem memory)
    {
        return MarketItems[tokenId];
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = tokenIds.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            uint256 currentId = i + 1;
            MarketItem storage currentItem = MarketItems[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (MarketItems[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (MarketItems[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = MarketItems[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /**
     * @dev withdraw sends all the ether in the contract
     * to the owner of the contract
     */
    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
