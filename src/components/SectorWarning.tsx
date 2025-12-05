import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'

export function SectorWarning() {
    const { camera } = useThree()
    const warningRef = useRef<HTMLDivElement>(null!)
    const vignetteRef = useRef<HTMLDivElement>(null!)
    const [showWarning, setShowWarning] = useState(false)

    useFrame((state) => {
        const distFromCenter = camera.position.length()

        if (distFromCenter > 50) {
            if (!showWarning) setShowWarning(true)

            // Animate warning effects
            const time = state.clock.elapsedTime
            const blink = Math.sin(time * 10) > 0 ? 1 : 0

            if (warningRef.current) {
                warningRef.current.style.opacity = blink.toString()
            }

            if (vignetteRef.current) {
                // Pulse the red vignette intensity
                const intensity = 0.3 + Math.sin(time * 5) * 0.2
                vignetteRef.current.style.background = `radial-gradient(circle, transparent 50%, rgba(255, 0, 0, ${intensity}) 100%)`
            }
        } else {
            if (showWarning) setShowWarning(false)
        }
    })

    if (!showWarning) return null

    return (
        <Html fullscreen style={{ pointerEvents: 'none' }}>
            {/* Red Vignette Overlay */}
            <div
                ref={vignetteRef}
                className="w-full h-full absolute top-0 left-0 transition-all duration-300"
                style={{ background: 'radial-gradient(circle, transparent 60%, rgba(255, 0, 0, 0.5) 100%)' }}
            />

            {/* Warning Text */}
            <div
                ref={warningRef}
                className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
            >
                <div className="text-6xl font-black text-red-600 tracking-widest" style={{ textShadow: '0 0 20px red' }}>
                    WARNING
                </div>
                <div className="text-2xl font-bold text-red-400 mt-2 tracking-widest border-t-2 border-b-2 border-red-500 py-1">
                    SECTOR LIMIT REACHED
                </div>
                <div className="text-xl text-red-500 mt-4 animate-pulse">
                    RETURN TO CENTER IMMEDIATELY
                </div>
            </div>
        </Html>
    )
}
