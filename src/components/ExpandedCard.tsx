import { useEffect, useState, useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { content } from '../utils/content.ts';

export function ExpandedCard({ data, onClose, phase: _phase, position = [0, 1.5, 9] }: { data: any; onClose: () => void; phase: 'idle' | 'entering' | 'active' | 'exiting'; position?: [number, number, number] }) {
    const fullText = content[data.title] || "System data corrupted.";
    const [displayedText, setDisplayedText] = useState('');
    const [scrollY, setScrollY] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);
    const groupRef = useRef<THREE.Group>(null!);
    const textRef = useRef<any>(null!);

    // Calculate max scroll dynamically based on real rendered height or fallback
    // Visible height is approx 6 units.
    const maxScroll = useMemo(() => {
        // Fallback calculation based on line count (approx 0.3 units per line)
        const estimatedHeight = fullText.split('\n').length * 0.3;
        const realHeight = contentHeight > 0 ? contentHeight : estimatedHeight;
        return Math.max(0, realHeight - 6 + 1);
    }, [contentHeight, fullText]);

    // CRT Animation Logic
    useFrame((_state, delta) => {
        if (!groupRef.current) return

        const speed = delta * 5

        if (_phase === 'entering') {
            groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, 1, speed)
            groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, 1, speed)
        } else if (_phase === 'exiting') {
            groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, 0.01, speed)
            if (groupRef.current.scale.y < 0.1) {
                groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, 0, speed)
            }
        } else if (_phase === 'active') {
            groupRef.current.scale.set(1, 1, 1)
        }
    })

    // Reset scales on mount
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.scale.set(0, 0.01, 0)
        }
    }, [])

    // Text Typing Effect
    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayedText(fullText.slice(0, currentIndex));
                currentIndex += 5;
            } else {
                clearInterval(interval);
            }
        }, 2); // Faster typing
        return () => clearInterval(interval);
    }, [fullText]);

    // Global Scroll Listener (Bypasses Raycasting)
    useEffect(() => {
        const handleGlobalWheel = (e: WheelEvent) => {
            // Only scroll if we are in the active phase
            if (_phase !== 'active') return;

            const delta = e.deltaY * 0.005;
            // Scroll DOWN (positive delta) -> Increase scrollY -> Move text UP
            setScrollY(prev => {
                const next = THREE.MathUtils.clamp(prev + delta, 0, maxScroll);
                // console.log('Scroll:', prev, '->', next, 'Max:', maxScroll);
                return next;
            });
        };

        window.addEventListener('wheel', handleGlobalWheel);
        return () => window.removeEventListener('wheel', handleGlobalWheel);
    }, [_phase, maxScroll]);

    const isContact = data.title === 'CONTACT';

    // clipRect calculation for Troika Text
    // Text Mesh Position: [-4, 0, 0]
    // World Window X: [-4.25, 4.25]
    // Local Window X = World X - Text Mesh X
    // Local Left = -4.25 - (-4) = -0.25
    // Local Right = 4.25 - (-4) = 8.25

    const clipRect = useMemo(() => {
        return [-0.25, -6.25 - scrollY, 8.25, 0.25 - scrollY] as [number, number, number, number];
    }, [scrollY]);

    // Scrollbar Logic
    const scrollbarHeight = 6;
    const thumbHeight = Math.max(0.5, (6 / (maxScroll + 6)) * scrollbarHeight);
    // Map scrollY (0 to maxScroll) to thumb position (top to bottom)
    // Top of track: 3, Bottom of track: -3
    // Thumb Y = 3 - (scrollY / (maxScroll || 1)) * (scrollbarHeight - thumbHeight) - thumbHeight / 2;
    const thumbY = 3 - (scrollY / (maxScroll || 1)) * (scrollbarHeight - thumbHeight) - thumbHeight / 2;

    // Contact Logic
    const [revealedContact, setRevealedContact] = useState<number | null>(null);
    const contactLinks = [
        { label: 'LINKEDIN', type: 'link', value: 'https://www.linkedin.com/in/chris-kuriakose-353041216/', color: '#0077b5', position: [-2, 1, 0] },
        { label: 'GITHUB', type: 'link', value: 'https://github.com/DUTCHBOYYOBHCTUD', color: '#ffffff', position: [2, 1, 0] },
        { label: 'EMAIL', type: 'display', value: 'chriskuriakose26@gmail.com', color: '#ea4335', position: [-2, -1, 0] },
        { label: 'PHONE', type: 'display', value: '+91 7510203306', color: '#34a853', position: [2, -1, 0] }
    ];

    return (
        <group ref={groupRef} position={position}>
            {/* --- GLOWING BORDER (Outer) --- */}
            <mesh position={[0, 0, -0.15]}>
                <boxGeometry args={[9.7, 7.7, 0.1]} />
                <meshBasicMaterial color={data.glowColor || '#00ff00'} />
            </mesh>

            {/* --- BACKPLATE --- */}
            <mesh position={[0, 0, -0.1]} onClick={(e) => e.stopPropagation()}>
                <boxGeometry args={[9.5, 7.5, 0.5]} />
                <meshStandardMaterial color="#111" roughness={0.8} />
            </mesh>

            {/* --- SCREEN AREA --- */}
            <mesh position={[0, 0, 0]} onClick={(e) => e.stopPropagation()}>
                <planeGeometry args={[8.5, 6.5]} />
                <meshBasicMaterial color="black" transparent opacity={0.9} />
            </mesh>

            {/* --- SCROLLBAR --- */}
            {!isContact && maxScroll > 0 && (
                <group position={[4.1, 0, 0.1]}>
                    {/* Track */}
                    <mesh position={[0, 0, 0]}>
                        <planeGeometry args={[0.1, 6]} />
                        <meshBasicMaterial color="#333" />
                    </mesh>
                    {/* Thumb */}
                    <mesh position={[0, thumbY, 0.01]}>
                        <planeGeometry args={[0.1, thumbHeight]} />
                        <meshBasicMaterial color={data.glowColor || '#00ff00'} toneMapped={false} />
                    </mesh>
                </group>
            )}

            {/* --- CONTENT GROUP (Scrolled) --- */}
            {!isContact && (
                <group position={[0, 3 + scrollY, 0.2]}>
                    <Text
                        ref={textRef}
                        fontSize={0.25}
                        maxWidth={8}
                        lineHeight={1.2}
                        anchorX="left"
                        anchorY="top"
                        position={[-4, 0, 0]} // Start from top-left
                        clipRect={clipRect} // Apply clipping
                        onSync={(info) => {
                            // Calculate real height from bounding box
                            // blockBounds is [minX, minY, maxX, maxY]
                            const height = info.blockBounds[3] - info.blockBounds[1];
                            setContentHeight(height);
                        }}
                    >
                        {displayedText}
                        <meshBasicMaterial color={data.glowColor || '#00ff00'} toneMapped={false} />
                    </Text>
                </group>
            )}

            {/* --- CONTACT ICONS (No Mask needed, they fit) --- */}
            {isContact && (
                <group position={[0, 0, 0.5]}>
                    {contactLinks.map((link, index) => (
                        <group
                            key={index}
                            position={link.position as [number, number, number]}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (link.type === 'link') {
                                    window.open(link.value, '_blank');
                                } else {
                                    setRevealedContact(revealedContact === index ? null : index);
                                }
                            }}
                            onPointerOver={() => document.body.style.cursor = 'pointer'}
                            onPointerOut={() => document.body.style.cursor = 'auto'}
                        >
                            {/* Icon Background */}
                            <mesh>
                                <boxGeometry args={[3.5, 1.5, 0.1]} />
                                <meshBasicMaterial color="#222" />
                            </mesh>
                            {/* Border */}
                            <mesh position={[0, 0, 0.01]}>
                                <boxGeometry args={[3.6, 1.6, 0.05]} />
                                <meshBasicMaterial color={link.color} wireframe />
                            </mesh>
                            {/* Text */}
                            <Text
                                position={[0, 0, 0.1]}
                                fontSize={revealedContact === index ? 0.25 : 0.5}
                                color={link.color}
                                anchorX="center"
                                anchorY="middle"
                                maxWidth={3.4}
                            >
                                {revealedContact === index ? link.value : link.label}
                            </Text>
                        </group>
                    ))}
                </group>
            )}

            {/* --- CLOSE BUTTON (3D) --- */}
            <group
                position={[4, 3.5, 0.2]}
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
            >
                <Text
                    fontSize={0.5}
                    color="#ff0000"
                    anchorX="center"
                    anchorY="middle"
                >
                    [ X ]
                    <meshBasicMaterial color="#ff0000" toneMapped={false} />
                </Text>
            </group>
        </group>
    );
}
