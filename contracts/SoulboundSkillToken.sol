// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SoulboundSkillToken
 * @dev Non-transferable NFT tokens representing verified skills
 */
contract SoulboundSkillToken is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Skill metadata structure
    struct SkillBadge {
        string skillName;
        string skillLevel; // Beginner, Intermediate, Advanced, Expert
        uint256 issueDate;
        uint256 expiryDate; // 0 for non-expiring badges
        address issuer;
        string certificateHash; // IPFS hash for certificate
        bool isActive;
    }
    
    // Mapping from token ID to skill badge data
    mapping(uint256 => SkillBadge) public skillBadges;
    
    // Mapping from user address to their skill badges
    mapping(address => uint256[]) public userBadges;
    
    // Mapping to check if user has specific skill
    mapping(address => mapping(string => bool)) public hasSkill;
    
    // Authorized issuers (backend services, AI assessors)
    mapping(address => bool) public authorizedIssuers;
    
    // Events
    event SkillBadgeIssued(
        address indexed recipient,
        uint256 indexed tokenId,
        string skillName,
        string skillLevel,
        uint256 issueDate
    );
    
    event SkillBadgeRevoked(
        address indexed holder,
        uint256 indexed tokenId,
        string reason
    );
    
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    
    constructor() ERC721("DeSkill Soulbound Token", "DSBT") {}
    
    /**
     * @dev Modifier to check if caller is authorized issuer
     */
    modifier onlyAuthorizedIssuer() {
        require(
            authorizedIssuers[msg.sender] || msg.sender == owner(),
            "Not authorized to issue badges"
        );
        _;
    }
    
    /**
     * @dev Override transfer functions to make tokens non-transferable (soulbound)
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(
            from == address(0) || to == address(0),
            "Soulbound tokens cannot be transferred"
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    /**
     * @dev Issue a new skill badge to a user
     */
    function issueSkillBadge(
        address recipient,
        string memory skillName,
        string memory skillLevel,
        uint256 expiryDate,
        string memory tokenURI,
        string memory certificateHash
    ) public onlyAuthorizedIssuer returns (uint256) {
        require(recipient != address(0), "Invalid recipient address");
        require(bytes(skillName).length > 0, "Skill name cannot be empty");
        require(bytes(skillLevel).length > 0, "Skill level cannot be empty");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Mint the token
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Store skill badge data
        skillBadges[tokenId] = SkillBadge({
            skillName: skillName,
            skillLevel: skillLevel,
            issueDate: block.timestamp,
            expiryDate: expiryDate,
            issuer: msg.sender,
            certificateHash: certificateHash,
            isActive: true
        });
        
        // Update user mappings
        userBadges[recipient].push(tokenId);
        hasSkill[recipient][skillName] = true;
        
        emit SkillBadgeIssued(
            recipient,
            tokenId,
            skillName,
            skillLevel,
            block.timestamp
        );
        
        return tokenId;
    }
    
    /**
     * @dev Revoke a skill badge (mark as inactive)
     */
    function revokeSkillBadge(
        uint256 tokenId,
        string memory reason
    ) public onlyAuthorizedIssuer {
        require(_exists(tokenId), "Token does not exist");
        require(skillBadges[tokenId].isActive, "Badge already revoked");
        
        address holder = ownerOf(tokenId);
        skillBadges[tokenId].isActive = false;
        
        // Update user skill status
        hasSkill[holder][skillBadges[tokenId].skillName] = false;
        
        emit SkillBadgeRevoked(holder, tokenId, reason);
    }
    
    /**
     * @dev Get all badge IDs owned by a user
     */
    function getUserBadges(address user) public view returns (uint256[] memory) {
        return userBadges[user];
    }
    
    /**
     * @dev Get active badges for a user
     */
    function getActiveBadges(address user) public view returns (uint256[] memory) {
        uint256[] memory allBadges = userBadges[user];
        uint256 activeCount = 0;
        
        // Count active badges
        for (uint256 i = 0; i < allBadges.length; i++) {
            if (skillBadges[allBadges[i]].isActive && !isExpired(allBadges[i])) {
                activeCount++;
            }
        }
        
        // Create array of active badges
        uint256[] memory activeBadges = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allBadges.length; i++) {
            if (skillBadges[allBadges[i]].isActive && !isExpired(allBadges[i])) {
                activeBadges[index] = allBadges[i];
                index++;
            }
        }
        
        return activeBadges;
    }
    
    /**
     * @dev Check if a badge is expired
     */
    function isExpired(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        
        uint256 expiryDate = skillBadges[tokenId].expiryDate;
        return expiryDate > 0 && block.timestamp > expiryDate;
    }
    
    /**
     * @dev Get skill badge details
     */
    function getSkillBadge(uint256 tokenId) public view returns (SkillBadge memory) {
        require(_exists(tokenId), "Token does not exist");
        return skillBadges[tokenId];
    }
    
    /**
     * @dev Authorize an issuer
     */
    function authorizeIssuer(address issuer) public onlyOwner {
        require(issuer != address(0), "Invalid issuer address");
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }
    
    /**
     * @dev Revoke issuer authorization
     */
    function revokeIssuer(address issuer) public onlyOwner {
        authorizedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }
    
    /**
     * @dev Get total number of badges issued
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Check if user has a specific skill (active and non-expired)
     */
    function hasActiveSkill(address user, string memory skillName) public view returns (bool) {
        if (!hasSkill[user][skillName]) {
            return false;
        }
        
        uint256[] memory badges = userBadges[user];
        for (uint256 i = 0; i < badges.length; i++) {
            SkillBadge memory badge = skillBadges[badges[i]];
            if (
                keccak256(bytes(badge.skillName)) == keccak256(bytes(skillName)) &&
                badge.isActive &&
                !isExpired(badges[i])
            ) {
                return true;
            }
        }
        
        return false;
    }
    
    // Override required functions
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
