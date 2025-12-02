import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'


export function Effects({ glitch = false }: { glitch?: boolean }) {
    return (
        <EffectComposer>
            <Bloom
                luminanceThreshold={0.2}
                mipmapBlur
                intensity={glitch ? 4.0 : 2.0}
                radius={0.5}
            />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            {/* Add more glitch effects here if desired */}
        </EffectComposer>
    )
}
