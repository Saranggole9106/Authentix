// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SoulboundSkillToken
 * @dev Non-transferable NFT (Soulbound Token) for skill verification badges
 */
contract SoulboundSkillToken is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    // Mapping from token ID to skill information
    mapping(uint256 => SkillBadge) public skillBadges;
    
    // Mapping from user address to their token IDs
    mapping(address => uint256[]) public userTokens;
    
    // Mapping to track authorized badge issuers
    mapping(address => bool) public authorizedIssuers;
    
    struct SkillBadge {
        string skillName;
        string level;
        uint256 score;
        uint256 issuedAt;
        address issuer;
        string assessmentType;
    }
    
    event BadgeIssued(
        address indexed recipient,
        uint256 indexed tokenId,
        string skillName,
        string level,
        uint256 score
    );
    
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender] || msg.sender == owner(), "Not authorized to issue badges");
        _;
    }
    
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        // Owner is automatically an authorized issuer
        authorizedIssuers[msg.sender] = true;
    }
    
    /**
     * @dev Issue a new skill badge (Soulbound Token)
     */
    function issueBadge(
        address recipient,
        string memory skillName,
        string memory level,
        uint256 score,
        string memory badgeTokenURI,
        string memory assessmentType
    ) public onlyAuthorizedIssuer returns (uint256) {
        require(recipient != address(0), "Cannot issue to zero address");
        require(bytes(skillName).length > 0, "Skill name cannot be empty");
        require(score <= 100, "Score cannot exceed 100");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, badgeTokenURI);
        
        // Store skill badge information
        skillBadges[tokenId] = SkillBadge({
            skillName: skillName,
            level: level,
            score: score,
            issuedAt: block.timestamp,
            issuer: msg.sender,
            assessmentType: assessmentType
        });
        
        // Add to user's token list
        userTokens[recipient].push(tokenId);
        
        emit BadgeIssued(recipient, tokenId, skillName, level, score);
        
        return tokenId;
    }
    
    /**
     * @dev Get all token IDs owned by a user
     */
    function getUserTokens(address user) public view returns (uint256[] memory) {
        return userTokens[user];
    }
    
    /**
     * @dev Get skill badge information
     */
    function getSkillBadge(uint256 tokenId) public view returns (SkillBadge memory) {
        require(_exists(tokenId), "Token does not exist");
        return skillBadges[tokenId];
    }
    
    /**
     * @dev Authorize an address to issue badges
     */
    function authorizeIssuer(address issuer) public onlyOwner {
        require(issuer != address(0), "Cannot authorize zero address");
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }
    
    /**
     * @dev Revoke badge issuing authorization
     */
    function revokeIssuer(address issuer) public onlyOwner {
        authorizedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }
    
    /**
     * @dev Check if an address is authorized to issue badges
     */
    function isAuthorizedIssuer(address issuer) public view returns (bool) {
        return authorizedIssuers[issuer] || issuer == owner();
    }
    
    /**
     * @dev Get total number of badges issued
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Override transfer functions to make tokens non-transferable (Soulbound)
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0), "Soulbound tokens cannot be transferred");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function approve(address to, uint256 tokenId) public pure override(ERC721, IERC721) {
        revert("Soulbound tokens cannot be approved for transfer");
    }
    
    function setApprovalForAll(address operator, bool approved) public pure override(ERC721, IERC721) {
        revert("Soulbound tokens cannot be approved for transfer");
    }
    
    function transferFrom(address from, address to, uint256 tokenId) public pure override(ERC721, IERC721) {
        revert("Soulbound tokens cannot be transferred");
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId) public pure override(ERC721, IERC721) {
        revert("Soulbound tokens cannot be transferred");
    }
    
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public pure override(ERC721, IERC721) {
        revert("Soulbound tokens cannot be transferred");
    }
    
    // Required overrides
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
