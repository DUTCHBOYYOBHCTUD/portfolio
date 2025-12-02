import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { Vector2 } from 'three'

export function Effects({ glitch = false, turbo = false }: { glitch?: boolean, turbo?: boolean }) {
    return (
        <EffectComposer>
            <Bloom
                luminanceThreshold={0.2}
                mipmapBlur
                intensity={glitch ? 4.0 : 2.0}
                radius={0.5}
            />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />

            {/* Turbo Speed Effect */}
            <ChromaticAberration
                offset={turbo ? new Vector2(0.01, 0.002) : new Vector2(0, 0)}
                radialModulation={true}
                modulationOffset={0.5}
            />
        </EffectComposer>
    )
}
