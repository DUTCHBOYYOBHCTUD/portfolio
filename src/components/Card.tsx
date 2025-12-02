import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CardProps {
    color: string
    position: [number, number, number]
    onClick: (worldPos: THREE.Vector3, worldRot: THREE.Euler) => void
}

export function Card({ color, position, onClick }: CardProps) {
    const groupRef = useRef<THREE.Group>(null!)
    const [hovered, setHovered] = useState(false)

    useFrame((_state, delta) => {
        if (!groupRef.current) return

        // Hover animation
        const targetScale = hovered ? 1.05 : 1
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10)
    })

    return (
        <group
            ref={groupRef}
            position={position}
            onClick={(e) => { e.stopPropagation(); onClick(new THREE.Vector3(), new THREE.Euler()) }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Green Box Debug */}
            <mesh>
                <boxGeometry args={[4, 5, 0.2]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Border */}
            <mesh position={[0, 0, 0.11]}>
                <boxGeometry args={[4.1, 5.1, 0.05]} />
                <meshBasicMaterial color="white" wireframe />
            </mesh>
        </group>
    )
}
