import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Web3 from 'web3';
import { abi } from '../abi';
import { contractAddress } from '../contractAddress';
import { pinata } from '../config';
import Background3D from '../components/Background3D';

const List = () => {
    const { studentId } = useParams();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                if (!window.ethereum) {
                    setError('Please install Metamask.');
                    setLoading(false);
                    return;
                }
                
                const web3 = new Web3(window.ethereum);
                const contract = new web3.eth.Contract(abi, contractAddress);
                
                const studentAddress = await contract.methods.studentByID(studentId).call();
                if (studentAddress === '0x0000000000000000000000000000000000000000') {
                    setError('Invalid Student ID');
                    setLoading(false);
                    return;
                }
                
                const docs = await contract.methods.getStudentDocuments(studentAddress).call();
                if (!Array.isArray(docs) || docs.length === 0) {
                    setError("No documents found.");
                    setLoading(false);
                    return;
                }
                
                // Fetch signed URLs for all documents
                const docsWithUrls = await Promise.all(
                    docs.map(async (doc) => {
                        try {
                            const signedUrl = await getSignedUrl(doc.ipfsHash);
                            return { ...doc, signedUrl };
                        } catch (err) {
                            console.error('Error fetching signed URL:', err);
                            return { ...doc, signedUrl: '' };
                        }
                    })
                );
                
                setDocuments(docsWithUrls);
            } catch (err) {
                console.error(err);
                setError('Error fetching documents');
            }
            setLoading(false);
        };
        
        fetchDocuments();
    }, [studentId]);

    const getSignedUrl = async (cid) => {
        try {
            const signedUrl = await pinata.gateways.createSignedURL({
                cid: cid,
                expires: 60,
            });
            return signedUrl;
        } catch (err) {
            console.error('Error fetching signed URL:', err);
            return '';
        }
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

                <ListContainer>
                    <HeaderSection>
                        <HeaderTitle>Certifications for {studentId}</HeaderTitle>
                        <HeaderSubtitle>View and verify educational documents</HeaderSubtitle>
                    </HeaderSection>

                    {loading ? (
                        <LoadingCard>
                            <LoadingSpinner>⌛</LoadingSpinner>
                            <LoadingText>Loading documents...</LoadingText>
                        </LoadingCard>
                    ) : error ? (
                        <ErrorCard>
                            <ErrorIcon>⚠️</ErrorIcon>
                            <ErrorText>{error}</ErrorText>
                        </ErrorCard>
                    ) : documents.length === 0 ? (
                        <EmptyCard>
                            <EmptyIcon>📄</EmptyIcon>
                            <EmptyText>No certifications found.</EmptyText>
                        </EmptyCard>
                    ) : (
                        <DocumentsGrid>
                            {documents.map((doc, index) => (
                                <DocumentCard
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <DocumentHeader>
                                        <DocumentType>{doc.docType}</DocumentType>
                                        <DocumentNumber>#{index + 1}</DocumentNumber>
                                    </DocumentHeader>
                                    
                                    <DocumentDetails>
                                        <DetailItem>
                                            <DetailLabel>Upload Date</DetailLabel>
                                            <DetailValue>
                                                {new Date(Number(doc.timestamp) * 1000).toLocaleString()}
                                            </DetailValue>
                                        </DetailItem>
                                        
                                        <DetailItem>
                                            <DetailLabel>IPFS Hash</DetailLabel>
                                            <HashValue>{doc.ipfsHash}</HashValue>
                                        </DetailItem>
                                    </DocumentDetails>

                                    <ViewButton
                                        href={doc.signedUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <ViewIcon>👁️</ViewIcon>
                                        View Document
                                    </ViewButton>
                                </DocumentCard>
                            ))}
                        </DocumentsGrid>
                    )}
                </ListContainer>
            </ContentWrapper>
        </Container>
    );
};

export default List;

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

const ListContainer = styled.div`
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
`;

const HeaderSection = styled.div`
    text-align: center;
    margin-bottom: 2rem;
`;

const HeaderTitle = styled.h1`
    font-size: 2.5rem;
    color: #ffffff;
    margin: 0;
    background: linear-gradient(135deg, #ffffff, #8B949E);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const HeaderSubtitle = styled.p`
    color: #8B949E;
    margin-top: 0.5rem;
    font-size: 1.1rem;
`;

const DocumentsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    width: 100%;
`;

const DocumentCard = styled(motion.div)`
    background: rgba(22, 27, 34, 0.7);
    border-radius: 16px;
    padding: 1.5rem;
    border: 1px solid rgba(88, 101, 242, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const DocumentHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const DocumentType = styled.h3`
    font-size: 1.2rem;
    color: #ffffff;
    margin: 0;
`;

const DocumentNumber = styled.span`
    color: #5865F2;
    font-weight: 600;
`;

const DocumentDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
`;

const DetailItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
`;

const DetailLabel = styled.span`
    color: #8B949E;
    font-size: 0.9rem;
`;

const DetailValue = styled.span`
    color: #ffffff;
    font-size: 0.95rem;
`;

const HashValue = styled.span`
    color: #ffffff;
    font-size: 0.8rem;
    font-family: monospace;
    word-break: break-all;
`;

const ViewButton = styled(motion.a)`
    background: rgba(88, 101, 242, 0.1);
    color: #5865F2;
    padding: 0.8rem;
    border-radius: 8px;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-weight: 500;
    border: 1px solid rgba(88, 101, 242, 0.2);
    margin-top: auto;
`;

const ViewIcon = styled.span`
    font-size: 1.2rem;
`;

const LoadingCard = styled.div`
    background: rgba(22, 27, 34, 0.7);
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    border: 1px solid rgba(88, 101, 242, 0.1);
`;

const LoadingSpinner = styled.div`
    font-size: 2rem;
    animation: spin 1s linear infinite;
    @keyframes spin {
        100% { transform: rotate(360deg); }
    }
`;

const LoadingText = styled.p`
    color: #8B949E;
    margin: 0;
`;

const ErrorCard = styled.div`
    background: rgba(22, 27, 34, 0.7);
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    border: 1px solid rgba(255, 59, 48, 0.2);
`;

const ErrorIcon = styled.div`
    font-size: 2rem;
`;

const ErrorText = styled.p`
    color: #ff3b30;
    margin: 0;
    text-align: center;
`;

const EmptyCard = styled.div`
    background: rgba(22, 27, 34, 0.7);
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    border: 1px solid rgba(88, 101, 242, 0.1);
`;

const EmptyIcon = styled.div`
    font-size: 2rem;
`;

const EmptyText = styled.p`
    color: #8B949E;
    margin: 0;
`;
