import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function CentralServer() {
    const groupRef = useRef<THREE.Group>(null!)
    const lightsRef = useRef<THREE.Group>(null!)

    // Generate random blinking patterns for server lights
    const lightConfigs = useMemo(() => {
        const lights = []
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff']
        // 5 faces, 8 rows per face, 4 lights per row
        for (let face = 0; face < 5; face++) {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 4; col++) {
                    lights.push({
                        face,
                        row,
                        col,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        speed: 0.5 + Math.random() * 2, // Random blink speed
                        offset: Math.random() * 10
                    })
                }
            }
        }
        return lights
    }, [])

    useFrame((state) => {
        const time = state.clock.elapsedTime

        // Rotate the entire server slowly
        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.1
        }

        // Animate lights (blinking)
        if (lightsRef.current) {
            lightsRef.current.children.forEach((child: any, i) => {
                const config = lightConfigs[i]
                if (child.material) {
                    // Blink effect
                    const intensity = Math.sin(time * config.speed + config.offset) > 0 ? 1 : 0.2
                    child.material.emissiveIntensity = intensity
                }
            })
        }
    })

    return (
        <group ref={groupRef} position={[0, -2, 0]}>
            {/* Main Pentagonal Tower */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[1.5, 1.5, 6, 5]} /> {/* 5 segments = Pentagon */}
                <meshStandardMaterial color="#050505" roughness={0.2} metalness={0.8} />
                <lineSegments>
                    <edgesGeometry args={[new THREE.CylinderGeometry(1.5, 1.5, 6, 5)]} />
                    <lineBasicMaterial color="#004488" />
                </lineSegments>
            </mesh>

            {/* Glowing Core (Visible through gaps/top) */}
            <mesh position={[0, 5.2, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 0.5, 5]} />
                <meshBasicMaterial color="#0088ff" />
            </mesh>
            <pointLight position={[0, 5.5, 0]} color="#0088ff" intensity={2} distance={10} />

            {/* Server Rack Lights */}
            <group ref={lightsRef}>
                {lightConfigs.map((config, i) => {
                    // Calculate position on the pentagon face
                    const angle = (config.face / 5) * Math.PI * 2
                    const radius = 1.51 // Slightly outside the main cylinder

                    // Position relative to face center
                    const rowHeight = (config.row / 8) * 5 - 0.5 // Spread across height
                    const colOffset = (config.col - 1.5) * 0.2 // Spread across width of face

                    // Convert polar to cartesian, then rotate for face
                    // Simple approximation: Place at radius, rotate by angle
                    const x = Math.sin(angle) * radius
                    const z = Math.cos(angle) * radius

                    // We need to offset along the tangent for columns
                    // Tangent vector is (-cos(angle), 0, sin(angle))
                    const tx = -Math.cos(angle) * colOffset
                    const tz = Math.sin(angle) * colOffset

                    return (
                        <mesh
                            key={i}
                            position={[x + tx, rowHeight, z + tz]}
                            rotation={[0, angle, 0]}
                        >
                            <boxGeometry args={[0.16, 0.1, 0.02]} />
                            <meshStandardMaterial
                                color="#111"
                                emissive={config.color}
                                emissiveIntensity={1}
                                toneMapped={false}
                            />
                        </mesh>
                    )
                })}
            </group>

            {/* Base Platform */}
            <mesh position={[0, -1, 0]}>
                <cylinderGeometry args={[3, 3.5, 0.5, 5]} />
                <meshStandardMaterial color="#050505" roughness={0.5} metalness={0.5} />
                <lineSegments>
                    <edgesGeometry args={[new THREE.CylinderGeometry(3, 3.5, 0.5, 5)]} />
                    <lineBasicMaterial color="#004488" />
                </lineSegments>
            </mesh>
        </group>
    )
}
