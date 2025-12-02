import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { SectionCard } from './SectionCard'
import { FloatingTerminal } from './FloatingTerminal'

interface CarouselProps {
    onCardClick: (data: any) => void
    position?: [number, number, number]
    expandedCard?: any
}

const ITEMS = [
    { type: 'card', title: 'PROJECTS', desc: 'View my work', color: '#594d00', glowColor: '#FFD700', icon: 'project' }, // Dark Gold -> Neon Gold
    { type: 'card', title: 'EXPERIENCE', desc: 'My journey', color: '#2c3e50', glowColor: '#00FFFF', icon: 'experience' }, // Dark Steel -> Neon Cyan
    { type: 'card', title: 'CONTACT', desc: 'Get in touch', color: '#4a1a1c', glowColor: '#FF00FF', icon: 'contact' } // Dark Rose -> Neon Magenta
]

export function Carousel({ onCardClick, position = [0, 0, 0], expandedCard }: CarouselProps) {
    // const { width } = useThree((state) => state.viewport)
    const scroll = useScroll()
    const groupRef = useRef<THREE.Group>(null!)

    useFrame((_state, delta) => {
        const offset = scroll.offset

        // Rotation: Spins based on total scroll
        // Pause rotation if a card is expanded
        if (!expandedCard) {
            const targetRotation = offset * Math.PI * 4
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, delta * 5)
        }

        // Position: "Pops up" from below and stays at 1.5 (Lowered further)
        // Starts at -15, moves to 1.5
        const targetY = THREE.MathUtils.lerp(-15, 1.5, Math.min(offset * 4, 1))
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 5)
    })

    return (
        <group ref={groupRef} position={position}>
            {ITEMS.map((item, index) => {
                const angle = (index / ITEMS.length) * Math.PI * 2
                const radius = 6 // Distance from center
                const x = Math.sin(angle) * radius
                const z = Math.cos(angle) * radius

                // Hide if this is the expanded card
                const isHidden = expandedCard && expandedCard.title === item.title

                return (
                    <group
                        key={index}
                        position={[x, 0, z]}
                        rotation={[0, angle, 0]}
                        visible={!isHidden}
                    >
                        {item.type === 'card' ? (
                            <SectionCard
                                title={item.title}
                                description={item.desc}
                                color={item.color}
                                glowColor={item.glowColor} // Pass the glow color
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
