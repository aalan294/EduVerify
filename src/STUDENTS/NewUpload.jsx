import React, { useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import { abi } from '../abi'; // Import ABI
import { contractAddress } from '../contractAddress';
import { pinata } from '../config'; // Assuming Pinata upload config

const NewUpload = () => {
    const [file, setFile] = useState(null);
    const [docType, setDocType] = useState('');
    const [weightage, setWeightage] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setMessage('');
        
        if (!file || !docType || !weightage) {
            setMessage('Please fill in all fields.');
            return;
        }
        if (weightage < 1 || weightage > 10) {
            setMessage('Weightage must be between 1 and 10.');
            return;
        }
        
        setLoading(true);
        try {
            // Upload file to Pinata
            const response = await pinata.upload.file(file);
            const ipfsHash = response.cid;
            console.log('IPFS Hash:', ipfsHash);

            // Connect to Web3 and contract
            const web3 = new Web3(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const contractInstance = new web3.eth.Contract(abi, contractAddress);

            // Call the contract function
            await contractInstance.methods.uploadDocument(ipfsHash, docType, weightage)
                .send({ from: accounts[0] });

            setMessage('File uploaded successfully!');
            setTimeout(() => navigate('/profile'), 2000);
        } catch (error) {
            console.error(error);
            setMessage('Error uploading document.');
        }
        setLoading(false);
    };

    return (
        <Container>
            <Wrapper>
                <Title>Upload Document</Title>
                <Form onSubmit={handleUpload}>
                    {message && <Message>{message}</Message>}
                    <Input type="file" onChange={handleFileChange} required />
                    <Input 
                        type="text" 
                        placeholder="Enter Document Type" 
                        value={docType} 
                        onChange={(e) => setDocType(e.target.value)} 
                        required 
                    />
                    <Input 
                        type="number" 
                        placeholder="Weightage (1-10)" 
                        value={weightage} 
                        onChange={(e) => setWeightage(e.target.value)} 
                        required 
                        min="1" 
                        max="10" 
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload'}
                    </Button>
                </Form>
            </Wrapper>
        </Container>
    );
};

export default NewUpload;

// Styled Components
const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #121212;
`;

const Wrapper = styled.div`
    background: rgba(26, 26, 26, 0.9);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 100%;
`;

const Title = styled.h2`
    text-align: center;
    background: linear-gradient(45deg, #4A90E2, #63B3ED);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1.5rem;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Input = styled.input`
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(74, 144, 226, 0.3);
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    &:focus {
        outline: none;
        border-color: #4A90E2;
    }
`;

const Button = styled.button`
    background: linear-gradient(45deg, #4A90E2, #63B3ED);
    color: #fff;
    padding: 1rem;
    font-size: 1.1rem;
    border: none;
    border-radius: 8px;
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

const Message = styled.p`
    text-align: center;
    padding: 1rem;
    border-radius: 8px;
    background: rgba(0, 255, 0, 0.2);
    color: #fff;
`;
