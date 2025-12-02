import { useEffect, useRef } from 'react'
import anime from 'animejs'

interface CyberTextProps {
    text: string
    className?: string
    delay?: number
}

export function CyberText({ text, className = "", delay = 0 }: CyberTextProps) {
    const textRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!textRef.current) return

        // Split text into characters for animation
        const chars = text.split('')
        textRef.current.innerHTML = chars
            .map((char) => `<span class="cyber-char inline-block opacity-0">${char === ' ' ? '&nbsp;' : char}</span>`)
            .join('')

        // Animation sequence
        anime.timeline({ loop: false })
            .add({
                targets: textRef.current.querySelectorAll('.cyber-char'),
                translateY: [-20, 0],
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 800,
                delay: anime.stagger(50, { start: delay }),
                // Glitch effect on individual characters
                update: function (anim) {
                    if (anim.progress < 100 && Math.random() > 0.8) {
                        const targets = textRef.current?.querySelectorAll('.cyber-char')
                        if (targets) {
                            const randomTarget = targets[Math.floor(Math.random() * targets.length)] as HTMLElement
                            if (randomTarget) {
                                randomTarget.style.textShadow = `2px 0 #ff0000, -2px 0 #0000ff`
                                setTimeout(() => {
                                    randomTarget.style.textShadow = 'none'
                                }, 50)
                            }
                        }
                    }
                }
            })
    }, [text, delay])

    return (
        <div ref={textRef} className={className}>
            {text}
        </div>
    )
}
