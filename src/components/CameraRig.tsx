import { useFrame, useThree } from '@react-three/fiber'
import { useScroll, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useState, useRef, useEffect } from 'react'

export function CameraRig({ activeCard }: { activeCard?: any }) {
    const { camera } = useThree()
    const scroll = useScroll()
    const [isFocused, setIsFocused] = useState(false)
    const controlsRef = useRef<any>(null)

    // Reset focus when activeCard changes
    useEffect(() => {
        if (!activeCard) {
            setIsFocused(false)
        }
    }, [activeCard])

    useFrame((_state, delta) => {
        // If a card is expanded
        if (activeCard) {
            // If we are already focused, let OrbitControls handle it
            if (isFocused) return

            // Target position: In front of the expanded card (which is at 0, 1.5, 9)
            // Camera should be slightly back and up
            const targetPos = new THREE.Vector3(0, 1.5, 17)
            const targetLookAt = new THREE.Vector3(0, 1.5, 9)

            // Lerp camera
            camera.position.lerp(targetPos, delta * 3)

            // Smooth lookAt is tricky with lerp, but we can lerp the quaternion or just lookAt
            // For simplicity, we keep looking at target
            camera.lookAt(targetLookAt)

            // Check if we are close enough
            if (camera.position.distanceTo(targetPos) < 0.1) {
                setIsFocused(true)
            }
            return
        }

        // Normal Scroll Logic (Only if not activeCard)
        const offset = scroll.offset // 0 to 1

        // 360 Degree Orbit Logic
        // Radius = 12
        // Angle = offset * 2 * PI (Full circle)

        const radius = 12
        const angle = offset * Math.PI * 2

        // Calculate position on circle
        // x = r * sin(angle)
        // z = r * cos(angle)
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius

        // Add some vertical movement (wave) - Centered at y=1.5 to match slabs
        const y = 1.5 + Math.sin(offset * Math.PI * 2) * 1

        const targetPos = new THREE.Vector3(x, y, z)
        const targetLookAt = new THREE.Vector3(0, 0, 0) // Always look at center

        // Smoothly move camera to target position
        camera.position.lerp(targetPos, delta * 2)

        // Smoothly look at target
        camera.lookAt(targetLookAt)
    })

    // If focused, return OrbitControls to "let it be free"
    if (isFocused && activeCard) {
        return (
            <OrbitControls
                ref={controlsRef}
                target={[0, 1.5, 9]} // Look at the card
                enableZoom={false}
                enablePan={true}
                enableRotate={true}
                minDistance={8}
                maxDistance={8}
                makeDefault // Important to take over control
            />
        )
    }

    return null
}
