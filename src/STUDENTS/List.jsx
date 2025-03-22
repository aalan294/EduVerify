import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Web3 from 'web3';
import { abi } from '../abi';
import { contractAddress } from '../contractAddress';
import {pinata} from '../config'; // Ensure you have the correct import for Pinata

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
            <Heading>Certifications for {studentId}</Heading>
            {loading ? (
                <Message>Loading...</Message>
            ) : error ? (
                <Message>{error}</Message>
            ) : documents.length === 0 ? (
                <Message>No certifications found.</Message>
            ) : (
                <ListContainer>
                    {documents.map((doc, index) => (
                        <ListItem key={index}>
                            <strong>{index + 1}. {doc.docType}</strong>
                            <p>IPFS Hash: <a href={doc.signedUrl} target="_blank" rel="noopener noreferrer">View Document</a></p>
                            <p>Uploaded: {new Date(Number(doc.timestamp) * 1000).toLocaleString()}</p>
                        </ListItem>
                    ))}
                </ListContainer>
            )}
        </Container>
    );
};

export default List;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #121212;
    color: #fff;
    padding: 20px;
`;

const Heading = styled.h1`
    background: linear-gradient(45deg, #4A90E2, #63B3ED);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 20px;
`;

const Message = styled.p`
    font-size: 18px;
    color: #bbb;
`;

const ListContainer = styled.ul`
    list-style: none;
    padding: 0;
    width: 60%;
    max-width: 600px;
`;

const ListItem = styled.li`
    background: linear-gradient(45deg, #4A90E2, #63B3ED);
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s;

    &:hover {
        transform: translateY(-3px);
    }

    p {
        margin: 5px 0;
        font-size: 14px;
    }

    a {
        color: #fff;
        text-decoration: underline;
        font-weight: bold;
        &:hover {
            color: #ffcc00;
        }
    }
`;
