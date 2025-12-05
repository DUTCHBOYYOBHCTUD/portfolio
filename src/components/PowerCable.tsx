import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PowerCableProps {
    start: [number, number, number]
    end: [number, number, number]
}

export function PowerCable({ start, end }: PowerCableProps) {
    const materialRef = useRef<THREE.MeshBasicMaterial>(null!)

    const curve = useMemo(() => {
        const p1 = new THREE.Vector3(...start)
        const p2 = new THREE.Vector3(...end)

        // Midpoint with some droop/sag
        const mid = new THREE.Vector3().lerpVectors(p1, p2, 0.5)
        mid.y -= 2 // Sag downwards

        return new THREE.CatmullRomCurve3([p1, mid, p2])
    }, [start, end])

    useFrame((state) => {
        if (materialRef.current) {
            // Pulse opacity or color slightly
            materialRef.current.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 5) * 0.2
        }
    })

    return (
        <mesh>
            <tubeGeometry args={[curve, 20, 0.05, 8, false]} />
            <meshBasicMaterial
                ref={materialRef}
                color="#00ffff"
                transparent
                opacity={0.8}
                toneMapped={false} // Bloom
            />
        </mesh>
    )
}
