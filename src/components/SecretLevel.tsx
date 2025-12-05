import { Float } from '@react-three/drei'
import { SectionCard } from './SectionCard'

export function SecretLevel({ onMessageOpen }: { onMessageOpen: () => void }) {
    return (
        <group position={[0, -52, 0]}>
            {/* Spotlight for dramatic effect */}
            <spotLight
                position={[0, 10, 5]}
                angle={0.5}
                penumbra={1}
                intensity={2}
                color="#00ff00"
                castShadow
            />

            {/* The Secret Computer */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <group onClick={(e) => { e.stopPropagation(); onMessageOpen() }}>
                    <SectionCard
                        position={[0, 0, 0]}
                        title="TRIBUTE"
                        description="by Me"
                        color="#000000"
                        glowColor="#ff0000"
                        iconType={"code" as any}
                        onClick={() => onMessageOpen()}
                    />
                </group>
            </Float>

            {/* Matrix-style floor particles or text? Let's keep it simple and dark for now */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.8} />
            </mesh>
        </group>
    )
}
