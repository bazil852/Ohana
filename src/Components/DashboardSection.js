import React, { useEffect, useState } from 'react';
import { ERC725 } from '@erc725/erc725.js';
import profileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import './DashboardSection.css';

// Component to display each NFT or Token
const AssetItem = ({ image, title, description, amount, points }) => (
  <div className="nft-item">
    <div className="nft-image-container">
      <img src={image} alt={title} className="nft-image" />
    </div>
    <div className="nft-info">
      <h3 className="nft-title">{title}</h3>
      <p className="nft-description">{description}</p>
    </div>
    <div className="nft-stats">
      <p className="nft-amount">Amount: {amount}</p>
      {points && <p className="nft-points">Points: {points}</p>}
    </div>
  </div>
);

// Component to display the wallet overview
const WalletOverview = ({ walletAddress }) => {
  const [nfts, setNfts] = useState([]);
  const [polygonTokens, setPolygonTokens] = useState([]);
  const [arbitrumTokens, setArbitrumTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Polygon tokens
  const fetchPolygonTokens = async () => {
    const polygonApiKey = '3ZHWQT42YUJJ988QWZ2F6G34KNYX7T8PQH';
    try {
      const response = await fetch(
        `https://api.polygonscan.com/api?module=account&action=tokentx&address=${walletAddress}&apikey=${polygonApiKey}`
      );
      const data = await response.json();
      if (data.status === '1') {
        setPolygonTokens(data.result); // Store Polygon tokens
      } else {
        console.error('PolygonScan API error:', data);
      }
    } catch (error) {
      console.error('Error fetching Polygon tokens:', error);
    }
  };

  // Fetch Arbitrum tokens
  const fetchArbitrumTokens = async () => {
    const arbitrumApiKey = 'YOUR_ARBISCAN_API_KEY';
    try {
      const response = await fetch(
        `https://api.arbiscan.io/api?module=account&action=tokenlist&address=${walletAddress}&apikey=${arbitrumApiKey}`
      );
      const data = await response.json();
      if (data.status === '1') {
        setArbitrumTokens(data.result); // Store Arbitrum tokens
      } else {
        console.error('Arbiscan API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching Arbitrum tokens:', error);
    }
  };

  // Fetch Lukso NFTs and assets
  const fetchLuksoAssets = async () => {
    try {
      const erc725js = new ERC725(
        profileSchema,
        walletAddress,
        'https://rpc.mainnet.lukso.network',
        {
          ipfsGateway: 'https://api.universalprofile.cloud/ipfs/',
        }
      );

      const receivedAssetsValue = await erc725js.getData('LSP5ReceivedAssets[]');
      console.log('Owned Assets:', receivedAssetsValue);

      const assets = await Promise.all(
        receivedAssetsValue.value.map(async (assetAddress) => {
          const assetMetadata = await erc725js.fetchData(assetAddress);
          return {
            image: `https://via.placeholder.com/150`, // Replace with actual image fetching logic
            title: assetAddress, // Replace with actual title from metadata
            description: 'NFT Description', // Replace with actual description from metadata
            amount: '1', // Example amount
            points: '5', // Example points
          };
        })
      );

      setNfts(assets);
    } catch (error) {
      console.error('Error fetching Lukso assets:', error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      // Fetch assets and tokens from all networks
      fetchLuksoAssets();
      fetchPolygonTokens();
      fetchArbitrumTokens();
      setLoading(false);
    }
  }, [walletAddress]);

  return (
    <div className="wallet-overview">
      <h2>Wallet Overview</h2>
      {loading ? (
        <p>Loading assets...</p>
      ) : (
        <div>
          <h3>Lukso NFTs</h3>
          {nfts.map((nft, index) => (
            <AssetItem key={index} {...nft} />
          ))}

          <h3>Polygon Tokens</h3>
          {polygonTokens.length > 0 ? (
            polygonTokens.map((token, index) => (
              <AssetItem
                key={index}
                image={`https://via.placeholder.com/150`} // Placeholder image
                title={token.tokenSymbol}
                description={token.tokenName}
                amount={token.value / Math.pow(10, token.tokenDecimal)} // Calculate token amount
              />
            ))
          ) : (
            <p>No Polygon tokens found.</p>
          )}

          <h3>Arbitrum Tokens</h3>
          {arbitrumTokens.length > 0 ? (
            arbitrumTokens.map((token, index) => (
              <AssetItem
                key={index}
                image={`https://via.placeholder.com/150`} // Placeholder image
                title={token.tokenSymbol}
                description={token.tokenName}
                amount={token.balance / Math.pow(10, token.tokenDecimal)} // Calculate token amount
              />
            ))
          ) : (
            <p>No Arbitrum tokens found.</p>
          )}
        </div>
      )}
    </div>
  );
};

// Component to display points and reputation
const PointsReputation = () => {
  const data = [
    { label: 'Tree Funded', value: 4.5 },
    { label: 'CO2 Retired', value: 4.5 },
    { label: 'Tokens Held', value: 4.5 },
  ];

  return (
    <div className="points-reputation">
      <h2>Points & Reputation</h2>
      <p>Track your progress and contributions on the Impact Ledger.</p>
      {data.map((item, index) => (
        <div className="points-row" key={index}>
          <span>{item.label}</span>
          <span>{item.value}</span>
          <div className="points-bar">
            <div className="points-bar-fill" style={{ width: `${(item.value / 5) * 100}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Dashboard Section
const DashboardSection = ({ walletAddress }) => {
  return (
    <div className="dashboard-section">
      <WalletOverview walletAddress={walletAddress} />
      <PointsReputation />
    </div>
  );
};

export default DashboardSection;
