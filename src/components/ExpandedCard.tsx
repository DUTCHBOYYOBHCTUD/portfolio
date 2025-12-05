import { useEffect, useState, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { content } from '../utils/content';

export function ExpandedCard({ data, onClose }: { data: any; onClose: () => void }) {
    const fullText = content[data.title] || "System data corrupted.";
    const [displayedText, setDisplayedText] = useState('');
    const [scrollPos, setScrollPos] = useState(0);
    const [hovered, setHovered] = useState(false);

    const { gl } = useThree();
    useEffect(() => {
        gl.localClippingEnabled = true;
    }, [gl]);

    const clippingPlanes = useMemo(() => [
        new THREE.Plane(new THREE.Vector3(0, -1, 0), 4.5),
        new THREE.Plane(new THREE.Vector3(0, 1, 0), 1.5)
    ], []);

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

    // Global Scroll Listener
    // Global Scroll Listener (Aggressive Interception)
    useEffect(() => {
        const handleGlobalScroll = (e: WheelEvent) => {
            e.preventDefault(); // Stop browser scroll/zoom
            e.stopImmediatePropagation(); // Stop other listeners (OrbitControls)

            const delta = e.deltaY * 0.005;
            setScrollPos(prev => Math.max(0, Math.min(prev + delta, maxScroll)));
        };

        // Use capture: true to intercept before it reaches the canvas
        window.addEventListener('wheel', handleGlobalScroll, { capture: true, passive: false });
        return () => window.removeEventListener('wheel', handleGlobalScroll, { capture: true } as any);
    }, []);

    const maxScroll = 20;


    return (
        <group position={[0, 1.5, 9]}>
            {/* --- GLOWING BORDER (Outer) --- */}
            <mesh position={[0, 0, -0.15]}>
                <boxGeometry args={[9.7, 7.7, 0.1]} />
                <meshBasicMaterial color={data.glowColor || '#00ff00'} />
            </mesh>

            {/* --- LAYER 1: BACKPLATE --- */}
            <mesh position={[0, 0, -0.1]} onClick={(e) => e.stopPropagation()}>
                <boxGeometry args={[9.5, 7.5, 0.5]} />
                <meshStandardMaterial color="#111" roughness={0.8} />
            </mesh>

            {/* --- LAYER 2: SCREEN BACKGROUND --- */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[8.5, 6.5]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* --- INNER BORDER (Extended) --- */}
            <group position={[0, 0, 0.3]}>
                <mesh position={[0, 3.2, 0]}> {/* Top - Raised */}
                    <boxGeometry args={[8.5, 0.1, 0.01]} /> {/* Wider */}
                    <meshBasicMaterial color="#00ff00" />
                </mesh>
                <mesh position={[0, -3.2, 0]}> {/* Bottom - Lowered */}
                    <boxGeometry args={[8.5, 0.1, 0.01]} /> {/* Wider */}
                    <meshBasicMaterial color="#00ff00" />
                </mesh>
                <mesh position={[-4.25, 0, 0]}> {/* Left - Moved Out */}
                    <boxGeometry args={[0.1, 6.5, 0.01]} /> {/* Taller */}
                    <meshBasicMaterial color="#00ff00" />
                </mesh>
                <mesh position={[4.25, 0, 0]}> {/* Right - Moved Out */}
                    <boxGeometry args={[0.1, 6.5, 0.01]} /> {/* Taller */}
                    <meshBasicMaterial color="#00ff00" />
                </mesh>
            </group>

            {/* --- SCROLLBAR --- */}
            <group position={[4.05, 0, 0.3]}> {/* Moved out slightly */}
                {/* Track */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.1, 6.2, 0.01]} />
                    <meshBasicMaterial color="#222" />
                </mesh>
                {/* Thumb */}
                <mesh position={[0, 2.9 - (scrollPos / maxScroll) * 5.8, 0.02]}>
                    <boxGeometry args={[0.1, 0.8, 0.01]} />
                    <meshBasicMaterial color="#00ff00" />
                </mesh>
            </group>

            {/* --- LAYER 3: TEXT CONTENT --- */}
            <group position={[0, 0, 0.2]}>
                <Text
                    position={[0, 2.5 + scrollPos, 0]}
                    fontSize={0.25} // Increased Font Size
                    color="#00ff00"
                    maxWidth={7.8} // Increased Width
                    lineHeight={1.2}
                    anchorX="center"
                    anchorY="top"
                    renderOrder={999}
                    material-clippingPlanes={clippingPlanes}
                >
                    {displayedText}
                </Text>
            </group>

            {/* --- INTERACTION PLANE & CLICK BLOCKER --- */}
            <mesh
                position={[0, 0, 0.35]}
                onClick={(e) => e.stopPropagation()} // Stop clicks passing through
                visible={false}
            >
                <planeGeometry args={[9, 7]} />
                <meshBasicMaterial color="red" transparent opacity={0} />
            </mesh>

            {/* Close Button */}
            <group
                position={[3.9, 2.9, 0.4]}
                onClick={onClose}
                onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
            >
                {/* Hit Area for easier clicking */}
                <mesh visible={false}>
                    <planeGeometry args={[1.0, 0.5]} />
                </mesh>
                <Text
                    fontSize={0.3}
                    color={hovered ? "red" : "white"}
                    anchorX="right"
                    anchorY="middle"
                >
                    [ X ]
                </Text>
            </group>
        </group>
    );
}
