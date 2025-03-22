import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import { abi } from "../abi";
import { contractAddress } from "../contractAddress";
import Background3D from "../components/Background3D";

const SignUp = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!name) {
      setError("Please enter your name");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(abi, contractAddress);

        const uniqueID = `${Date.now()}`; // Generate unique ID using timestamp

        await contract.methods
          .registerStudent(name, uniqueID)
          .send({ from: accounts[0] });

        navigate("/profile");
      } else {
        setError("Please install MetaMask to use this application.");
      }
    } catch (error) {
      console.error(error);
      setError("Registration failed. Please try again.");
    }
    setLoading(false);
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

        <SignUpContainer>
          <SignUpCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SignUpHeader>
              <SignUpTitle>Create Your Account</SignUpTitle>
              <SignUpSubtitle>Join our secure educational verification platform</SignUpSubtitle>
            </SignUpHeader>

            <Form>
              {error && (
                <ErrorCard
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ErrorIcon>⚠️</ErrorIcon>
                  <ErrorText>{error}</ErrorText>
                </ErrorCard>
              )}

              <InputGroup>
                <InputLabel>Full Name</InputLabel>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </InputGroup>

              <SignUpButton
                onClick={handleSignUp}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <LoadingText>Creating Account...</LoadingText>
                ) : (
                  <>
                    <SignUpIcon>✨</SignUpIcon>
                    Create Account
                  </>
                )}
              </SignUpButton>

              <TermsText>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </TermsText>
            </Form>
          </SignUpCard>
        </SignUpContainer>
      </ContentWrapper>
    </Container>
  );
};

export default SignUp;

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

const SignUpContainer = styled.div`
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
`;

const SignUpCard = styled(motion.div)`
    width: 100%;
    max-width: 500px;
    padding: 2.5rem;
    background: rgba(22, 27, 34, 0.7);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(88, 101, 242, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const SignUpHeader = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

const SignUpTitle = styled.h2`
    font-size: 2rem;
    color: #ffffff;
    margin: 0;
    background: linear-gradient(135deg, #ffffff, #8B949E);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const SignUpSubtitle = styled.p`
    color: #8B949E;
    margin-top: 0.5rem;
    font-size: 1.1rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const InputLabel = styled.label`
    color: #8B949E;
    font-size: 0.9rem;
`;

const Input = styled.input`
    padding: 1rem;
    background: rgba(88, 101, 242, 0.05);
    border: 1px solid rgba(88, 101, 242, 0.2);
    border-radius: 8px;
    color: #ffffff;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: #5865F2;
        background: rgba(88, 101, 242, 0.1);
    }

    &::placeholder {
        color: #8B949E;
    }
`;

const SignUpButton = styled(motion.button)`
    background: rgba(88, 101, 242, 0.1);
    color: #5865F2;
    padding: 1rem;
    font-size: 1.1rem;
    border: 2px solid rgba(88, 101, 242, 0.2);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    margin-top: 1rem;

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background: rgba(88, 101, 242, 0.2);
    }
`;

const SignUpIcon = styled.span`
    font-size: 1.2rem;
`;

const LoadingText = styled.span`
    color: #8B949E;
`;

const ErrorCard = styled(motion.div)`
    padding: 1rem;
    background: rgba(255, 59, 48, 0.1);
    border: 1px solid rgba(255, 59, 48, 0.2);
    border-radius: 8px;
    color: #ff3b30;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const ErrorIcon = styled.span`
    font-size: 1.2rem;
`;

const ErrorText = styled.span`
    font-size: 0.9rem;
`;

const TermsText = styled.p`
    color: #8B949E;
    font-size: 0.9rem;
    text-align: center;
    margin-top: 1rem;
`;