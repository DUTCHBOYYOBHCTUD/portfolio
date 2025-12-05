import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'
import { useState, useEffect } from 'react'

export function CameraRig({ activeCard, transitionPhase, secretMode }: { activeCard?: any; transitionPhase?: string; secretMode?: boolean }) {
    const { camera } = useThree()
    const scroll = useScroll()
    const [isFocused, setIsFocused] = useState(false)

    // Reset focus when activeCard changes
    useEffect(() => {
        if (!activeCard) {
            setIsFocused(false)
        }
    }, [activeCard])

    useFrame((_state, delta) => {
        // If a card is expanded (PRIORITY OVER SECRET MODE)
        if (activeCard) {
            // If we are already focused, KEEP LOCKING (Remove early return)
            // if (isFocused) return

            // Target position: In front of the expanded card
            // If secretMode, we are deep down at -50.
            const baseY = secretMode ? -48.5 : 1.5
            const baseLookAtY = secretMode ? -48.5 : 1.5

            const targetPos = new THREE.Vector3(0, baseY, 17)
            const targetLookAt = new THREE.Vector3(0, baseLookAtY, 9)

            // Dynamic Speed
            const speed = transitionPhase === 'entering' || transitionPhase === 'exiting' ? 5 : 3

            // Lerp camera
            camera.position.lerp(targetPos, delta * speed)

            // Smooth lookAt is tricky with lerp, but we can lerp the quaternion or just lookAt
            // For simplicity, we keep looking at target
            camera.lookAt(targetLookAt)

            // Check if we are close enough
            if (camera.position.distanceTo(targetPos) < 0.1) {
                setIsFocused(true)
            }
            // CONTINUOUSLY LOCK CAMERA (No OrbitControls)
            return
        }

        // Secret Drop Mode
        if (secretMode) {
            const targetPos = new THREE.Vector3(0, -50, 6)
            const targetLookAt = new THREE.Vector3(0, -50, 0)

            // Fast drop
            camera.position.lerp(targetPos, delta * 5)
            camera.lookAt(targetLookAt)
            return
        }

        // Normal Scroll Logic (Only if not activeCard)
        const offset = scroll.offset // 0 to 1

        // 360 Degree Orbit Logic
        // Radius = 15 (Increased from 12)
        // Angle = offset * 2 * PI (Full circle)

        const radius = 15
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

    // OrbitControls removed to strictly lock camera view
    if (isFocused && activeCard) {
        // Do nothing, let the useFrame loop keep the camera locked
        return null
    }

    return null
}
