import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Edges, RoundedBox, Text3D, Center } from '@react-three/drei'
import * as THREE from 'three'

interface SectionCardProps {
    title: string
    description: string
    color: string
    glowColor?: string
    position: [number, number, number]
    iconType: 'project' | 'experience' | 'contact'
    onClick: (worldPos: THREE.Vector3, worldRot: THREE.Euler) => void
}

const ICONS = {
    project: '</>',
    experience: '★',
    contact: '@'
}

export function SectionCard({ title, description, color, glowColor = '#ffffff', position, iconType, onClick }: SectionCardProps) {
    const groupRef = useRef<THREE.Group>(null!)
    const slabRef = useRef<THREE.Group>(null!)
    const iconsRef = useRef<THREE.Group>(null!)

    const [hovered, setHovered] = useState(false)
    const [isSplit, setIsSplit] = useState(false)

    // Animation state
    const splitProgress = useRef(0)

    useFrame((_state, delta) => {
        if (!groupRef.current) return

        // 1. Handle Split Animation (Time-based for exact 2s duration)
        const DURATION = 2.0
        if (isSplit) {
            splitProgress.current += delta / DURATION
        } else {
            splitProgress.current -= delta / DURATION
        }
        splitProgress.current = THREE.MathUtils.clamp(splitProgress.current, 0, 1)

        // 2. Animate Main Slab (Shrink and Spin)
        if (slabRef.current) {
            const scale = 1 - splitProgress.current
            slabRef.current.scale.setScalar(scale)
            // Spin effect when splitting (2 full rotations)
            slabRef.current.rotation.y = splitProgress.current * Math.PI * 4
            slabRef.current.visible = scale > 0.01
        }

        // 3. Animate Icons (Expand and Move)
        if (iconsRef.current) {
            const p = splitProgress.current
            // Elastic bounce effect for icons
            const elastic = p === 0 || p === 1 ? p : p * (1.5 - 0.5 * p) // Simple overshoot

            iconsRef.current.scale.setScalar(elastic)
            iconsRef.current.visible = p > 0.01

            // Rotate icons in (2 full rotations)
            iconsRef.current.rotation.y = (1 - p) * -Math.PI * 4
        }

        // 4. Hover Animation (Only if not split)
        if (!isSplit) {
            const targetScale = hovered ? 1.05 : 1
            groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10)

            const targetRotZ = hovered ? 0.05 : 0
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, delta * 5)
        } else {
            // Reset group scale/rotation when split
            groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 10)
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, delta * 5)
        }
    })

    const handleSplit = (e: any) => {
        if (iconType === 'contact') {
            e.stopPropagation()
            setIsSplit(!isSplit)
        } else {
            e.stopPropagation()
            const worldPos = new THREE.Vector3()
            groupRef.current.getWorldPosition(worldPos)
            onClick(worldPos, groupRef.current.rotation)
        }
    }

    return (
        <group
            ref={groupRef}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={handleSplit}
        >
            {/* Main Slab Group */}
            <group ref={slabRef}>
                {/* Solid Dark Matte Slab with Subtle Gloss */}
                <RoundedBox args={[4, 5, 0.2]} radius={0.1} smoothness={4}>
                    <meshPhysicalMaterial
                        color={color}
                        roughness={0.7}
                        metalness={0.4}
                        transmission={0}
                        emissive={color}
                        emissiveIntensity={0.1}
                        clearcoat={0.5}
                        clearcoatRoughness={0.2}
                        reflectivity={0.5}
                        envMapIntensity={1}
                    />
                </RoundedBox>

                {/* Border */}
                <RoundedBox args={[4, 5, 0.2]} radius={0.1} smoothness={4}>
                    <meshBasicMaterial transparent opacity={0} />
                    <Edges scale={1} threshold={15} color={color} renderOrder={1000} />
                </RoundedBox>

                {/* Content */}
                <group position={[0, 0, 0.12]}>
                    <Center position={[0, 1.5, 0]}>
                        <Text3D
                            font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
                            size={0.8}
                            height={0.2}
                            curveSegments={12}
                            bevelEnabled
                            bevelThickness={0.02}
                            bevelSize={0.02}
                            bevelOffset={0}
                            bevelSegments={5}
                        >
                            {ICONS[iconType]}
                            <meshBasicMaterial color={glowColor} toneMapped={false} />
                        </Text3D>
                    </Center>
                    <Text position={[0, 0, 0]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">
                        {title}
                    </Text>
                    <Text position={[0, -0.8, 0]} fontSize={0.2} color="#cccccc" anchorX="center" anchorY="middle" maxWidth={3.5} textAlign="center">
                        {description}
                    </Text>
                </group>
            </group>

            {/* Split Icons Group */}
            <group ref={iconsRef} visible={false}>
                {/* LinkedIn */}
                <group position={[-1.5, 0, 0]} onClick={(e) => { e.stopPropagation(); window.open('https://linkedin.com', '_blank') }}>
                    <Center>
                        <Text3D
                            font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
                            size={0.5}
                            height={0.1}
                            bevelEnabled
                            bevelThickness={0.01}
                            bevelSize={0.01}
                        >
                            in
                            <meshBasicMaterial color="#0077b5" toneMapped={false} />
                        </Text3D>
                    </Center>
                </group>

                {/* WhatsApp */}
                <group position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); window.open('https://whatsapp.com', '_blank') }}>
                    <Center>
                        <Text3D
                            font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
                            size={0.5}
                            height={0.1}
                            bevelEnabled
                            bevelThickness={0.01}
                            bevelSize={0.01}
                        >
                            WA
                            <meshBasicMaterial color="#25D366" toneMapped={false} />
                        </Text3D>
                    </Center>
                </group>

                {/* Instagram */}
                <group position={[1.5, 0, 0]} onClick={(e) => { e.stopPropagation(); window.open('https://instagram.com', '_blank') }}>
                    <Center>
                        <Text3D
                            font="https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
                            size={0.5}
                            height={0.1}
                            bevelEnabled
                            bevelThickness={0.01}
                            bevelSize={0.01}
                        >
                            IG
                            <meshBasicMaterial color="#E1306C" toneMapped={false} />
                        </Text3D>
                    </Center>
                </group>
            </group>
        </group>
    )
}
