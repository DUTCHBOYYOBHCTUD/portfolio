import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { content } from '../utils/content';

// Helper component for double-sided terminal content
function TerminalContent({ data, isClosing, onClose }: { data: any, isClosing: boolean, onClose: () => void }) {
    const [text, setText] = useState('');
    const fullText = content[data.title] || "System data corrupted. Please contact administrator.";

    useEffect(() => {
        if (isClosing) {
            setText('');
            return;
        }

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 30); // Typing speed

        return () => clearInterval(interval);
    }, [fullText, isClosing]);

    return (
        <group>
            {/* Header */}
            <Text
                position={[-2.8, 1.8, 0.01]}
                fontSize={0.25}
                color="#00ff00"
                anchorX="left"
                anchorY="top"
            >
                {`> VIEWING_FILE: ${data.title.toUpperCase()}`}
            </Text>

            {/* Close Button (Interactive) */}
            <group position={[2.8, 1.8, 0.01]} onClick={onClose}>
                <Text
                    fontSize={0.2}
                    color="#ff0000"
                    anchorX="right"
                    anchorY="middle"
                >
                    [ X ] CLOSE
                </Text>
                {/* Hitbox */}
                <mesh position={[-0.5, 0, 0]} visible={false}>
                    <planeGeometry args={[1.2, 0.3]} />
                </mesh>
            </group>

            {/* Separator */}
            <mesh position={[0, 1.5, 0.01]}>
                <planeGeometry args={[5.6, 0.02]} />
                <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
            </mesh>

            {/* Content Body */}
            <Text
                position={[-2.8, 1.2, 0.01]}
                fontSize={0.18}
                color="#00ff00"
                anchorX="left"
                anchorY="top"
                maxWidth={5.6}
                lineHeight={1.4}
            >
                {text}
            </Text>

            {/* Blinking Cursor */}
            <Text
                position={[-2.8, 1.2 - (text.split('\n').length * 0.25), 0.01]}
                fontSize={0.18}
                color="#00ff00"
                anchorX="left"
                anchorY="top"
            >
                _
                <meshBasicMaterial color="#00ff00" toneMapped={false} />
            </Text>
        </group>
    );
}

export function ExpandedCard({ data, onClose }: { data: any; onClose: () => void }) {
    const groupRef = useRef<THREE.Group>(null!);
    const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!);
    const terminalBgRef = useRef<THREE.Mesh>(null!);
    const [isClosing, setIsClosing] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    // Create geometry once to avoid recreation
    // Landscape: 6 wide, 4 high
    const terminalGeometry = useMemo(() => new THREE.BoxGeometry(5.8, 3.8, 0.22), []);
    const glassGeometry = useMemo(() => new THREE.BoxGeometry(6, 4, 0.2), []);

    useFrame((_state, delta) => {
        if (!groupRef.current) return;

        // Targets
        // Raised Y position to 1.5 to avoid intersection but fit screen
        const targetPos = isClosing ? data.startPosition : new THREE.Vector3(0, 1.5, 9);
        const targetRot = isClosing ? data.startRotation : new THREE.Euler(0, 0, 0);

        // Scale
        // Disable scaling since we are moving the camera closer
        const targetScale = new THREE.Vector3(1, 1, 1);

        // Speed
        const speed = isClosing ? 6 : 4;

        // Lerp Transform
        groupRef.current.position.lerp(targetPos, delta * speed);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRot.x, delta * speed);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRot.y, delta * speed);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRot.z, delta * speed);
        groupRef.current.scale.lerp(targetScale, delta * speed);

        // Material Animation
        if (materialRef.current) {
            const targetRoughness = isClosing ? 0.2 : 0.1;
            const targetThickness = isClosing ? 2 : 1;
            materialRef.current.roughness = THREE.MathUtils.lerp(materialRef.current.roughness, targetRoughness, delta);
            materialRef.current.thickness = THREE.MathUtils.lerp(materialRef.current.thickness, targetThickness, delta);
        }

        // Terminal Background Opacity Animation
        if (terminalBgRef.current) {
            const targetOpacity = isClosing ? 0 : 0.95;
            const currentOpacity = (terminalBgRef.current.material as THREE.MeshBasicMaterial).opacity;
            (terminalBgRef.current.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(currentOpacity, targetOpacity, delta * 5);
        }

        // Check if closed
        if (isClosing) {
            const dist = groupRef.current.position.distanceTo(data.startPosition);
            if (dist < 0.1) {
                onClose();
            }
        }
    });

    useEffect(() => {
        if (isClosing) return;
        const timer = setTimeout(() => {
            setContentVisible(true);
        }, 500);
        return () => clearTimeout(timer);
    }, [isClosing]);

    const handleClose = () => {
        setIsClosing(true);
        setContentVisible(false);
    };

    return (
        <group ref={groupRef} position={data.startPosition} rotation={data.startRotation}>
            {/* Glass Slab */}
            <mesh>
                <primitive object={glassGeometry} attach="geometry" />
                <meshPhysicalMaterial
                    ref={materialRef}
                    color={data.color}
                    roughness={0.2}
                    metalness={0.1}
                    transmission={1}
                    thickness={2}
                />
            </mesh>

            {/* Content Container */}
            {contentVisible && (
                <group>
                    {/* Terminal Background (Black Box) */}
                    <mesh ref={terminalBgRef} position={[0, 0, -0.12]}>
                        <primitive object={terminalGeometry} attach="geometry" />
                        <meshBasicMaterial color="#000000" transparent opacity={0} side={THREE.DoubleSide} />
                    </mesh>

                    {/* Front Content */}
                    <group position={[0, 0, 0.11]}>
                        <TerminalContent data={data} isClosing={isClosing} onClose={handleClose} />
                    </group>

                    {/* Back Content (Rotated 180 degrees around Y) */}
                    <group position={[0, 0, -0.34]} rotation={[0, Math.PI, 0]}>
                        <TerminalContent data={data} isClosing={isClosing} onClose={handleClose} />
                    </group>
                </group>
            )}
        </group>
    );
}
