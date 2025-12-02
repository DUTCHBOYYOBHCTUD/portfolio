import { Text, useScroll } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BOOT_LINES = [
    "> initializing system...",
    "> loading kernel modules...",
    "> mounting filesystems...",
    "> starting network services...",
    "> establishing secure connection...",
    "> scanning for vulnerabilities...",
    "> access granted.",
    "> welcome, user.",
    "> _"
]

const BIO_TEXT = "I'm Chris Kuriakose, a security analyst who treats bugs with equal parts curiosity and vengeance. I love building things that work beautifully and breaking things that shouldn't. Whether it's apps, audits, or automation -- I'm all about clean execution and smarter systems."

const CAT_FRAMES = [
    `
   /\\_/\\
  ( o.o )
   > ^ <
  `,
    `
   /\\_/\\
  ( -.- )
   > ^ <
  `,
    `
   /\\_/\\
  ( >.< )
   > w <
  `,
    `
   /\\_/\\
  ( O.O )
   > ~ <
  `
]

const COMMANDS: Record<string, string> = {
    help: "Available commands: help, whoami, clear, contact, sudo rm -rf /",
    whoami: "guest@portfolio-terminal:~$ role: visitor",
    contact: "email: chris@example.com | github: @chris-kuriakose",
    "sudo rm -rf /": "PERMISSION DENIED. Nice try, hacker.",
    ls: "projects/  skills/  secrets.txt",
    "cat secrets.txt": "The cake is a lie.",
}

export function FloatingTerminal({ position }: { position: [number, number, number] }) {
    const [lines, setLines] = useState<string[]>([])
    const [bioText, setBioText] = useState('')
    const [phase, setPhase] = useState<'boot' | 'bio' | 'cat' | 'interactive'>('boot')
    const [catFrame, setCatFrame] = useState(0)
    const [input, setInput] = useState('')
    const [history, setHistory] = useState<string[]>([])

    const groupRef = useRef<THREE.Group>(null!)
    const scroll = useScroll()

    // Boot Sequence
    useEffect(() => {
        if (phase !== 'boot') return

        let currentIndex = 0
        const interval = setInterval(() => {
            if (currentIndex < BOOT_LINES.length) {
                setLines(prev => [...prev, BOOT_LINES[currentIndex]])
                currentIndex++
            } else {
                clearInterval(interval)
                setTimeout(() => {
                    setLines([]) // Clear terminal
                    setPhase('bio')
                }, 500)
            }
        }, 500)

        return () => clearInterval(interval)
    }, [phase])

    // Bio Sequence (Typewriter)
    useEffect(() => {
        if (phase !== 'bio') return

        let charIndex = 0

        const interval = setInterval(() => {
            if (charIndex <= BIO_TEXT.length) {
                setBioText(BIO_TEXT.slice(0, charIndex))
                charIndex++
            } else {
                clearInterval(interval)
                setTimeout(() => {
                    setBioText('') // Clear terminal
                    setPhase('cat')
                }, 3000)
            }
        }, 30)

        return () => clearInterval(interval)
    }, [phase])

    // Cat Animation -> Interactive Mode
    useEffect(() => {
        if (phase !== 'cat') return

        const interval = setInterval(() => {
            setCatFrame(prev => (prev + 1) % CAT_FRAMES.length)
        }, 500)

        // Switch to interactive mode after 5 seconds of cat
        const timeout = setTimeout(() => {
            setPhase('interactive')
        }, 5000)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [phase])

    // Interactive Input Handling
    useEffect(() => {
        if (phase !== 'interactive') return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                const cmd = input.trim().toLowerCase()
                let response = `> ${input}`
                let output = ''

                if (cmd === 'clear') {
                    setHistory([])
                    setInput('')
                    return
                }

                if (COMMANDS[cmd]) {
                    output = COMMANDS[cmd]
                } else if (cmd !== '') {
                    output = `command not found: ${cmd}`
                }

                setHistory(prev => [...prev, response, output].filter(Boolean))
                setInput('')
            } else if (e.key === 'Backspace') {
                setInput(prev => prev.slice(0, -1))
            } else if (e.key.length === 1) {
                setInput(prev => prev + e.key)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [phase, input])

    useFrame((state) => {
        if (!groupRef.current) return

        // Float animation
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1

        // Scroll interaction (tilt)
        if (scroll) {
            const scrollOffset = scroll.offset
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05 + (scrollOffset * 0.2)
            groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.02
        }
    })

    return (
        <group ref={groupRef} position={position}>
            {/* Glass Panel Background */}
            <mesh position={[0, 0, -0.1]}>
                <planeGeometry args={[7, 4] as any} />
                <meshPhysicalMaterial
                    color="#000000"
                    transparent
                    opacity={0.8}
                    roughness={0.2}
                    metalness={0.8}
                    clearcoat={1}
                />
            </mesh>

            {/* Terminal Border */}
            <mesh position={[0, 0, -0.11]}>
                <planeGeometry args={[7.1, 4.1] as any} />
                <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
            </mesh>

            {/* Content Container */}
            <group position={[-3.2, 1.5, 0.05]}>
                {phase === 'boot' && lines.map((line, i) => (
                    <Text
                        key={i}
                        position={[0, -i * 0.3, 0]}
                        fontSize={0.2}
                        color="#00ff00"
                        anchorX="left"
                        anchorY="top"

                    >
                        {line}
                    </Text>
                ))}

                {phase === 'bio' && (
                    <Text
                        position={[0, 0, 0]}
                        fontSize={0.18}
                        color="#00ff00"
                        anchorX="left"
                        anchorY="top"
                        maxWidth={6.5}
                        lineHeight={1.4}

                    >
                        {bioText}
                        <meshBasicMaterial color="#00ff00" toneMapped={false} />
                    </Text>
                )}

                {phase === 'cat' && (
                    <Text
                        position={[3.2, -1, 0]} // Centered
                        fontSize={0.3}
                        color="#00ff00"
                        anchorX="center"
                        anchorY="middle"

                    >
                        {CAT_FRAMES[catFrame]}
                        <meshBasicMaterial color="#00ff00" toneMapped={false} />
                    </Text>
                )}

                {phase === 'interactive' && (
                    <group>
                        {history.slice(-10).map((line, i) => (
                            <Text
                                key={i}
                                position={[0, -i * 0.3, 0]}
                                fontSize={0.2}
                                color="#00ff00"
                                anchorX="left"
                                anchorY="top"

                            >
                                {line}
                            </Text>
                        ))}
                        <Text
                            position={[0, -history.slice(-10).length * 0.3, 0]}
                            fontSize={0.2}
                            color="#00ff00"
                            anchorX="left"
                            anchorY="top"

                        >
                            {`> ${input}_`}
                            <meshBasicMaterial color="#00ff00" toneMapped={false} />
                        </Text>
                    </group>
                )}
            </group>
        </group>
    )
}
