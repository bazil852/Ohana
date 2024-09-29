import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleProviderAnnouncement = (event) => {
      setProviders((prevProviders) => [...prevProviders, event.detail]);
    };

    window.addEventListener("eip6963:announceProvider", handleProviderAnnouncement);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return () => {
      window.removeEventListener("eip6963:announceProvider", handleProviderAnnouncement);
    };
  }, []);

  const connectWallet = async () => {
    if (providers.length === 0) {
      alert("No wallet providers found. Please install a Lukso-compatible wallet.");
      return;
    }

    try {
      const selectedProvider = new ethers.BrowserProvider(providers[0].provider);
      const accounts = await selectedProvider.send('eth_requestAccounts', []);
      setWalletAddress(accounts[0]);
      navigate('/dashboard', { state: { walletAddress: accounts[0] } });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask is not installed.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setWalletAddress(accounts[0]);
      navigate('/dashboard', { state: { walletAddress: accounts[0] } });
    } catch (error) {
      console.error("Failed to connect MetaMask:", error);
      alert("Failed to connect MetaMask.");
    }
  };

  return (
    <div className="login-page">
      <div className="glass-card">
        <div className="logo-container">
          <img src="https://i.postimg.cc/qMQJx5CH/image.png" alt="Impact Ledger Logo" className="logo" />
        </div>
        <h1 className="title">Impact Ledger</h1>
        <p className="subtitle">Track your social impact with NFTs</p>

        {!walletAddress && (
          <>
            <button className="button futuristic-button" onClick={connectWallet}>Universal Profile</button>
            <button className="button futuristic-button-alt" onClick={connectMetaMask}>MetaMask</button>
          </>
        )}
        {walletAddress && (
          <p className="wallet-info">Connected: {walletAddress}</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
