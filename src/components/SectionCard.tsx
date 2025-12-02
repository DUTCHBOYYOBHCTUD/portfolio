import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface SectionCardProps {
    title: string
    description: string
    color: string
    position: [number, number, number]
    iconType: 'project' | 'experience' | 'contact'
    onClick: (worldPos: THREE.Vector3, worldRot: THREE.Euler) => void
}

const ICONS = {
    project: '</>',
    experience: '★',
    contact: '@'
}

export function SectionCard({ title, description, color, position, iconType, onClick }: SectionCardProps) {
    const groupRef = useRef<THREE.Group>(null!)
    const [hovered, setHovered] = useState(false)

    useFrame((_state, delta) => {
        if (!groupRef.current) return

        // Hover animation
        const targetScale = hovered ? 1.05 : 1
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10)

        // Slight rotation on hover
        if (hovered) {
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0.05, delta * 5)
        } else {
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, delta * 5)
        }
    })

    return (
        <group
            ref={groupRef}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={(e) => {
                e.stopPropagation()
                const worldPos = new THREE.Vector3()
                groupRef.current.getWorldPosition(worldPos)
                onClick(worldPos, groupRef.current.rotation)
            }}
        >
            {/* Glass Card Background */}
            <mesh>
                <boxGeometry args={[4, 5, 0.2]} />
                <meshPhysicalMaterial
                    color={color}
                    transparent
                    opacity={0.2} // Lower opacity for clearer glass
                    roughness={0} // Perfectly smooth
                    metalness={0.5} // Metallic reflection
                    transmission={1} // Full transmission (glass)
                    thickness={3} // Thicker for refraction
                    ior={1.5} // Glass Index of Refraction
                    clearcoat={1} // Extra shine
                    clearcoatRoughness={0}
                />
            </mesh>

            {/* Border */}
            <mesh position={[0, 0, 0.11]}>
                <boxGeometry args={[4.1, 5.1, 0.05]} />
                <meshBasicMaterial color={color} wireframe />
            </mesh>

            {/* Content */}
            <group position={[0, 0, 0.12]}>
                {/* Icon */}
                <Text
                    position={[0, 1.5, 0]}
                    fontSize={1.0}
                    color={color}
                    anchorX="center"
                    anchorY="middle"

                >
                    {ICONS[iconType]}
                </Text>

                {/* Title */}
                <Text
                    position={[0, 0, 0]}
                    fontSize={0.4}
                    color="white"
                    anchorX="center"
                    anchorY="middle"

                >
                    {title}
                </Text>

                {/* Description */}
                <Text
                    position={[0, -1, 0]}
                    fontSize={0.15}
                    color="white"
                    anchorX="center"
                    anchorY="top"
                    maxWidth={3}
                    textAlign="center"

                >
                    {description}
                </Text>
            </group>
        </group>
    )
}
