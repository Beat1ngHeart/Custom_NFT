import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect } from 'wagmi'
import { useEffect } from 'react'
import './wallet.css'

function Wallet() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  // 当钱包连接时，保存地址到 localStorage
  useEffect(() => {
    if (isConnected && address) {
      localStorage.setItem('walletAddress', address)
    } else {
      localStorage.removeItem('walletAddress')
    }
  }, [isConnected, address])

  return (
    <div className="wallet-container">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // 注意：如果您的应用使用 SSR，您可能需要使用 mounted 状态
          const ready = mounted && authenticationStatus !== 'loading'
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated')

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="wallet-button connect-button"
                    >
                      连接钱包
                    </button>
                  )
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="wallet-button error-button"
                    >
                      错误的网络
                    </button>
                  )
                }

                return (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      onClick={openChainModal}
                      style={{ display: 'flex', alignItems: 'center' }}
                      type="button"
                      className="wallet-button chain-button"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 12, height: 12 }}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="wallet-button account-button"
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </button>
                  </div>
                )
              })()}
            </div>
          )
        }}
      </ConnectButton.Custom>
    </div>
  )
}

export default Wallet