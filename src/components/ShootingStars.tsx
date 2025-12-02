import { useRef, useState, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Trail } from '@react-three/drei'
import * as THREE from 'three'

// Individual Shooting Star
function ShootingStar({ onComplete }: { onComplete: () => void }) {
    const { viewport } = useThree()
    const ref = useRef<THREE.Group>(null!)

    // Random start position (top/left/right)
    const startPos = useMemo(() => {
        const x = (Math.random() - 0.5) * viewport.width * 3 // Wider spread for depth
        const y = (Math.random() - 0.5) * viewport.height * 3
        const z = -20 - Math.random() * 15 // Background depth (-20 to -35)
        return new THREE.Vector3(x, y, z)
    }, [viewport])

    // Random direction (generally downwards/diagonal)
    const velocity = useMemo(() => {
        return new THREE.Vector3(
            (Math.random() - 0.5) * 10, // Random X drift
            -10 - Math.random() * 10,   // Fast downward
            0
        )
    }, [])

    useFrame((_state, delta) => {
        if (!ref.current) return

        ref.current.position.add(velocity.clone().multiplyScalar(delta))

        // Check if out of bounds (below screen)
        if (ref.current.position.y < -20) {
            onComplete()
        }
    })

    return (
        <group ref={ref} position={startPos}>
            <Trail
                width={0.2} // Width of the trail
                length={8} // Length of the trail
                color={new THREE.Color(10, 10, 10)} // High intensity for bloom
                attenuation={(t) => t * t} // Trail fades out
            >
                <mesh>
                    <sphereGeometry args={[0.05, 8, 8] as any} />
                    <meshBasicMaterial color={[10, 10, 10]} toneMapped={false} />
                </mesh>
            </Trail>
        </group>
    )
}

export function ShootingStars() {
    const [stars, setStars] = useState<{ id: number }[]>([])

    useFrame((_state) => {
        // Occasional spawn (1% chance per frame, max 3 stars)
        if (stars.length < 3 && Math.random() < 0.01) {
            setStars(prev => [...prev, { id: Date.now() + Math.random() }])
        }
    })

    const removeStar = (id: number) => {
        setStars(prev => prev.filter(s => s.id !== id))
    }

    return (
        <group>
            {stars.map(star => (
                <ShootingStar key={star.id} onComplete={() => removeStar(star.id)} />
            ))}
        </group>
    )
}
