import { useState, useEffect } from 'react'
import { useProgress } from '@react-three/drei'
import { AnimatePresence, motion } from 'framer-motion'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?'

export function LoadingScreen() {
    const { active, progress } = useProgress()
    const [text, setText] = useState('')
    const [minTimeElapsed, setMinTimeElapsed] = useState(false)
    const targetText = 'CHRIS KURIAKOSE'

    useEffect(() => {
        // Force minimum display time of 2 seconds
        const timer = setTimeout(() => {
            setMinTimeElapsed(true)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        let iteration = 0
        let interval: any = null

        const startScramble = () => {
            interval = setInterval(() => {
                setText(() => {
                    const result = targetText.split('').map((_char, index) => {
                        if (index < iteration) {
                            return targetText[index]
                        }
                        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                    }).join('')

                    return result
                })

                if (iteration >= targetText.length) {
                    clearInterval(interval)
                }

                iteration += 1 / 3
            }, 30)
        }

        startScramble()

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [])

    // Only hide when both loading is done AND min time has elapsed
    const show = active || !minTimeElapsed

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-green-500 font-mono"
                >
                    <div className="text-4xl md:text-6xl font-bold mb-4 tracking-wider">
                        {text}
                    </div>
                    <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-green-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="mt-2 text-sm text-green-400">
                        INITIALIZING SYSTEM... {Math.round(progress)}%
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
