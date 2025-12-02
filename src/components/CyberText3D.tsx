import { Text3D } from '@react-three/drei'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CyberText3DProps {
    text: string
    position?: [number, number, number]
    rotation?: [number, number, number]
    fontSize?: number
    color?: string
    anchorX?: 'left' | 'center' | 'right'
    anchorY?: 'top' | 'middle' | 'bottom'
    delay?: number
    letterSpacing?: number
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?'
const CYBER_COLORS = ['#00ff00', '#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#ffffff']
// Use Monospaced font to prevent jumbled layout when animating individual letters
const FONT_URL = 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/droid/droid_sans_mono_regular.typeface.json'

function Letter({ char, position, fontSize, color, finished }: { char: string, position: [number, number, number], fontSize: number, color: string, finished: boolean }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const [hovered, setHovered] = useState(false)
    const [currentColor, setCurrentColor] = useState(color)

    useFrame((_state) => {
        if (meshRef.current) {
            // Smooth scaling: 1.2x when hovered
            const targetScale = hovered ? 1.2 : 1
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

            // Subtle float removed for straight line
            meshRef.current.position.y = position[1]
        }
    })

    const handlePointerOver = (e: any) => {
        e.stopPropagation()
        setHovered(true)
        const randomColor = CYBER_COLORS[Math.floor(Math.random() * CYBER_COLORS.length)]
        setCurrentColor(randomColor)
    }

    const handlePointerOut = (e: any) => {
        e.stopPropagation()
        setHovered(false)
        setCurrentColor(color)
    }

    return (
        <group position={position}>
            <Text3D
                ref={meshRef}
                font={FONT_URL}
                size={fontSize}
                height={fontSize * 0.2} // Extrusion depth
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
            >
                {char}
                <meshStandardMaterial
                    color={currentColor}
                    emissive={currentColor}
                    emissiveIntensity={finished ? 0.5 : 2} // Bright when scrambling, dimmer when done
                    roughness={0.2}
                    metalness={0.8}
                />
            </Text3D>
        </group>
    )
}

export function CyberText3D({
    text,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    fontSize = 1,
    color = 'white',
    anchorX = 'center',
    // anchorY = 'middle', // Unused
    delay = 0,
    letterSpacing = 0.85
}: CyberText3DProps) {
    const [displayText, setDisplayText] = useState('')
    const [finished, setFinished] = useState(false)
    const groupRef = useRef<THREE.Group>(null!)

    useEffect(() => {
        let iteration = 0
        let interval: any = null

        const startScramble = () => {
            interval = setInterval(() => {
                setDisplayText(() => {
                    const result = text.split('').map((_char, index) => {
                        if (index < iteration) {
                            return text[index]
                        }
                        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                    }).join('')

                    return result
                })

                if (iteration >= text.length) {
                    clearInterval(interval)
                    setFinished(true)
                }

                iteration += 1 / 3
            }, 30)
        }

        const timeout = setTimeout(startScramble, delay)

        return () => {
            clearTimeout(timeout)
            if (interval) clearInterval(interval)
        }
    }, [text, delay])

    // Calculate layout manually since Text3D doesn't auto-layout like Text
    // We'll just space them out based on fontSize and letterSpacing
    const spacing = fontSize * letterSpacing
    const totalWidth = (text.length - 1) * spacing

    const startX = useMemo(() => {
        if (anchorX === 'left') return 0
        if (anchorX === 'right') return -totalWidth
        return -totalWidth / 2
    }, [anchorX, totalWidth])

    useFrame((state) => {
        if (groupRef.current) {
            // Scroll Interaction: Parallax & Rotation

            // Gentle rotation based on time + scroll
            groupRef.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
            groupRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.05

            // React to scroll velocity (if available via delta, or just use scroll offset for tilt)
            // Let's tilt it slightly based on how far down we are
            // groupRef.current.rotation.z = rotation[2] + (scroll.offset - 0.5) * 0.2
        }
    })

    return (
        <group ref={groupRef} position={position} rotation={rotation as any}>
            {displayText.split('').map((char, i) => (
                <Letter
                    key={i}
                    char={char}
                    position={[startX + (i * spacing), 0, 0]}
                    fontSize={fontSize}
                    color={color}
                    finished={finished}
                />
            ))}
        </group>
    )
}
