import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Helper to get random neon color
const getRandomColor = () => {
    const colors = [
        '#FF00FF', // Magenta
        '#00FFFF', // Cyan
        '#FFD700', // Gold
        '#FF0000', // Red
        '#00FF00', // Green
        '#0000FF', // Blue
    ]
    return new THREE.Color(colors[Math.floor(Math.random() * colors.length)]).multiplyScalar(10) // Boost for bloom (was 2)
}

function Firework({ position, onComplete }: { position: THREE.Vector3, onComplete: () => void }) {
    const ref = useRef<THREE.Points>(null!)
    const [exploded, setExploded] = useState(false)
    const color = useMemo(() => getRandomColor(), [])

    // Particles for explosion
    const particleCount = 100
    const particles = useMemo(() => {
        const positions = new Float32Array(particleCount * 3)
        const velocities = []

        for (let i = 0; i < particleCount; i++) {
            // Sphere distribution
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos((Math.random() * 2) - 1)
            const speed = 0.5 + Math.random() * 0.5

            velocities.push({
                x: speed * Math.sin(phi) * Math.cos(theta),
                y: speed * Math.sin(phi) * Math.sin(theta),
                z: speed * Math.cos(phi)
            })

            positions[i * 3] = 0
            positions[i * 3 + 1] = 0
            positions[i * 3 + 2] = 0
        }

        return { positions, velocities }
    }, [])

    useFrame((_state, delta) => {
        if (!ref.current) return

        // Phase 1: Launch (Upward)
        if (!exploded) {
            ref.current.position.y += delta * 15
            if (ref.current.position.y > position.y) {
                setExploded(true)
            }
        }
        // Phase 2: Explosion
        else {
            const positions = ref.current.geometry.attributes.position.array as Float32Array

            for (let i = 0; i < particleCount; i++) {
                // Gravity
                particles.velocities[i].y -= delta * 0.5

                // Move
                positions[i * 3] += particles.velocities[i].x * delta * 5
                positions[i * 3 + 1] += particles.velocities[i].y * delta * 5
                positions[i * 3 + 2] += particles.velocities[i].z * delta * 5
            }

            ref.current.geometry.attributes.position.needsUpdate = true

            // Fade out
            const material = ref.current.material as THREE.PointsMaterial
            material.opacity -= delta * 0.5

            if (material.opacity <= 0) {
                onComplete()
            }
        }
    })

    if (!exploded) {
        // Rocket trail (simple point for now)
        return (
            <points ref={ref} position={[position.x, -20, position.z]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={1}
                        array={new Float32Array([0, 0, 0])}
                        itemSize={3}
                        args={[new Float32Array([0, 0, 0]), 3]}
                    />
                </bufferGeometry>
                <pointsMaterial size={0.2} color={color} transparent opacity={1} />
            </points>
        )
    }

    return (
        <points ref={ref} position={[position.x, position.y, position.z]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={particles.positions}
                    itemSize={3}
                    args={[particles.positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial size={0.1} color={color} transparent opacity={1} sizeAttenuation={true} />
        </points>
    )
}

export function Fireworks() {
    const [fireworks, setFireworks] = useState<{ id: number, position: THREE.Vector3 }[]>([])

    useFrame(() => {
        // Random spawn chance (approx every 2 seconds)
        if (Math.random() < 0.01) {
            const x = (Math.random() - 0.5) * 40
            const y = 5 + Math.random() * 10
            const z = -10 - Math.random() * 20

            setFireworks(prev => [...prev, {
                id: Date.now() + Math.random(),
                position: new THREE.Vector3(x, y, z)
            }])
        }
    })

    const removeFirework = (id: number) => {
        setFireworks(prev => prev.filter(fw => fw.id !== id))
    }

    return (
        <group>
            {fireworks.map(fw => (
                <Firework
                    key={fw.id}
                    position={fw.position}
                    onComplete={() => removeFirework(fw.id)}
                />
            ))}
        </group>
    )
}
