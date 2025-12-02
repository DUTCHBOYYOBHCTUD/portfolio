import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, FlyControls, Environment } from '@react-three/drei'
import { Suspense, useState, useEffect } from 'react'
import { CyberText3D } from './components/CyberText3D'
import { AbstractBackground } from './components/AbstractBackground'
import { CameraRig } from './components/CameraRig'
import { Carousel } from './components/Carousel'
import { FloatingTerminal } from './components/FloatingTerminal'
import { ExpandedCard } from './components/ExpandedCard'
import { Effects } from './components/Effects'
import { HackerRoom } from './components/HackerRoom'
import { Fireworks } from './components/Fireworks'
import { InfiniteStars } from './components/InfiniteStars'
import { ShootingStars } from './components/ShootingStars'


function App() {
  const [expandedCard, setExpandedCard] = useState<any>(null)
  const [isFreeRoam, setIsFreeRoam] = useState(false)
  const [turbo, setTurbo] = useState(false)

  // Handle Turbo Boost
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setTurbo(true)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setTurbo(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <>
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        <div className="absolute top-4 right-4 pointer-events-auto">
          <button
            className="px-4 py-2 border border-green-500 text-green-500 font-mono text-sm uppercase tracking-widest hover:bg-green-500/20 backdrop-blur-sm transition-all cursor-pointer"
            onClick={() => setIsFreeRoam(!isFreeRoam)}
          >
            {isFreeRoam ? 'EXIT FREE ROAM' : 'ENTER FREE ROAM'}
          </button>
        </div>

        {/* Instructions Bar */}
        {isFreeRoam && (
          <div className="absolute bottom-4 left-4 pointer-events-auto">
            <div className="font-mono text-xs text-green-500/80 bg-black/80 p-4 rounded border border-green-500/30 backdrop-blur-md">
              <p className="font-bold mb-2 text-green-400">:: NAVIGATION SYSTEMS ::</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span>[W/A/S/D]</span> <span className="text-gray-400">MOVE</span>
                <span>[R/F]</span>     <span className="text-gray-400">ASCEND/DESCEND</span>
                <span>[SHIFT]</span>   <span className="text-gray-400">TURBO BOOST</span>
                <span>[MOUSE]</span>   <span className="text-gray-400">LOOK AROUND</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Canvas
        camera={{ position: [0, 0, 12], fov: 55 }}
        style={{ width: '100%', height: '100vh' }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={['#000000', 5, 30]} />

          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />

          <ScrollControls pages={4.5} damping={0.25}>
            <AbstractBackground />
            <ShootingStars isFreeRoam={isFreeRoam} />
            <Fireworks />
            <InfiniteStars />
            <group position={[0, -4, 0]}>
              <HackerRoom />
            </group>
            <Environment preset="city" blur={1} />

            <Scroll>
              {/* HERO SECTION */}
              <CyberText3D
                text="CHRIS KURIAKOSE"
                position={[0, 2.0, 0]}
                fontSize={1.5}
                color="#ffffff"
                delay={500}
                letterSpacing={0.9}
              />
              <CyberText3D
                text="UNOFFICIAL PENTESTER"
                position={[0, 0.8, 0]}
                fontSize={0.5}
                color="#ffffff"
                delay={1500}
                letterSpacing={0.9}
              />
              <CyberText3D
                text="CYBERSECURITY SPECIALIST"
                position={[0, 0.2, 0]}
                fontSize={0.5}
                color="#ffffff"
                delay={2000}
                letterSpacing={0.9}
              />

              <FloatingTerminal position={[0, -3.5, 0]} />
            </Scroll>

            <Carousel onCardClick={setExpandedCard} expandedCard={expandedCard} />

            {isFreeRoam ? (
              <FlyControls
                movementSpeed={turbo ? 30 : 10}
                rollSpeed={0.5}
                dragToLook={true}
              />
            ) : (
              <CameraRig activeCard={expandedCard} />
            )}
          </ScrollControls>

          {expandedCard && !isFreeRoam && (
            <ExpandedCard
              data={expandedCard}
              onClose={() => setExpandedCard(null)}
            />
          )}

          <Effects turbo={turbo} />
        </Suspense>
      </Canvas>
    </>
  )
}
export default App
