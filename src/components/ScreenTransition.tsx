// @ts-nocheck
import { EffectComposer, Glitch, ChromaticAberration, Bloom } from '@react-three/postprocessing'
import { BlendFunction, GlitchMode } from 'postprocessing'
import * as THREE from 'three'

interface ScreenTransitionProps {
    phase: 'idle' | 'entering' | 'active' | 'exiting'
}

export function ScreenTransition({ phase }: ScreenTransitionProps) {
    const active = phase === 'entering' || phase === 'exiting'

    return (
        <EffectComposer disableNormalPass>
            {/* Always have some bloom for the neon look */}
            <Bloom
                luminanceThreshold={1}
                mipmapBlur
                intensity={0.5}
                radius={0.4}
            />

            {/* Glitch Effect during transitions */}
            {/* @ts-ignore */}
            <Glitch
                delay={new THREE.Vector2(0, 0)} // No delay, instant trigger
                duration={new THREE.Vector2(0.1, 0.3)}
                strength={new THREE.Vector2(0.3, 0.5)}
                mode={GlitchMode.CONSTANT_MILD} // Constant glitch while active
                active={active}
                ratio={0.85}
            />

            {/* Chromatic Aberration for that "High Speed" feel */}
            {/* @ts-ignore */}
            <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={new THREE.Vector2(active ? 0.02 : 0.002, active ? 0.02 : 0.002)}
                radialModulation={false}
                modulationOffset={0}
            />
        </EffectComposer>
    )
}
