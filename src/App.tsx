import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll, FlyControls } from '@react-three/drei'
import { Carousel } from './components/Carousel'
import { FloatingTerminal } from './components/FloatingTerminal'
import { CyberText3D } from './components/CyberText3D'
import { AbstractBackground } from './components/AbstractBackground'
import { CameraRig } from './components/CameraRig'
import { ExpandedCard } from './components/ExpandedCard'
import { Effects } from './components/Effects'
import { HackerRoom } from './components/HackerRoom'
import { ShootingStars } from './components/ShootingStars'


function App() {
  const [expandedCard, setExpandedCard] = useState<any>(null)
  const [isFreeRoam, setIsFreeRoam] = useState(false)

  return (
    <div className="w-full h-screen bg-black text-white relative">
      {/* UI Overlay for Free Roam Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setIsFreeRoam(!isFreeRoam)}
          className="px-4 py-2 border border-green-500 text-green-500 font-mono text-sm uppercase tracking-widest hover:bg-green-500/20 backdrop-blur-sm transition-all cursor-pointer"
        >
          {isFreeRoam ? 'EXIT FREE ROAM' : 'ENTER FREE ROAM'}
        </button>
      </div>

      {isFreeRoam && (
        <div className="absolute bottom-4 left-4 z-50 pointer-events-none">
          <div className="font-mono text-xs text-green-500/50 bg-black/50 p-2 rounded border border-green-500/20">
            <p className="font-bold mb-1">CONTROLS:</p>
            <p>WASD - MOVE</p>
            <p>R/F - UP/DOWN</p>
            <p>CLICK & DRAG - LOOK</p>
          </div>
        </div>
      )}

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
            <ShootingStars />
            <HackerRoom />

            {isFreeRoam ? (
              <FlyControls
                movementSpeed={10}
                rollSpeed={0.5}
                dragToLook={true}
              />
            ) : (
              <CameraRig />
            )}

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

            {!expandedCard && (
              <Carousel onCardClick={setExpandedCard} />
            )}
          </ScrollControls>

          {expandedCard && !isFreeRoam && (
            <ExpandedCard
              data={expandedCard}
              onClose={() => setExpandedCard(null)}
            />
          )}

          <Effects />

        </Suspense>
      </Canvas>
    </div>
  )
}

export default App
