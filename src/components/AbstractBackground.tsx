import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

export function AbstractBackground() {
  const materialRef = useRef<THREE.PointsMaterial>(null!)
  const scroll = useScroll()

  const particles = useMemo(() => {
    const count = 2300 // "2.3 mil" interpreted as 2.3k for performance
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos((Math.random() * 2) - 1)
      const r = 10 + Math.random() * 5

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
    }

    return positions
  }, [])

  useFrame((state) => {
    if (!materialRef.current) return

    const time = state.clock.elapsedTime

    // Dynamic Color: Cyan to Purple/Blue cycle
    // Cyan is HSL(180, 100%, 50%)
    // We oscillate Hue between 160 (Green-Cyan) and 280 (Purple)
    const hue = 0.5 + Math.sin(time * 0.2) * 0.2 // 0.3 to 0.7 (Greenish to Purpleish)
    const color = new THREE.Color().setHSL(hue, 1, 0.7)
    materialRef.current.color = color

    // Pulse size
    materialRef.current.size = 0.05 + Math.sin(time * 2) * 0.02

    if (scroll) {
      materialRef.current.opacity = 0.5 + scroll.offset * 0.5
    }
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#ffffff" // Start white/cyan
        size={0.05}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
