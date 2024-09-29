



import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ERC725 } from '@erc725/erc725.js';
import profileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import './Dashboard.css';
import DashboardSection from './DashboardSection';
import IframeComponent from './IframeComponent';
import TileChart from './TileChart';

const WalletSection = () => <div className="section-content">Wallet Section Content</div>;
const HiStudiosSection = () => <div className="section-content">Hi-Studios Section Content</div>;
const GitcoinSection = () => <div className="section-content">Gitcoin Section Content</div>;

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const location = useLocation();
  const { walletAddress } = location.state || { walletAddress: '' };

  const [profilePicture, setProfilePicture] = useState(null);
  const [shortAddress, setShortAddress] = useState('');
  const [error, setError] = useState('');
  const [polygonTokens, setPolygonTokens] = useState([]);
  const [arbitrumTokens, setArbitrumTokens] = useState([]);

  // Redirect to external page
  const redirectToHiStudios = () => {
    window.open('https://ohana-dao-team-docs.gitbook.io/ohana-dao-info-and-doc', '_blank');
  };
  const redirectGitbook = () => {
    window.open('https://explorer.gitcoin.co/#/round/42/7/38', '_blank');
  };



  // Function to fetch tokens on Polygon using PolygonScan API
const fetchPolygonTokens = async () => {
  const polygonApiKey = '3ZHWQT42YUJJ988QWZ2F6G34KNYX7T8PQH';
  console.log("Working with polygon");
  try {
    const response = await fetch(
      `https://api.polygonscan.com/api?module=account&action=tokentx&address=${walletAddress}&apikey=${polygonApiKey}`
    );
    const data = await response.json();
    if (data.status === '1') {
      setPolygonTokens(data.result); // Store the tokens in state
    } else {
      console.error('PolygonScan API error:', data);
    }
  } catch (error) {
    console.error('Error fetching Polygon tokens:', error);
  }
};


  // Function to fetch tokens on Arbitrum using Arbiscan API
  const fetchArbitrumTokens = async () => {
    const arbitrumApiKey = 'YOUR_ARBISCAN_API_KEY';
    try {
      const response = await fetch(
        `https://api.arbiscan.io/api?module=account&action=tokenlist&address=${walletAddress}&apikey=${arbitrumApiKey}`
      );
      const data = await response.json();
      if (data.status === '1') {
        setArbitrumTokens(data.result); // Store the tokens in state
      } else {
        console.error('Arbiscan API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching Arbitrum tokens:', error);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      // Shorten the wallet address for display
      setShortAddress(`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`);

      // Initialize ERC725 with Lukso network settings
      const erc725js = new ERC725(
        profileSchema,
        walletAddress,
        // 'https://rpc.mainnet.lukso.network',
        'https://rpc.testnet.lukso.network',
        {
          ipfsGateway: 'https://api.universalprofile.cloud/ipfs/',
        }
      );

      // Fetch profile data from Lukso
      const fetchProfileData = async () => {
        try {
          const decodedProfileMetadata = await erc725js.fetchData('LSP3Profile');
          console.log('Decoded Profile Metadata:', decodedProfileMetadata);
          
          if (decodedProfileMetadata && decodedProfileMetadata.value) {
            const profileImages = decodedProfileMetadata.value.LSP3Profile.profileImage;
            if (profileImages && profileImages.length > 0) {
              const ipfsHash = profileImages[0].url.replace('ipfs://', '');
              setProfilePicture(`https://api.universalprofile.cloud/ipfs/${ipfsHash}`);
            }
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
          setError('This address does not support the ERC725Y interface or is not a valid Universal Profile.');
        }
      };

      // Fetch Lukso profile and tokens on Polygon and Arbitrum
      fetchProfileData();
      fetchPolygonTokens();
      fetchArbitrumTokens();
    }
  }, [walletAddress]);

  // Function to render token data
  const renderTokens = (tokens, networkName) => (
    <div>
      <h3>{networkName} Tokens</h3>
      {tokens.length > 0 ? (
        <ul>
          {tokens.map((token, index) => (
            <li key={index}>
              {token.tokenSymbol}: {token.balance / Math.pow(10, token.tokenDecimal)} {token.tokenName}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tokens found on {networkName}</p>
      )}
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'Wallet':
        return <WalletSection />;
      case 'Dashboard':
        return (
          <div>
            <DashboardSection walletAddress={walletAddress} />
            <TileChart/>
            {/* {renderTokens(polygonTokens, 'Polygon')}
            {renderTokens(arbitrumTokens, 'Arbitrum')} */}
          </div>
        );
      case 'Hi-Studios':
        return <IframeComponent src="https://ohana-dao-team-docs.gitbook.io/ohana-dao-info-and-doc" />;
      case 'Gitcoin':
      // return redirectGitbook();https://explorer.gitcoin.co/#/round/42/7/38
      return <IframeComponent src="https://explorer.gitcoin.co/#/round/42/7/38" />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div className="navbar-center">
          <ul className="navbar-menu">
            <li className={`navbar-item ${activeSection === 'Wallet' ? 'active' : ''}`} onClick={() => setActiveSection('Wallet')}>
              Wallet
            </li>
            <li className={`navbar-item ${activeSection === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('Dashboard')}>
              Dashboard
            </li>
            <li className={`navbar-item ${activeSection === 'Hi-Studios' ? 'active' : ''}`} onClick={() => setActiveSection('Hi-Studios')}>
              Hi-Studios
            </li>
            <li className={`navbar-item ${activeSection === 'Gitcoin' ? 'active' : ''}`} onClick={() => setActiveSection('Gitcoin')}>
              Gitcoin
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {profilePicture && <img src={profilePicture} alt="Profile" className="profile-picture" />}
          <span className="wallet-address">{shortAddress}</span>
        </div>
      </nav>
      <div className="dashboard-content">{renderSection()}</div>
    </div>
  );
};

export default Dashboard;
