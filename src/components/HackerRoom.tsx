import { Grid } from '@react-three/drei'

export function HackerRoom() {
    // Minimalist "Floor Mesh" Version
    // No furniture, just the infinite grid and atmosphere

    return (
        <group dispose={null} position={[0, -2, 0]}>
            {/* Primary Floor Mesh (Grid) */}
            <Grid
                args={[30, 30]}
                cellColor="#ffffff"
                sectionColor="#ffffff"
                sectionThickness={1.5}
                cellThickness={0.6}
                fadeDistance={25}
                fadeStrength={1}
                infiniteGrid
            />

            {/* Secondary Faint Grid for Depth */}
            <Grid
                args={[30, 30]}
                cellColor="#888888"
                sectionColor="#888888"
                sectionThickness={1}
                cellThickness={0.5}
                fadeDistance={30}
                fadeStrength={0.5}
                infiniteGrid
                position={[0, -0.01, 0]} // Slightly below
            />

            {/* Floating Particles (Dust) - White/Cyan Mix */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={300}
                        array={new Float32Array(900).map(() => (Math.random() - 0.5) * 20)}
                        itemSize={3}
                        args={[new Float32Array(900).map(() => (Math.random() - 0.5) * 20), 3]}
                    />
                </bufferGeometry>
                <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.4} />
            </points>
        </group>
    )
}
