import { useState,useEffect } from "react";
import './wallet.css';

function Wallet() 
{
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [privateKey, setPrivateKey] = useState<string>('');
    const [showWalletModal, setShowWalletModal] = useState<boolean>(false);

    useEffect(() => 
    {
        const savedWallet = localStorage.getItem('walletAddress')
        if (savedWallet){
            setWalletAddress(savedWallet)
        }
    },[])

    const handleOpenWallet = () => 
    {
        setShowWalletModal(true);
    }

    const handleCloseWallet = () => 
    {
        setShowWalletModal(false);
        setPrivateKey('');
    }

    const handleBindWallet = () => 
    {
        if(!privateKey.trim()){
            alert('请输入私钥');
            return
        }
        const address = privateKey
        
        setWalletAddress(address);
        localStorage.setItem('walletAddress',address);
        localStorage.setItem('privateKey',privateKey);

        alert('钱包绑定成功！');
        handleCloseWallet();
    }
    
    return (
        <div>
            <button onClick={handleOpenWallet} className="wallet-button">
                {walletAddress ? `钱包: ${walletAddress}` : '绑定钱包'}
            </button>

            {showWalletModal && (
                <div className="modal-overlay" onClick={handleCloseWallet}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-button" onClick={handleCloseWallet}>×</button>
                        <h3>绑定钱包</h3>
                        <div className="wallet-form">
                            <label>私钥:
                                <input
                                    type="password"
                                    value={privateKey}
                                    onChange={(e) => setPrivateKey(e.target.value)}
                                    placeholder="请输入私钥"
                                    className="wallet-input"
                                />
                            </label>
                            <div className="wallet-actions">
                                <button onClick={handleBindWallet} className="bind-button">绑定钱包</button>
                                <button onClick={handleCloseWallet} className="cancel-button">取消</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Wallet;