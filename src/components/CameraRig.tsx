import { useFrame, useThree } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import * as THREE from 'three'

export function CameraRig() {
    const { camera } = useThree()
    const scroll = useScroll()

    useFrame((_state, delta) => {
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

        // Add some vertical movement (wave)
        const y = Math.sin(offset * Math.PI * 4) * 2

        const targetPos = new THREE.Vector3(x, y, z)
        const targetLookAt = new THREE.Vector3(0, 0, 0) // Always look at center

        // Smoothly move camera to target position
        camera.position.lerp(targetPos, delta * 2)

        // Smoothly look at target
        camera.lookAt(targetLookAt)
    })

    return null
}
