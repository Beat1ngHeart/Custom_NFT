#pragma version ^0.4.0

'''
@license MIT
@title Basic NFT Contract
允许任何人通过支付 ETH 购买并铸造 NFT
'''

from snekmate.tokens import erc721
# 移除 ownable 导入，允许任何人铸造
# from snekmate.auth import ownable as ow

# 不绑定 ownable，允许公开铸造
initializes: erc721

exports: erc721.__interface__

NAME: constant(String[25]) = "Basic NFT"
SYMBOL: constant(String[5]) = "BNFT"
BASE_URI: constant(String[80]) = "https://gateway.pinata.cloud/ipfs/"
EIP_712_VERSION: constant(String[20]) = "1"

@deploy
def __init__():
    # 移除 ow.__init__()，因为不再使用 ownable
    erc721.__init__(NAME, SYMBOL, BASE_URI, NAME, EIP_712_VERSION)
    
@external
def mint(uri: String[432]):
    token_id: uint256 = erc721._counter
    erc721._counter = token_id + 1
    erc721._safe_mint(msg.sender, token_id, b"")
    erc721._set_token_uri(token_id, uri)

# 购买并铸造 NFT（支付 ETH 给卖家）
@external
@payable
@nonreentrant("lock")  # 添加防重入锁
def purchase_and_mint(uri: String[432], seller: address):
    # 验证支付金额
    assert msg.value > 0, "Payment must be greater than 0"
    
    # 验证卖家地址（零地址检查）
    # 使用零地址常量检查，更可靠
    ZERO_ADDRESS: constant(address) = 0x0000000000000000000000000000000000000000
    assert seller != ZERO_ADDRESS, "Invalid seller address"

    # 1. 先转账 ETH 给卖家（如果失败，整个交易会 revert）
    # 这样可以确保转账成功后才铸造 NFT，避免买家损失
    # 如果卖家地址是合约但没有 receive() 函数，这里会失败并 revert
    raw_call(seller, b"", value=msg.value)
    
    # 2. 转账成功后，再铸造 NFT
    # 如果转账失败，上面的 raw_call 会 revert，NFT 不会被铸造
    token_id: uint256 = erc721._counter
    erc721._counter = token_id + 1
    erc721._safe_mint(msg.sender, token_id, b"")
    erc721._set_token_uri(token_id, uri)