import React, { useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import { abi } from './abi';  // Import the contract ABI
import { contractAddress } from './contractAddress';  // Contract address

const Home = () => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleConnectWallet = async () => {
        setLoading(true);
        
        if (typeof window.ethereum !== 'undefined') {
            try {
                const web3 = new Web3(window.ethereum);
                const contract = new web3.eth.Contract(abi, contractAddress);

                // Request MetaMask account
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);

                // Call isStudentRegistered function
                const isRegistered = await contract.methods.isStudentRegistered(accounts[0]).call();

                if (Number(isRegistered) === 1) {
                    navigate('/profile');  // Redirect to Profile page
                } else {
                    navigate('/sign-up');  // Redirect to Sign-Up page
                }
            } catch (error) {
                console.error("Error:", error);
                alert('Error checking registration.');
            }
        } else {
            alert('Please install MetaMask.');
        }

        setLoading(false);
    };

    return (
        <Container>
            <Navbar>
                <Title>EduVerify</Title>
                <WalletButton onClick={handleConnectWallet} disabled={loading}>
                    {loading ? 'Connecting...' : account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
                </WalletButton>
            </Navbar>
            <MainContent>
                <Heading>Secure & Verified Educational Documents on Blockchain</Heading>
                <SubHeading>Upload, Verify, and Share Your Credentials with Trust</SubHeading>
            </MainContent>
        </Container>
    );
};

export default Home;

// Styled Components
const Container = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #121212;
    color: white;
`;

const Navbar = styled.div`
    position: absolute;
    top: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
`;

const Title = styled.h1`
    font-size: 24px;
    font-weight: bold;
    background: linear-gradient(45deg, #4A90E2, #63B3ED);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const WalletButton = styled.button`
    background: linear-gradient(45deg, #4A90E2, #63B3ED);
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const MainContent = styled.div`
    text-align: center;
`;

const Heading = styled.h1`
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const SubHeading = styled.p`
    font-size: 18px;
    color: #cccccc;
`;
