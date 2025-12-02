import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { SectionCard } from './SectionCard'
import { FloatingTerminal } from './FloatingTerminal'

interface CarouselProps {
    onCardClick: (data: any) => void
}

const ITEMS = [
    { type: 'card', title: 'PROJECTS', desc: 'View my work', color: '#00ff00', icon: 'project' },
    { type: 'card', title: 'EXPERIENCE', desc: 'My journey', color: '#00ffff', icon: 'experience' },
    { type: 'card', title: 'CONTACT', desc: 'Get in touch', color: '#ff00ff', icon: 'contact' },
    { type: 'terminal', title: 'TERMINAL', desc: 'Interactive Shell', color: '#ffffff', icon: 'terminal' }
]

export function Carousel({ onCardClick }: CarouselProps) {
    // const { width } = useThree((state) => state.viewport)
    const scroll = useScroll()
    const groupRef = useRef<THREE.Group>(null!)

    useFrame((_state, delta) => {
        // Calculate scroll offset
        // The scroll.offset is between 0 and 1
        // We want to rotate the carousel based on scroll
        const rotation = scroll.offset * Math.PI * 2

        // Smooth rotation
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotation, delta * 2)
    })

    return (
        <group ref={groupRef}>
            {ITEMS.map((item, index) => {
                const angle = (index / ITEMS.length) * Math.PI * 2
                const radius = 6 // Distance from center
                const x = Math.sin(angle) * radius
                const z = Math.cos(angle) * radius

                return (
                    <group
                        key={index}
                        position={[x, 0, z]}
                        rotation={[0, angle, 0]}
                    >
                        {item.type === 'card' ? (
                            <SectionCard
                                title={item.title}
                                description={item.desc}
                                color={item.color}
                                position={[0, 0, 0]}
                                iconType={item.icon as any}
                                onClick={(worldPos, worldRot) => {
                                    onCardClick({
                                        ...item,
                                        iconType: item.icon,
                                        startPosition: worldPos,
                                        startRotation: worldRot
                                    })
                                }}
                            />
                        ) : (
                            <FloatingTerminal position={[0, 0, 0]} />
                        )}
                    </group>
                )
            })}
        </group>
    )
}
