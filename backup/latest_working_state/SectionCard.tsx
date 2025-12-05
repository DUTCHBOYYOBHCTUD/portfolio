import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Edges } from '@react-three/drei'
import * as THREE from 'three'

interface ComputerCardProps {
    title: string
    description: string
    color: string
    glowColor: string
    position: [number, number, number]
    iconType: 'project' | 'experience' | 'skills' | 'education' | 'contact'
    onClick: (worldPos: THREE.Vector3, worldRot: THREE.Euler) => void
}

const ICONS = {
    project: '{ }',
    experience: '^_^',
    skills: 'EXP',
    education: 'EDU',
    contact: '@'
}

export function SectionCard({ title, description, color, glowColor, position, iconType, onClick }: ComputerCardProps) {
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

                {/* Screen (The Content) */}
                <mesh position={[0, 0, 0.06]}>
                    <planeGeometry args={[1.0, 0.7]} />
                    <meshBasicMaterial color="black" />
                </mesh>

                {/* Screen Content (Title & Icon) */}
                <group position={[0, 0, 0.07]}>
                    <Text
                        position={[0, 0.15, 0]}
                        fontSize={0.2}
                        color={glowColor}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {ICONS[iconType] || '?'}
                    </Text>
                    <Text
                        position={[0, -0.1, 0]}
                        fontSize={0.1}
                        color={color}
                        anchorX="center"
                        anchorY="middle"
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
                {/* Keys (Simplified texture/dots) */}
                <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.7, 0.2]} />
                    <meshBasicMaterial color="#111" />
                </mesh>
            </group>

            {/* 4. MOUSE */}
            <mesh position={[0.6, -0.3, 0.4]}>
                <boxGeometry args={[0.15, 0.08, 0.2]} />
                <meshStandardMaterial color="#222" />
            </mesh>

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
            </mesh>
        </group>
    )
}
