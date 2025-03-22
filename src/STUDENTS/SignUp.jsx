import React, { useState } from "react";
import styled from "styled-components";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import { abi } from "../abi";
import { contractAddress } from "../contractAddress";

const SignUp = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!name) {
      alert("Please enter your name");
      return;
    }
    
    setLoading(true);
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
        alert("Please install MetaMask to use this application.");
      }
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Container>
      <Heading>Sign Up</Heading>
      <Input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button onClick={handleSignUp} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </Button>
    </Container>
  );
};

export default SignUp;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #121212;
`;

const Heading = styled.h1`
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 80%;
`;

const Button = styled.button`
  background: linear-gradient(45deg, #4A90E2, #63B3ED);
  color: #fff;
  padding: 10px 20px;
  font-size: 18px;
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