import { useEffect, useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { content } from '../utils/content';
import { useFrame } from '@react-three/fiber';

export function ExpandedCard({ data, onClose }: { data: any; onClose: () => void }) {
    const fullText = content[data.title] || "System data corrupted.";
    const [displayedText, setDisplayedText] = useState('');
    const [visible, setVisible] = useState(false);
    const groupRef = useRef<THREE.Group>(null!);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Typing Effect
    useEffect(() => {
        if (!visible) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayedText(fullText.slice(0, currentIndex));
                currentIndex += 5;
            } else {
                clearInterval(interval);
            }
        }, 10);

        return () => clearInterval(interval);
    }, [visible, fullText]);

    // Gentle floating animation
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
        }
    });

    return (
        <group ref={groupRef} position={[0, 1.5, 9]}>
            {/* HTML Content Overlay - ACTING AS THE CARD ITSELF */}
            <Html
                transform
                distanceFactor={8}
                position={[0, 0, 0]}
                style={{
                    width: '800px',
                    height: '600px',
                    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Glass background
                    border: `2px solid ${data.glowColor || '#00ff00'}`,
                    borderRadius: '10px',
                    padding: '20px',
                    color: data.glowColor || '#00ff00',
                    display: 'flex',
                    flexDirection: 'column',
                    pointerEvents: 'auto',
                    boxShadow: `0 0 30px ${data.glowColor || '#00ff00'}40`, // Glow effect
                    backdropFilter: 'blur(5px)' // Glass blur
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                    borderBottom: `4px solid ${data.glowColor}55`,
                    paddingBottom: '10px',
                    width: '100%'
                }}>
                    <h2 style={{ margin: 0, fontFamily: 'monospace', fontSize: '48px', textShadow: `0 0 10px ${data.glowColor}` }}>{`> ${data.title}`}</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(0,0,0,0.5)',
                            border: `4px solid ${data.glowColor}`,
                            color: data.glowColor,
                            padding: '10px 30px',
                            cursor: 'pointer',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                            fontSize: '24px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = data.glowColor;
                            e.currentTarget.style.color = '#000';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
                            e.currentTarget.style.color = data.glowColor;
                        }}
                    >
                        [X] CLOSE
                    </button>
                </div>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    lineHeight: '1.5',
                    fontSize: '24px',
                    paddingRight: '10px',
                    textShadow: `0 0 5px ${data.glowColor}40`
                }}>
                    {displayedText}
                    <span className="animate-pulse">_</span>
                </div>
            </Html>
        </group>
    );
}
