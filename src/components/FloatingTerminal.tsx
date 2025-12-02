import { Text } from '@react-three/drei'
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
        }, 50)

        return () => clearInterval(interval)
    }, [phase])

    // Cat Animation
    useEffect(() => {
        if (phase !== 'cat') return

        const interval = setInterval(() => {
            setCatFrame(prev => (prev + 1) % CAT_FRAMES.length)
        }, 500)

        // Switch to interactive after 5 seconds
        const timeout = setTimeout(() => {
            setPhase('interactive')
        }, 5000)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [phase])

    // Interactive Mode (Keyboard)
    useEffect(() => {
        if (phase !== 'interactive') return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                const cmd = input.trim().toLowerCase()
                const output = COMMANDS[cmd] || `Command not found: ${cmd}`

                setHistory(prev => [...prev, `root@kali:~$ ${input}`, output])
                setInput('')

                if (cmd === 'clear') setHistory([])
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
        // Subtle floating animation
        const t = state.clock.getElapsedTime()
        groupRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.1
        groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.02
        groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.01
    })

    return (
        <group ref={groupRef} position={position}>
            {/* TERMINAL WINDOW */}
            <group position={[0, 0, 0]}>
                {/* Header Bar */}
                <mesh position={[0, 2.2, 0.01]}>
                    <boxGeometry args={[7, 0.5, 0.1]} />
                    <meshStandardMaterial color="#333333" />
                </mesh>
                <Text
                    position={[-3.3, 2.2, 0.07]}
                    fontSize={0.25}
                    color="#ffffff"
                    anchorX="left"
                    anchorY="middle"
                >
                    root@kali:~
                </Text>

                {/* Window Body */}
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[7, 5]} />
                    <meshStandardMaterial color="#000000" opacity={0.95} transparent />
                </mesh>

                {/* Border */}
                <mesh position={[0, 0, -0.01]}>
                    <planeGeometry args={[7.1, 5.1]} />
                    <meshBasicMaterial color="#333333" />
                </mesh>
            </group>

            {/* CONTENT */}
            <group position={[-3.2, 1.8, 0.05]}>
                {phase === 'boot' && lines.map((line, i) => (
                    <Text
                        key={i}
                        position={[0, -i * 0.35, 0]}
                        fontSize={0.22}
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
                        fontSize={0.2}
                        color="#00ff00"
                        maxWidth={6.5}
                        lineHeight={1.4}
                        anchorX="left"
                        anchorY="top"
                    >
                        {bioText}
                    </Text>
                )}

                {phase === 'cat' && (
                    <Text
                        position={[3.2, -1.5, 0]}
                        fontSize={0.35}
                        color="#00ff00"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {CAT_FRAMES[catFrame]}
                    </Text>
                )}

                {phase === 'interactive' && (
                    <group>
                        {history.slice(-10).map((line, i) => (
                            <Text
                                key={i}
                                position={[0, -i * 0.35, 0]}
                                fontSize={0.22}
                                color="#00ff00"
                                anchorX="left"
                                anchorY="top"
                            >
                                {line}
                            </Text>
                        ))}
                        <Text
                            position={[0, -history.slice(-10).length * 0.35, 0]}
                            fontSize={0.22}
                            color="#00ff00"
                            anchorX="left"
                            anchorY="top"
                        >
                            {`root@kali:~$ ${input}_`}
                        </Text>
                    </group>
                )}
            </group>
        </group>
    )
}
