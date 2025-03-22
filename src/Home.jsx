import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import { abi } from './abi';  // Import the contract ABI
import { contractAddress } from './contractAddress';  // Contract address
import Background3D from './components/Background3D';

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
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
                const isRegistered = await contract.methods.isStudentRegistered(accounts[0]).call();
                if (Number(isRegistered) === 1) {
                    navigate('/profile');
                } else {
                    navigate('/sign-up');
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

    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, -100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <Container>
            <Background3D />
            <ContentWrapper>
            <Navbar>
                    <LogoContainer>
                <Title>EduVerify</Title>
                        <Tagline>Secure Educational Verification</Tagline>
                    </LogoContainer>
                <WalletButton onClick={handleConnectWallet} disabled={loading}>
                    {loading ? 'Connecting...' : account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
                </WalletButton>
            </Navbar>

            <MainContent>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        style={{ y, opacity }}
                    >
                <Heading>Secure & Verified Educational Documents on Blockchain</Heading>
                <SubHeading>Upload, Verify, and Share Your Credentials with Trust</SubHeading>
                    </motion.div>

                    <FeaturesGrid>
                        <FeatureCard
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(88, 101, 242, 0.1)' }}
                        >
                            <FeatureIcon>🔍</FeatureIcon>
                            <FeatureTitle>AI-Powered Verification</FeatureTitle>
                            <FeatureDescription>Advanced forgery detection ensuring document authenticity</FeatureDescription>
                        </FeatureCard>

                        <FeatureCard
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(88, 101, 242, 0.1)' }}
                        >
                            <FeatureIcon>🔒</FeatureIcon>
                            <FeatureTitle>Blockchain Security</FeatureTitle>
                            <FeatureDescription>Immutable storage on IPFS with blockchain verification</FeatureDescription>
                        </FeatureCard>

                        <FeatureCard
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(88, 101, 242, 0.1)' }}
                        >
                            <FeatureIcon>📱</FeatureIcon>
                            <FeatureTitle>QR Code Access</FeatureTitle>
                            <FeatureDescription>Instant verification through personalized QR codes</FeatureDescription>
                        </FeatureCard>

                        <FeatureCard
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(88, 101, 242, 0.1)' }}
                        >
                            <FeatureIcon>🤝</FeatureIcon>
                            <FeatureTitle>Professional Endorsements</FeatureTitle>
                            <FeatureDescription>Get validated by teachers and industry experts</FeatureDescription>
                        </FeatureCard>
                    </FeaturesGrid>

                    <CTAButton
                        onClick={handleConnectWallet}
                        whileHover={{ scale: 1.05, backgroundColor: '#5865F2', color: '#ffffff' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Get Started Now
                    </CTAButton>
            </MainContent>

                <StatsSection>
                    <StatsTitle>Trusted by Educational Institutions Worldwide</StatsTitle>
                    <StatsGrid>
                        <StatCard>
                            <StatNumber>1M+</StatNumber>
                            <StatLabel>Verified Documents</StatLabel>
                        </StatCard>
                        <StatCard>
                            <StatNumber>500+</StatNumber>
                            <StatLabel>Partner Institutions</StatLabel>
                        </StatCard>
                        <StatCard>
                            <StatNumber>99.9%</StatNumber>
                            <StatLabel>Verification Accuracy</StatLabel>
                        </StatCard>
                        <StatCard>
                            <StatNumber>50+</StatNumber>
                            <StatLabel>Countries</StatLabel>
                        </StatCard>
                    </StatsGrid>
                </StatsSection>

                <HowItWorksSection>
                    <SectionTitle>How It Works</SectionTitle>
                    <StepsContainer>
                        <StepCard>
                            <StepNumber>01</StepNumber>
                            <StepTitle>Upload Documents</StepTitle>
                            <StepDescription>Securely upload your educational certificates and credentials</StepDescription>
                        </StepCard>
                        <StepCard>
                            <StepNumber>02</StepNumber>
                            <StepTitle>AI Verification</StepTitle>
                            <StepDescription>Our AI system analyzes and verifies document authenticity</StepDescription>
                        </StepCard>
                        <StepCard>
                            <StepNumber>03</StepNumber>
                            <StepTitle>Blockchain Storage</StepTitle>
                            <StepDescription>Documents are stored immutably on the blockchain</StepDescription>
                        </StepCard>
                        <StepCard>
                            <StepNumber>04</StepNumber>
                            <StepTitle>Share & Verify</StepTitle>
                            <StepDescription>Share your verified credentials with anyone, anywhere</StepDescription>
                        </StepCard>
                    </StepsContainer>
                </HowItWorksSection>

                <TestimonialsSection>
                    <SectionTitle>What Our Users Say</SectionTitle>
                    <TestimonialsGrid>
                        <TestimonialCard>
                            <TestimonialText>"EduVerify has revolutionized how we verify student credentials. The blockchain technology ensures complete trust and transparency."</TestimonialText>
                            <TestimonialAuthor>
                                <AuthorName>Dr. Sarah Johnson</AuthorName>
                                <AuthorRole>Dean of Academic Affairs, Stanford University</AuthorRole>
                            </TestimonialAuthor>
                        </TestimonialCard>
                        <TestimonialCard>
                            <TestimonialText>"As an employer, I can instantly verify candidate credentials. It saves time and eliminates the risk of fraudulent documents."</TestimonialText>
                            <TestimonialAuthor>
                                <AuthorName>Michael Chen</AuthorName>
                                <AuthorRole>HR Director, Google</AuthorRole>
                            </TestimonialAuthor>
                        </TestimonialCard>
                        <TestimonialCard>
                            <TestimonialText>"The AI-powered verification is incredibly accurate. It's like having a digital notary available 24/7."</TestimonialText>
                            <TestimonialAuthor>
                                <AuthorName>Emily Rodriguez</AuthorName>
                                <AuthorRole>Student, MIT</AuthorRole>
                            </TestimonialAuthor>
                        </TestimonialCard>
                    </TestimonialsGrid>
                </TestimonialsSection>

                <SecuritySection>
                    <SectionTitle>Enterprise-Grade Security</SectionTitle>
                    <SecurityGrid>
                        <SecurityCard>
                            <SecurityIcon>🔒</SecurityIcon>
                            <SecurityTitle>End-to-End Encryption</SecurityTitle>
                            <SecurityDescription>All data is encrypted using military-grade protocols</SecurityDescription>
                        </SecurityCard>
                        <SecurityCard>
                            <SecurityIcon>🛡️</SecurityIcon>
                            <SecurityTitle>Multi-Factor Authentication</SecurityTitle>
                            <SecurityDescription>Multiple layers of security for your account</SecurityDescription>
                        </SecurityCard>
                        <SecurityCard>
                            <SecurityIcon>⚡</SecurityIcon>
                            <SecurityTitle>Real-Time Monitoring</SecurityTitle>
                            <SecurityDescription>24/7 security monitoring and threat detection</SecurityDescription>
                        </SecurityCard>
                    </SecurityGrid>
                </SecuritySection>

                <FinalCTASection>
                    <FinalCTAContent>
                        <FinalCTATitle>Ready to Secure Your Educational Future?</FinalCTATitle>
                        <FinalCTADescription>Join thousands of institutions and students already using EduVerify</FinalCTADescription>
                        <CTAButton
                            onClick={handleConnectWallet}
                            whileHover={{ scale: 1.05, backgroundColor: '#5865F2', color: '#ffffff' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Verifying Now
                        </CTAButton>
                    </FinalCTAContent>
                </FinalCTASection>
            </ContentWrapper>
        </Container>
    );
};

export default Home;

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

const WalletButton = styled.button`
    background: rgba(88, 101, 242, 0.1);
    color: #5865F2;
    padding: 12px 24px;
    font-size: 16px;
    border: 1px solid rgba(88, 101, 242, 0.2);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    backdrop-filter: blur(5px);

    &:hover {
        background: rgba(88, 101, 242, 0.2);
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(88, 101, 242, 0.2);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

const MainContent = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8rem 2rem 4rem;
    text-align: center;
    max-width: 1200px;
    margin: 0 auto;
`;

const Heading = styled.h1`
    font-size: 4rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #ffffff, #8B949E);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1.2;
    letter-spacing: -1px;
`;

const SubHeading = styled.p`
    font-size: 1.5rem;
    color: #8B949E;
    margin-bottom: 4rem;
    max-width: 800px;
    line-height: 1.6;
`;

const FeaturesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    width: 100%;
    margin: 2rem 0;
`;

const FeatureCard = styled(motion.div)`
    background: rgba(22, 27, 34, 0.7);
    padding: 2.5rem;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(88, 101, 242, 0.1);
    transition: all 0.3s ease;
`;

const FeatureIcon = styled.div`
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #ffffff;
    font-weight: 700;
`;

const FeatureDescription = styled.p`
    font-size: 1rem;
    color: #8B949E;
    line-height: 1.6;
`;

const CTAButton = styled(motion.button)`
    background: rgba(88, 101, 242, 0.1);
    color: #5865F2;
    padding: 1.25rem 3rem;
    font-size: 1.25rem;
    border: 2px solid rgba(88, 101, 242, 0.2);
    border-radius: 12px;
    cursor: pointer;
    margin-top: 3rem;
    font-weight: 700;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);

    &:hover {
        box-shadow: 0 8px 30px rgba(88, 101, 242, 0.3);
    }
`;

const StatsSection = styled.section`
    padding: 6rem 2rem;
    background: rgba(22, 27, 34, 0.7);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(88, 101, 242, 0.1);
`;

const StatsTitle = styled.h2`
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 4rem;
    background: linear-gradient(135deg, #ffffff, #8B949E);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const StatCard = styled.div`
    text-align: center;
    padding: 2rem;
    background: rgba(88, 101, 242, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(88, 101, 242, 0.1);
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

const StatNumber = styled.div`
    font-size: 3rem;
    font-weight: 800;
    color: #5865F2;
    margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
    font-size: 1.1rem;
    color: #8B949E;
`;

const HowItWorksSection = styled.section`
    padding: 6rem 2rem;
    background: rgba(13, 17, 23, 0.7);
`;

const SectionTitle = styled.h2`
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 4rem;
    background: linear-gradient(135deg, #ffffff, #8B949E);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const StepsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const StepCard = styled.div`
    padding: 2rem;
    background: rgba(22, 27, 34, 0.7);
    border-radius: 16px;
    border: 1px solid rgba(88, 101, 242, 0.1);
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

const StepNumber = styled.div`
    font-size: 2rem;
    font-weight: 800;
    color: #5865F2;
    margin-bottom: 1rem;
`;

const StepTitle = styled.h3`
    font-size: 1.5rem;
    color: #ffffff;
    margin-bottom: 1rem;
`;

const StepDescription = styled.p`
    color: #8B949E;
    line-height: 1.6;
`;

const TestimonialsSection = styled.section`
    padding: 6rem 2rem;
    background: rgba(22, 27, 34, 0.7);
`;

const TestimonialsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const TestimonialCard = styled.div`
    padding: 2rem;
    background: rgba(13, 17, 23, 0.7);
    border-radius: 16px;
    border: 1px solid rgba(88, 101, 242, 0.1);
`;

const TestimonialText = styled.p`
    font-size: 1.1rem;
    color: #ffffff;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-style: italic;
`;

const TestimonialAuthor = styled.div`
    display: flex;
    flex-direction: column;
`;

const AuthorName = styled.div`
    font-weight: 700;
    color: #ffffff;
`;

const AuthorRole = styled.div`
    color: #8B949E;
    font-size: 0.9rem;
`;

const SecuritySection = styled.section`
    padding: 6rem 2rem;
    background: rgba(13, 17, 23, 0.7);
`;

const SecurityGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
`;

const SecurityCard = styled.div`
    padding: 2rem;
    background: rgba(22, 27, 34, 0.7);
    border-radius: 16px;
    border: 1px solid rgba(88, 101, 242, 0.1);
    text-align: center;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }
`;

const SecurityIcon = styled.div`
    font-size: 2.5rem;
    margin-bottom: 1rem;
`;

const SecurityTitle = styled.h3`
    font-size: 1.5rem;
    color: #ffffff;
    margin-bottom: 1rem;
`;

const SecurityDescription = styled.p`
    color: #8B949E;
    line-height: 1.6;
`;

const FinalCTASection = styled.section`
    padding: 6rem 2rem;
    background: rgba(22, 27, 34, 0.7);
    text-align: center;
`;

const FinalCTAContent = styled.div`
    max-width: 800px;
    margin: 0 auto;
`;

const FinalCTATitle = styled.h2`
    font-size: 3rem;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, #ffffff, #8B949E);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const FinalCTADescription = styled.p`
    font-size: 1.25rem;
    color: #8B949E;
    margin-bottom: 2rem;
`;
