import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { Vector2 } from 'three'

export function Effects({ glitch = false, quality = 'high', turbo = false }: { glitch?: boolean, quality?: 'high' | 'low', turbo?: boolean }) {
    return (
        <EffectComposer>
            <Bloom
                luminanceThreshold={0.2}
                mipmapBlur={true} // Always use mipmapBlur for consistency
                intensity={glitch ? 4.0 : 2.0}
                radius={0.5} // Keep radius consistent
                levels={quality === 'high' ? 8 : 4} // Reduce levels on low quality for performance
            />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />

            {/* Turbo Speed Effect */}

            <ChromaticAberration
                offset={turbo ? new Vector2(0.01, 0.002) : new Vector2(0, 0)}
                radialModulation={false}
                modulationOffset={0}
            />
        </EffectComposer>
    )
}
