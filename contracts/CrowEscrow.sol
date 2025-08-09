// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CrowEscrow
 * @dev Smart contract for secure escrow transactions with buyer/seller signatures
 */
contract CrowEscrow {
    
    enum EscrowState { 
        Created,           // Escrow created, waiting for signatures
        BuyerSigned,       // Buyer has signed
        SellerSigned,      // Seller has signed  
        Active,            // Both parties signed, funds deposited
        InAuthentication,  // Item being authenticated
        InTransit,         // Item shipped to buyer
        Completed,         // Transaction completed
        Disputed,          // Dispute raised
        Cancelled          // Escrow cancelled
    }
    
    struct Escrow {
        address buyer;
        address seller;
        address authenticator;
        uint256 amount;
        string productTitle;
        string productDescription;
        string deliveryAddress;
        uint256 estimatedDeliveryDays;
        EscrowState state;
        bool buyerSigned;
        bool sellerSigned;
        bool fundsDeposited;
        uint256 createdAt;
        uint256 completedAt;
        string ipfsHash; // For storing additional metadata
    }
    
    // State variables
    mapping(uint256 => Escrow) public escrows;
    mapping(address => uint256[]) public userEscrows;
    uint256 public escrowCount;
    address public owner;
    address public authenticatorAddress;
    uint256 public authenticationFee = 0.01 ether; // 0.01 ETH authentication fee
    
    // Events
    event EscrowCreated(uint256 indexed escrowId, address indexed buyer, address indexed seller, uint256 amount);
    event BuyerSigned(uint256 indexed escrowId, address indexed buyer);
    event SellerSigned(uint256 indexed escrowId, address indexed seller);
    event EscrowActivated(uint256 indexed escrowId, uint256 amount);
    event FundsDeposited(uint256 indexed escrowId, uint256 amount);
    event EscrowCompleted(uint256 indexed escrowId, address indexed buyer, address indexed seller);
    event EscrowCancelled(uint256 indexed escrowId, string reason);
    event DisputeRaised(uint256 indexed escrowId, address indexed raiser);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyParties(uint256 _escrowId) {
        require(
            msg.sender == escrows[_escrowId].buyer || 
            msg.sender == escrows[_escrowId].seller,
            "Only buyer or seller can call this function"
        );
        _;
    }
    
    modifier onlyAuthenticator() {
        require(msg.sender == authenticatorAddress, "Only authenticator can call this function");
        _;
    }
    
    modifier escrowExists(uint256 _escrowId) {
        require(_escrowId < escrowCount && _escrowId >= 0, "Escrow does not exist");
        _;
    }
    
    constructor(address _authenticator) {
        owner = msg.sender;
        authenticatorAddress = _authenticator;
        escrowCount = 0;
    }
    
    /**
     * @dev Create a new escrow request
     * @param _buyer Address of the buyer
     * @param _seller Address of the seller
     * @param _amount Amount in wei for the transaction
     * @param _productTitle Title of the product
     * @param _productDescription Description of the product
     * @param _deliveryAddress Delivery address for the product
     * @param _estimatedDeliveryDays Estimated delivery time in days
     * @param _ipfsHash IPFS hash for additional metadata
     */
    function createEscrow(
        address _buyer,
        address _seller,
        uint256 _amount,
        string memory _productTitle,
        string memory _productDescription,
        string memory _deliveryAddress,
        uint256 _estimatedDeliveryDays,
        string memory _ipfsHash
    ) external returns (uint256) {
        require(_buyer != _seller, "Buyer and seller cannot be the same");
        require(_buyer != address(0) && _seller != address(0), "Invalid addresses");
        require(_amount > 0, "Amount must be greater than 0");
        require(bytes(_productTitle).length > 0, "Product title required");
        
        uint256 escrowId = escrowCount;
        
        escrows[escrowId] = Escrow({
            buyer: _buyer,
            seller: _seller,
            authenticator: authenticatorAddress,
            amount: _amount,
            productTitle: _productTitle,
            productDescription: _productDescription,
            deliveryAddress: _deliveryAddress,
            estimatedDeliveryDays: _estimatedDeliveryDays,
            state: EscrowState.Created,
            buyerSigned: false,
            sellerSigned: false,
            fundsDeposited: false,
            createdAt: block.timestamp,
            completedAt: 0,
            ipfsHash: _ipfsHash
        });
        
        // Add to user's escrow list
        userEscrows[_buyer].push(escrowId);
        userEscrows[_seller].push(escrowId);
        
        escrowCount++;
        
        emit EscrowCreated(escrowId, _buyer, _seller, _amount);
        
        return escrowId;
    }
    
    /**
     * @dev Buyer signs the escrow agreement
     * @param _escrowId ID of the escrow to sign
     */
    function buyerSign(uint256 _escrowId) 
        external 
        escrowExists(_escrowId) 
    {
        Escrow storage escrow = escrows[_escrowId];
        require(msg.sender == escrow.buyer, "Only buyer can sign as buyer");
        require(!escrow.buyerSigned, "Buyer already signed");
        require(escrow.state == EscrowState.Created || escrow.state == EscrowState.SellerSigned, "Invalid state for signing");
        
        escrow.buyerSigned = true;
        
        if (escrow.sellerSigned) {
            escrow.state = EscrowState.Active;
            emit EscrowActivated(_escrowId, escrow.amount);
        } else {
            escrow.state = EscrowState.BuyerSigned;
        }
        
        emit BuyerSigned(_escrowId, msg.sender);
    }
    
    /**
     * @dev Seller signs the escrow agreement
     * @param _escrowId ID of the escrow to sign
     */
    function sellerSign(uint256 _escrowId) 
        external 
        escrowExists(_escrowId) 
    {
        Escrow storage escrow = escrows[_escrowId];
        require(msg.sender == escrow.seller, "Only seller can sign as seller");
        require(!escrow.sellerSigned, "Seller already signed");
        require(escrow.state == EscrowState.Created || escrow.state == EscrowState.BuyerSigned, "Invalid state for signing");
        
        escrow.sellerSigned = true;
        
        if (escrow.buyerSigned) {
            escrow.state = EscrowState.Active;
            emit EscrowActivated(_escrowId, escrow.amount);
        } else {
            escrow.state = EscrowState.SellerSigned;
        }
        
        emit SellerSigned(_escrowId, msg.sender);
    }
    
    /**
     * @dev Deposit funds into the escrow (only after both parties have signed)
     * @param _escrowId ID of the escrow
     */
    function depositFunds(uint256 _escrowId) 
        external 
        payable 
        escrowExists(_escrowId) 
    {
        Escrow storage escrow = escrows[_escrowId];
        require(msg.sender == escrow.buyer, "Only buyer can deposit funds");
        require(escrow.state == EscrowState.Active, "Escrow must be active to deposit funds");
        require(!escrow.fundsDeposited, "Funds already deposited");
        require(msg.value == escrow.amount + authenticationFee, "Incorrect amount sent");
        
        escrow.fundsDeposited = true;
        
        emit FundsDeposited(_escrowId, msg.value);
    }
    
    /**
     * @dev Cancel escrow (only if not yet active or funded)
     * @param _escrowId ID of the escrow to cancel
     * @param _reason Reason for cancellation
     */
    function cancelEscrow(uint256 _escrowId, string memory _reason) 
        external 
        onlyParties(_escrowId) 
        escrowExists(_escrowId) 
    {
        Escrow storage escrow = escrows[_escrowId];
        require(
            escrow.state == EscrowState.Created || 
            escrow.state == EscrowState.BuyerSigned || 
            escrow.state == EscrowState.SellerSigned,
            "Cannot cancel active or funded escrow"
        );
        
        escrow.state = EscrowState.Cancelled;
        
        emit EscrowCancelled(_escrowId, _reason);
    }
    
    /**
     * @dev Get escrow details
     * @param _escrowId ID of the escrow
     */
    function getEscrow(uint256 _escrowId) 
        external 
        view 
        escrowExists(_escrowId) 
        returns (
            address buyer,
            address seller,
            uint256 amount,
            string memory productTitle,
            string memory productDescription,
            EscrowState state,
            bool buyerSigned,
            bool sellerSigned,
            bool fundsDeposited,
            uint256 createdAt
        ) 
    {
        Escrow storage escrow = escrows[_escrowId];
        return (
            escrow.buyer,
            escrow.seller,
            escrow.amount,
            escrow.productTitle,
            escrow.productDescription,
            escrow.state,
            escrow.buyerSigned,
            escrow.sellerSigned,
            escrow.fundsDeposited,
            escrow.createdAt
        );
    }
    
    /**
     * @dev Get user's escrow IDs
     * @param _user Address of the user
     */
    function getUserEscrows(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userEscrows[_user];
    }
    
    /**
     * @dev Get total number of escrows
     */
    function getTotalEscrows() external view returns (uint256) {
        return escrowCount;
    }
    
    // Additional functions for authentication, shipping, completion will be added in future versions
}
