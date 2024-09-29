import React, { useEffect, useState } from 'react';
import { ERC725 } from '@erc725/erc725.js';
import profileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import './DashboardSection.css';

// Component to display each NFT
const NFTItem = ({ image, title, description, amount, points }) => (
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
      <p className="nft-points">Points: {points}</p>
    </div>
  </div>
);

// Component to display the wallet overview
const WalletOverview = ({ walletAddress }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnedAssets = async () => {
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

        const assets = await Promise.all(receivedAssetsValue.value.map(async (assetAddress) => {
          const assetMetadata = await erc725js.fetchData(assetAddress);
          return {
            image: `https://via.placeholder.com/150`, // Replace with actual image fetching logic
            title: assetAddress, // Replace with actual title from metadata
            description: 'NFT Description', // Replace with actual description from metadata
            amount: '1', // Example amount
            points: '5'  // Example points
          };
        }));

        setNfts(assets);
      } catch (error) {
        console.error('Error fetching owned assets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchOwnedAssets();
    }
  }, [walletAddress]);

  return (
    <div className="wallet-overview">
      <h2>Wallet Overview</h2>
      {loading ? (
        <p>Loading assets...</p>
      ) : (
        nfts.map((nft, index) => (
          <NFTItem key={index} {...nft} />
        ))
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
