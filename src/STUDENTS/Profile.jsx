import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Web3 from "web3";
import styled from "styled-components";
import { motion } from "framer-motion";
import { abi } from "../abi";
import { contractAddress } from "../contractAddress";
import Background3D from "../components/Background3D";

// Styled Components
const Container = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #0D1117;
    color: white;
    overflow: hidden;
    position: relative;
`;

const ContentWrapper = styled.div`
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 2rem;
`;

const Navbar = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding: 1.5rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(13, 17, 23, 0.8);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border-bottom: 1px solid rgba(88, 101, 242, 0.1);
`;

const LogoContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.h1`
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #5865F2, #FFD700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    letter-spacing: -0.5px;
`;

const Tagline = styled.span`
    font-size: 14px;
    color: #8B949E;
    margin-top: 4px;
`;

const ProfileContainer = styled.div`
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
`;

const ProfileCard = styled(motion.div)`
    width: 100%;
    max-width: 800px;
    padding: 2.5rem;
    background: rgba(22, 27, 34, 0.7);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(88, 101, 242, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`;

const ProfileTitle = styled.h2`
    font-size: 2rem;
    color: #ffffff;
    margin: 0;
`;

const MenuButton = styled(motion.button)`
    background: rgba(88, 101, 242, 0.1);
    border: 1px solid rgba(88, 101, 242, 0.2);
    color: #5865F2;
    font-size: 1.5rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(88, 101, 242, 0.2);
        transform: translateY(-2px);
    }
`;

const DropdownMenu = styled(motion.div)`
    position: absolute;
    top: 100%;
    right: 0;
    background: rgba(22, 27, 34, 0.95);
    padding: 1rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: 1px solid rgba(88, 101, 242, 0.1);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const MenuItem = styled(motion(Link))`
    color: #ffffff;
    padding: 0.75rem 1.5rem;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(88, 101, 242, 0.1);
        color: #5865F2;
    }
`;

const LogoutButton = styled(motion.button)`
    color: #ffffff;
    background: none;
    border: none;
    padding: 0.75rem 1.5rem;
    text-align: left;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(88, 101, 242, 0.1);
        color: #5865F2;
    }
`;

const ProfileInfo = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
`;

const InfoCard = styled(motion.div)`
    background: rgba(88, 101, 242, 0.05);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(88, 101, 242, 0.1);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        background: rgba(88, 101, 242, 0.1);
    }
`;

const InfoLabel = styled.div`
    font-size: 0.9rem;
    color: #8B949E;
    margin-bottom: 0.5rem;
`;

const InfoValue = styled.div`
    font-size: 1.2rem;
    color: #ffffff;
    font-weight: 600;
    word-break: break-all;
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
            <Background3D />
            <ContentWrapper>
                <Navbar>
                    <LogoContainer>
                        <Title>EduVerify</Title>
                        <Tagline>Secure Educational Verification</Tagline>
                    </LogoContainer>
                </Navbar>

                <ProfileContainer>
                    <ProfileCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ProfileHeader>
                            <ProfileTitle>Student Profile</ProfileTitle>
                            <div style={{ position: 'relative' }}>
                                <MenuButton
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    ☰
                                </MenuButton>
                                {menuOpen && (
                                    <DropdownMenu
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <MenuItem to="/">Home</MenuItem>
                                        <MenuItem to="/new-upload">New Upload</MenuItem>
                                        <MenuItem to={`/cert/${uniqueID}`}>Certificates</MenuItem>
                                        <LogoutButton
                                            onClick={handleLogout}
                                            whileHover={{ x: 5 }}
                                        >
                                            Logout
                                        </LogoutButton>
                                    </DropdownMenu>
                                )}
                            </div>
                        </ProfileHeader>

                        <ProfileInfo>
                            <InfoCard
                                whileHover={{ scale: 1.02 }}
                            >
                                <InfoLabel>Name</InfoLabel>
                                <InfoValue>{name}</InfoValue>
                            </InfoCard>

                            <InfoCard
                                whileHover={{ scale: 1.02 }}
                            >
                                <InfoLabel>Wallet Address</InfoLabel>
                                <InfoValue>{account}</InfoValue>
                            </InfoCard>

                            <InfoCard
                                whileHover={{ scale: 1.02 }}
                            >
                                <InfoLabel>Unique ID</InfoLabel>
                                <InfoValue>{uniqueID}</InfoValue>
                            </InfoCard>

                            <InfoCard
                                whileHover={{ scale: 1.02 }}
                            >
                                <InfoLabel>Documents Uploaded</InfoLabel>
                                <InfoValue>{docCount}</InfoValue>
                            </InfoCard>
                        </ProfileInfo>
                    </ProfileCard>
                </ProfileContainer>
            </ContentWrapper>
        </Container>
    );
};

export default Profile;
