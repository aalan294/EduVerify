import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Background3D = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Star class
        class Star {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.z = Math.random() * 1000;
                this.size = 1;
                this.speed = 0.5;
                this.brightness = Math.random();
            }

            update() {
                this.z -= this.speed;
                if (this.z <= 0) {
                    this.reset();
                }
            }

            draw() {
                const x = (this.x - canvas.width / 2) * (1000 / this.z);
                const y = (this.y - canvas.height / 2) * (1000 / this.z);
                const radius = this.size * (1000 / this.z);
                const opacity = (1000 - this.z) / 1000;

                ctx.beginPath();
                ctx.arc(x + canvas.width / 2, y + canvas.height / 2, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity * this.brightness})`;
                ctx.fill();
            }
        }

        // Create stars
        const stars = Array(200).fill().map(() => new Star());

        // Animation loop
        const animate = () => {
            ctx.fillStyle = 'rgba(13, 17, 23, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.update();
                star.draw();
            });

            requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return (
        <Container>
            <Canvas ref={canvasRef} />
            <GradientOverlay />
            <GlowEffect />
        </Container>
    );
};

export default Background3D;

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
    background: linear-gradient(135deg, #0D1117 0%, #161B22 100%);
`;

const Canvas = styled.canvas`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

const GradientOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, 
        rgba(88, 101, 242, 0.1) 0%,
        rgba(88, 101, 242, 0.05) 25%,
        transparent 50%);
    pointer-events: none;
`;

const GlowEffect = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, 
        rgba(255, 215, 0, 0.03) 0%,
        transparent 70%);
    pointer-events: none;
`; 