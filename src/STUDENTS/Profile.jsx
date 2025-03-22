import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Web3 from "web3";
import styled from "styled-components";
import { abi } from "../abi";
import { contractAddress } from "../contractAddress";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #121212;
  color: white;
  padding: 20px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 500px;
  padding: 20px;
  background: #1e1e1e;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.1);
  position: relative;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const ProfileInfo = styled.p`
  font-size: 16px;
  margin: 10px 0;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 10px;
  background: #333;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 10px rgba(255, 255, 255, 0.2);
`;

const MenuItem = styled(Link)`
  color: white;
  padding: 8px 12px;
  text-decoration: none;
  &:hover {
    background: #444;
    border-radius: 5px;
  }
`;

const LogoutButton = styled.button`
  color: white;
  background: none;
  border: none;
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
  &:hover {
    background: #444;
    border-radius: 5px;
  }
`;

const Profile = () => {
    const [account, setAccount] = useState("");
    const [name, setName] = useState("");
    const [uniqueID, setUniqueID] = useState("");
    const [docCount, setDocCount] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                const contract = new web3.eth.Contract(abi, contractAddress);

                try {
                    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                    setAccount(accounts[0]);

                    // Fetch Student Details
                    const student = await contract.methods.students(accounts[0]).call();
                    if (!student.exists) {
                        alert("Not registered! Redirecting...");
                        navigate("/sign-up");
                        return;
                    }

                    setName(student.name);
                    setUniqueID(student.uniqueID);

                    // Fetch Document Count
                    const documents = await contract.methods.getStudentDocuments(accounts[0]).call();
                    setDocCount(documents.length);
                } catch (error) {
                    console.error("Error fetching student data:", error);
                }
            } else {
                alert("Please install MetaMask!");
            }
        };

        loadBlockchainData();
    }, [navigate]);

    // Logout Handler
    const handleLogout = () => {
        setAccount("");
        navigate("/login");
    };

    return (
        <Container>
            <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Title>Profile</Title>
                    <MenuButton onClick={() => setMenuOpen(!menuOpen)}>☰</MenuButton>
                </div>

                {menuOpen && (
                    <DropdownMenu>
                        
                        <MenuItem to="/">Home</MenuItem>
                        <MenuItem to="/new-upload">New Upload</MenuItem>
                        <MenuItem to={`/cert/${uniqueID}`}>Certificates</MenuItem>
                        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                    </DropdownMenu>
                )}

                <ProfileInfo><strong>Name:</strong> {name}</ProfileInfo>
                <ProfileInfo><strong>Wallet Address:</strong> {account}</ProfileInfo>
                <ProfileInfo><strong>Unique ID:</strong> {uniqueID}</ProfileInfo>
                <ProfileInfo><strong>Documents Uploaded:</strong> {docCount}</ProfileInfo>
            </Card>
        </Container>
    );
};

export default Profile;
