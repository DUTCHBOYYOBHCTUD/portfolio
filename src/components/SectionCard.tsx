import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Edges } from '@react-three/drei'
import * as THREE from 'three'
import { CardIcon } from './CardIcon'

interface ComputerCardProps {
    title: string
    description: string
    color: string
    glowColor: string
    position: [number, number, number]
    iconType: 'project' | 'experience' | 'skills' | 'education' | 'contact'
    onClick: (worldPos: THREE.Vector3, worldRot: THREE.Euler) => void
}



export function SectionCard({ title, description, glowColor, position, iconType, onClick }: ComputerCardProps) {
    const group = useRef<THREE.Group>(null!)
    const [hovered, setHovered] = useState(false)

    useFrame((state) => {
        if (!group.current) return

        // Idle Animation: Gentle floating
        const seed = title.length
        group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5 + seed) * 0.1

        // Hover Animation: Scale up slightly (Base scale 3.0)
        const targetScale = hovered ? 3.3 : 3.0
        group.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    })

    const handleClick = (e: any) => {
        e.stopPropagation()
        const worldPos = new THREE.Vector3()
        // const worldRot = new THREE.Euler()
        group.current.getWorldPosition(worldPos)
        // group.current.getWorldQuaternion(new THREE.Quaternion()).setFromEuler(worldRot) 
        onClick(worldPos, group.current.rotation)
    }

    return (
        <group
            ref={group}
            position={position}
            onClick={handleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* --- MINIATURE COMPUTER MODEL --- */}

            {/* 1. MONITOR */}
            <group position={[0, 0.5, 0]}>
                {/* Bezel */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[1.2, 0.9, 0.1]} />
                    <meshStandardMaterial color="#222" roughness={0.5} metalness={0.5} />
                    <Edges color={hovered ? glowColor : '#444'} scale={1} threshold={15} />
                </mesh>

                {/* Monitor Buttons (Bottom Right) */}
                <group position={[0.4, -0.4, 0.055]}>
                    {[...Array(3)].map((_, i) => (
                        <mesh key={i} position={[i * 0.05, 0, 0]}>
                            <circleGeometry args={[0.008, 8]} />
                            <meshStandardMaterial color="#555" emissive={i === 2 ? glowColor : '#000'} emissiveIntensity={0.5} />
                        </mesh>
                    ))}
                </group>

                {/* Webcam */}
                <group position={[0, 0.48, 0.05]}>
                    <mesh>
                        <boxGeometry args={[0.1, 0.03, 0.02]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                    <mesh position={[0, 0, 0.015]}>
                        <circleGeometry args={[0.01, 8]} />
                        <meshBasicMaterial color="#00ff00" />
                    </mesh>
                </group>

                {/* Back Logo */}
                <group position={[0, 0, -0.06]} rotation={[0, Math.PI, 0]}>
                    <mesh>
                        <circleGeometry args={[0.1, 3]} /> {/* Triangle logo */}
                        <meshBasicMaterial color={glowColor} />
                    </mesh>
                </group>

                {/* Screen (The Content) */}
                <mesh position={[0, 0, 0.06]}>
                    <planeGeometry args={[1.0, 0.7]} />
                    <meshBasicMaterial color="black" />
                </mesh>

                {/* Screen Content (Title & Icon) */}
                <group position={[0, 0, 0.07]}>
                    {/* Icon */}
                    <group position={[0, 0.15, 0]}>
                        <CardIcon type={iconType} color={glowColor} />
                    </group>
                    <Text
                        position={[0, -0.1, 0]}
                        fontSize={0.1}
                        color={glowColor} // Use glowColor for bloom
                        anchorX="center"
                        anchorY="middle"
                        material-toneMapped={false} // Enable bloom
                    >
                        {title}
                    </Text>
                    {/* Description (Hidden on small screens, visible on hover?) */}
                    {hovered && (
                        <Text
                            position={[0, -0.25, 0]}
                            fontSize={0.05}
                            color="#888"
                            anchorX="center"
                            anchorY="middle"
                            maxWidth={0.8}
                        >
                            {description}
                        </Text>
                    )}
                </group>
            </group>

            {/* 2. MONITOR STAND */}
            <mesh position={[0, -0.1, 0]}>
                <cylinderGeometry args={[0.05, 0.1, 0.3, 8]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[0, -0.25, 0]}>
                <boxGeometry args={[0.4, 0.05, 0.3]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* 3. KEYBOARD */}
            <group position={[0, -0.3, 0.4]} rotation={[-0.2, 0, 0]}>
                <mesh>
                    <boxGeometry args={[0.8, 0.05, 0.3]} />
                    <meshStandardMaterial color="#222" />
                    <Edges color="#333" />
                </mesh>
                {/* Keys (Rows) */}
                {[...Array(4)].map((_, i) => (
                    <mesh key={i} position={[0, 0.03, -0.1 + i * 0.06]} rotation={[-Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[0.7, 0.04]} />
                        <meshBasicMaterial color="#111" />
                    </mesh>
                ))}
            </group>

            {/* 4. MOUSE */}
            <group position={[0.6, -0.3, 0.4]}>
                <mesh>
                    <boxGeometry args={[0.15, 0.08, 0.2]} />
                    <meshStandardMaterial color="#222" />
                </mesh>
                {/* Scroll Wheel */}
                <mesh position={[0, 0.045, -0.05]}>
                    <boxGeometry args={[0.02, 0.02, 0.04]} />
                    <meshStandardMaterial color={glowColor} />
                </mesh>
                {/* Mouse Pad */}
                <mesh position={[0, -0.045, 0]}>
                    <boxGeometry args={[0.25, 0.01, 0.3]} />
                    <meshStandardMaterial color="#111" />
                </mesh>
            </group>

            {/* 5. CPU TOWER */}
            <mesh position={[-0.8, 0, 0]}>
                <boxGeometry args={[0.3, 0.8, 0.6]} />
                <meshStandardMaterial color="#111" />
                <Edges color={hovered ? glowColor : '#333'} />
                {/* Power Light */}
                <mesh position={[0, 0.3, 0.31]}>
                    <circleGeometry args={[0.02, 16]} />
                    <meshBasicMaterial color={glowColor} />
                </mesh>
                {/* Vents (Side) */}
                <group position={[-0.16, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    {[...Array(5)].map((_, i) => (
                        <mesh key={i} position={[0, i * 0.1 - 0.2, 0]}>
                            <planeGeometry args={[0.4, 0.02]} />
                            <meshBasicMaterial color="#000" />
                        </mesh>
                    ))}
                </group>
                {/* Ports (Front) */}
                <group position={[0, -0.2, 0.31]}>
                    {/* USB Ports */}
                    <mesh position={[-0.05, 0.1, 0]}>
                        <boxGeometry args={[0.08, 0.02, 0.01]} />
                        <meshStandardMaterial color="#444" />
                    </mesh>
                    <mesh position={[0.05, 0.1, 0]}>
                        <boxGeometry args={[0.08, 0.02, 0.01]} />
                        <meshStandardMaterial color="#444" />
                    </mesh>
                    {/* Audio Jacks */}
                    <mesh position={[-0.05, 0, 0]}>
                        <circleGeometry args={[0.015, 8]} />
                        <meshBasicMaterial color="#00ff00" />
                    </mesh>
                    <mesh position={[0.05, 0, 0]}>
                        <circleGeometry args={[0.015, 8]} />
                        <meshBasicMaterial color="#ff0000" />
                    </mesh>
                </group>
                {/* Side Window (Glass Panel) */}
                <mesh position={[0.16, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                    <planeGeometry args={[0.4, 0.6]} />
                    <meshStandardMaterial color={glowColor} transparent opacity={0.1} />
                </mesh>

                {/* INTERNAL COMPONENTS (Visible through window) */}
                {/* GPU */}
                <group position={[0, -0.1, 0]}>
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[0.25, 0.05, 0.4]} />
                        <meshStandardMaterial color="#333" />
                        <Edges color={glowColor} />
                    </mesh>
                    {/* GPU Fans */}
                    <mesh position={[0.05, 0.03, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.04, 8]} />
                        <meshBasicMaterial color={glowColor} transparent opacity={0.5} />
                    </mesh>
                    <mesh position={[0.05, 0.03, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
                        <circleGeometry args={[0.04, 8]} />
                        <meshBasicMaterial color={glowColor} transparent opacity={0.5} />
                    </mesh>
                </group>

                {/* Rear Ports (Back) */}
                <group position={[0, 0, -0.31]}>
                    <mesh position={[0, 0.2, 0]}>
                        <boxGeometry args={[0.15, 0.1, 0.01]} />
                        <meshStandardMaterial color="#555" />
                    </mesh>
                    {/* Power Socket */}
                    <mesh position={[0, -0.3, 0]}>
                        <boxGeometry args={[0.1, 0.05, 0.01]} />
                        <meshStandardMaterial color="#000" />
                    </mesh>
                </group>
            </mesh>

            {/* 6. CABLES (Decorative Lines) */}
            {/* Monitor to Tower */}
            <mesh position={[-0.4, -0.1, 0]} rotation={[0, 0, -0.5]}>
                <cylinderGeometry args={[0.01, 0.01, 0.8]} />
                <meshBasicMaterial color="#222" />
            </mesh>
            {/* Keyboard to Tower */}
            <mesh position={[-0.4, -0.3, 0.2]} rotation={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.6]} />
                <meshBasicMaterial color="#222" />
            </mesh>
        </group>
    )
}
