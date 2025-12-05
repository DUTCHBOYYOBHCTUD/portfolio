import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { SectionCard } from './SectionCard'
import { CentralServer } from './CentralServer'
import { PowerCable } from './PowerCable'

interface CarouselProps {
    onCardClick: (data: any) => void
    position?: [number, number, number]
    expandedCard: any
}

const ITEMS = [
    { type: 'card', title: 'PROJECTS', desc: 'View my work', color: '#594d00', glowColor: '#FFD700', icon: 'project' },
    { type: 'card', title: 'EXPERIENCE', desc: 'My journey', color: '#2c3e50', glowColor: '#00FFFF', icon: 'experience' },
    { type: 'card', title: 'SKILLS', desc: 'Technical Arsenal', color: '#1a4a1c', glowColor: '#00FF00', icon: 'skills' },
    { type: 'card', title: 'EDUCATION', desc: 'Academic Log', color: '#4a1a4a', glowColor: '#FF44FF', icon: 'education' },
    { type: 'card', title: 'CONTACT', desc: 'Get in touch', color: '#4a1a1c', glowColor: '#FF8C00', icon: 'contact' }
]

export function Carousel({ onCardClick, position = [0, 0, 0], expandedCard }: CarouselProps) {
    const scroll = useScroll()
    const groupRef = useRef<THREE.Group>(null!)

    useFrame((_state, delta) => {
        // ... (existing rotation logic)
        const offset = scroll.offset
        if (!expandedCard) {
            const targetRotation = offset * Math.PI * 4
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, delta * 5)
        }
        const targetY = THREE.MathUtils.lerp(-15, 0, Math.min(offset * 4, 1))
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, delta * 5)
    })

    return (
        <group ref={groupRef} position={position}>
            {/* CENTRAL SERVER */}
            <CentralServer />

            {!expandedCard && ITEMS.map((item, index) => {
                const angle = (index / ITEMS.length) * Math.PI * 2
                const radius = 9
                const x = Math.sin(angle) * radius
                const z = Math.cos(angle) * radius

                return (
                    <group key={index}>
                        {/* CABLE CONNECTION */}
                        {/* Connects from Server (0, 0, 0) to Card Base (x, -2, z) */}
                        <PowerCable start={[0, 0, 0]} end={[x, -0.5, z]} />

                        <group
                            position={[x, 0, z]}
                            rotation={[0, angle, 0]}
                        >
                            <SectionCard
                                title={item.title}
                                description={item.desc}
                                color={item.color}
                                glowColor={item.glowColor}
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
                        </group>
                    </group>
                )
            })}
        </group>
    )
}
