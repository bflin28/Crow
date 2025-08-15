// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SimpleEscrow {
    address public buyer;
    address public seller;
    uint256 public amount;
    string public productTitle;
    
    enum Status { Created, BuyerSigned, SellerSigned, Active, Completed, Cancelled }
    Status public status;
    
    bool public buyerSigned;
    bool public sellerSigned;
    
    uint256 public createdAt;
    
    event EscrowCreated(address indexed buyer, address indexed seller, uint256 amount);
    event EscrowSigned(address indexed signer, string role);
    event EscrowActivated(uint256 amount);
    
    constructor(
        address _buyer,
        address _seller, 
        uint256 _amount,
        string memory _productTitle
    ) {
        buyer = _buyer;
        seller = _seller;
        amount = _amount;
        productTitle = _productTitle;
        status = Status.Created;
        createdAt = block.timestamp;
        
        emit EscrowCreated(_buyer, _seller, _amount);
    }
    
    function buyerSign() public {
        require(msg.sender == buyer, "Only buyer can sign");
        require(!buyerSigned, "Buyer already signed");
        
        buyerSigned = true;
        status = Status.BuyerSigned;
        
        if (sellerSigned) {
            status = Status.Active;
            emit EscrowActivated(amount);
        }
        
        emit EscrowSigned(msg.sender, "buyer");
    }
    
    function sellerSign() public {
        require(msg.sender == seller, "Only seller can sign");
        require(!sellerSigned, "Seller already signed");
        
        sellerSigned = true;
        status = Status.SellerSigned;
        
        if (buyerSigned) {
            status = Status.Active;
            emit EscrowActivated(amount);
        }
        
        emit EscrowSigned(msg.sender, "seller");
    }
    
    function getDetails() public view returns (
        address _buyer,
        address _seller,
        uint256 _amount,
        string memory _productTitle,
        Status _status,
        bool _buyerSigned,
        bool _sellerSigned,
        uint256 _createdAt
    ) {
        return (buyer, seller, amount, productTitle, status, buyerSigned, sellerSigned, createdAt);
    }
}
