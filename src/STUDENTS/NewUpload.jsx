import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import { abi } from '../abi'; // Import ABI
import { contractAddress } from '../contractAddress';
import { pinata } from '../config'; // Assuming Pinata upload config
import Background3D from '../components/Background3D';
import axios from 'axios';

const NewUpload = () => {
    const [file, setFile] = useState(null);
    const [docType, setDocType] = useState('');
    const [weightage, setWeightage] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleFileChange = async(event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // Check file size (max 10MB)
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError('File size should be less than 10MB');
                return;
            }
            // Check file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError('Only PDF, JPEG, JPG, and PNG files are allowed');
                return;
            }
          
            setFile(selectedFile);
            setError('');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        if (!file) {
            setError('Please select a file');
            return;
        }
        if (!docType.trim()) {
            setError('Please enter document type');
            return;
        }
        if (!weightage) {
            setError('Please enter weightage');
            return;
        }
        if (weightage < 1 || weightage > 10) {
            setError('Weightage must be between 1 and 10');
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
            console.error('Upload error:', error);
            setError('Error uploading document. Please try again.');
        }
        setLoading(false);
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
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

                <UploadContainer>
                    <UploadCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <UploadHeader>
                            <UploadTitle>Upload Document</UploadTitle>
                            <UploadSubtitle>Securely upload your educational credentials</UploadSubtitle>
                        </UploadHeader>

                        <Form onSubmit={handleUpload}>
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

                            {message && (
                                <MessageCard
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <SuccessIcon>✅</SuccessIcon>
                                    <MessageText>{message}</MessageText>
                                </MessageCard>
                            )}

                            <InputGroup>
                                <InputLabel>Document File</InputLabel>
                                <FileInput
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <FileInputLabel onClick={handleFileInputClick}>
                                    {file ? (
                                        <FileInfo>
                                            <FileIcon>📄</FileIcon>
                                            <FileName>{file.name}</FileName>
                                            <FileSize>{(file.size / 1024 / 1024).toFixed(2)} MB</FileSize>
                                        </FileInfo>
                                    ) : (
                                        <FilePlaceholder>
                                            <UploadIcon>📤</UploadIcon>
                                            <span>Click to choose a file</span>
                                            <FileTypeHint>Supported formats: PDF, JPEG, PNG</FileTypeHint>
                                        </FilePlaceholder>
                                    )}
                                </FileInputLabel>
                            </InputGroup>

                            <InputGroup>
                                <InputLabel>Document Type</InputLabel>
                                <Input
                                    type="text"
                                    placeholder="e.g., Degree Certificate, Transcript"
                                    value={docType}
                                    onChange={(e) => setDocType(e.target.value)}
                                    required
                                />
                            </InputGroup>

                            <InputGroup>
                                <InputLabel>Weightage (1-10)</InputLabel>
                                <Input
                                    type="number"
                                    placeholder="Enter weightage"
                                    value={weightage}
                                    onChange={(e) => setWeightage(e.target.value)}
                                    required
                                    min="1"
                                    max="10"
                                />
                            </InputGroup>

                            <UploadButton
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? (
                                    <LoadingText>Uploading...</LoadingText>
                                ) : (
                                    <>
                                        <UploadIcon>📤</UploadIcon>
                                        Upload Document
                                    </>
                                )}
                            </UploadButton>
                        </Form>
                    </UploadCard>
                </UploadContainer>
            </ContentWrapper>
        </Container>
    );
};

export default NewUpload;

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

const UploadContainer = styled.div`
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
`;

const UploadCard = styled(motion.div)`
    width: 100%;
    max-width: 600px;
    padding: 2.5rem;
    background: rgba(22, 27, 34, 0.7);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(88, 101, 242, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const UploadHeader = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

const UploadTitle = styled.h2`
    font-size: 2rem;
    color: #ffffff;
    margin: 0;
    background: linear-gradient(135deg, #ffffff, #8B949E);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const UploadSubtitle = styled.p`
    color: #8B949E;
    margin-top: 0.5rem;
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

const FileInput = styled.input`
    display: none;
`;

const FileInputLabel = styled.div`
    padding: 1rem;
    background: rgba(88, 101, 242, 0.05);
    border: 1px dashed rgba(88, 101, 242, 0.2);
    border-radius: 8px;
    color: #8B949E;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(88, 101, 242, 0.1);
        border-color: #5865F2;
    }
`;

const UploadButton = styled(motion.button)`
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

const UploadIcon = styled.span`
    font-size: 1.2rem;
`;

const LoadingText = styled.span`
    color: #8B949E;
`;

const MessageCard = styled(motion.div)`
    padding: 1rem;
    background: rgba(88, 101, 242, 0.1);
    border: 1px solid rgba(88, 101, 242, 0.2);
    border-radius: 8px;
    color: #ffffff;
    text-align: center;
    margin-bottom: 1rem;
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
    margin-bottom: 1rem;
`;

const ErrorIcon = styled.span`
    font-size: 1.2rem;
`;

const ErrorText = styled.span`
    font-size: 0.9rem;
`;

const SuccessIcon = styled.span`
    font-size: 1.2rem;
`;

const MessageText = styled.span`
    font-size: 0.9rem;
`;

const FileInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const FileIcon = styled.span`
    font-size: 1.2rem;
`;

const FileName = styled.span`
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const FileSize = styled.span`
    color: #8B949E;
    font-size: 0.8rem;
`;

const FilePlaceholder = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
`;

const FileTypeHint = styled.span`
    font-size: 0.8rem;
    color: #8B949E;
`;
