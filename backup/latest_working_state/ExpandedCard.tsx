import { useEffect, useState } from 'react';
import { Text } from '@react-three/drei';
import { content } from '../utils/content';

export function ExpandedCard({ data, onClose }: { data: any; onClose: () => void }) {
    const fullText = content[data.title] || "System data corrupted.";
    const [displayedText, setDisplayedText] = useState('');
    const [scrollPos, setScrollPos] = useState(0);

    // Typing Effect
    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayedText(fullText.slice(0, currentIndex));
                currentIndex += 5;
            } else {
                clearInterval(interval);
            }
        }, 5);
        return () => clearInterval(interval);
    }, [fullText]);

    // Scroll Handler
    const handleScroll = (e: any) => {
        e.stopPropagation();
        const delta = e.deltaY * 0.01;
        setScrollPos(prev => Math.max(0, Math.min(prev + delta, 30)));
    };

    return (
        <group position={[0, 1.5, 9]}>
            {/* --- LAYER 1: BACKPLATE --- */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[9.0, 7.0, 0.1]} />
                <meshStandardMaterial color="#000000" roughness={0.8} />
            </mesh>

            {/* --- LAYER 2: TEXT CONTENT --- */}
            <group position={[0, 0, 0.1]}>
                <Text
                    position={[-3.8, 2.5 + scrollPos, 0]}
                    fontSize={0.22}
                    color={data.glowColor || '#00ff00'}
                    maxWidth={7.6}
                    lineHeight={1.2}
                    anchorX="left"
                    anchorY="top"
                >
                    {displayedText}
                </Text>
            </group>

            {/* --- LAYER 3: FRONT BEZEL (MASK) --- */}
            <group position={[0, 0, 0.2]}>
                {/* Top Bar */}
                <mesh position={[0, 3.75, 0]}>
                    <boxGeometry args={[9.5, 1.5, 0.2]} />
                    <meshStandardMaterial color="#1a1a1a" />
                </mesh>
                {/* Bottom Bar */}
                <mesh position={[0, -3.75, 0]}>
                    <boxGeometry args={[9.5, 1.5, 0.2]} />
                    <meshStandardMaterial color="#1a1a1a" />
                </mesh>
                {/* Left Bar */}
                <mesh position={[-4.75, 0, 0]}>
                    <boxGeometry args={[1.5, 7.0, 0.2]} />
                    <meshStandardMaterial color="#1a1a1a" />
                </mesh>
                {/* Right Bar */}
                <mesh position={[4.75, 0, 0]}>
                    <boxGeometry args={[1.5, 7.0, 0.2]} />
                    <meshStandardMaterial color="#1a1a1a" />
                </mesh>
            </group>

            {/* --- LAYER 4: INTERACTION PLANE --- */}
            <mesh
                position={[0, 0, 0.25]}
                onWheel={handleScroll}
                onPointerOver={() => document.body.style.cursor = 'ns-resize'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
                visible={false}
            >
                <planeGeometry args={[9, 7]} />
                <meshBasicMaterial color="red" transparent opacity={0} />
            </mesh>

            {/* Close Button */}
            <mesh
                position={[3.5, 3.8, 0.3]}
                onClick={onClose}
                onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
                onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
            >
                <planeGeometry args={[1.5, 0.6]} />
                <meshBasicMaterial color="red" />
                <Text position={[0, 0, 0.01]} fontSize={0.25} color="white">
                    [X] OFF
                </Text>
            </mesh>
        </group>
    );
}
