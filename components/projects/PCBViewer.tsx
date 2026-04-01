'use client'

import { Suspense, useRef, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Html, useProgress } from '@react-three/drei'
import { RotateCcw } from 'lucide-react'

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-sky-400 rounded-full animate-spin" />
        <p className="font-mono text-xs text-zinc-500">{Math.round(progress)}%</p>
      </div>
    </Html>
  )
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

interface PCBViewerProps {
  modelPath?: string
  className?: string
}

export default function PCBViewer({ modelPath, className = '' }: PCBViewerProps) {
  const [hintDismissed, setHintDismissed] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleInteraction = useCallback(() => {
    setHintDismissed(true)
    setAutoRotate(false)
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setAutoRotate(true), 3000)
  }, [])

  if (!modelPath) {
    return (
      <div className={`aspect-video bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <RotateCcw size={32} className="text-zinc-700 mx-auto mb-3" />
          <p className="font-mono text-xs text-zinc-600">No 3D model available</p>
          <p className="text-xs text-zinc-700 mt-1">Add a .glb file path to enable viewer</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 ${className}`}>
      <Canvas
        camera={{ position: [0, 0.5, 2.5], fov: 45 }}
        onPointerDown={handleInteraction}
        onWheel={handleInteraction}
      >
        <Suspense fallback={<Loader />}>
          <Environment preset="studio" />
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Model url={modelPath} />
          <OrbitControls
            autoRotate={autoRotate}
            autoRotateSpeed={0.8}
            enableDamping
            dampingFactor={0.08}
            minDistance={0.5}
            maxDistance={8}
            makeDefault
          />
        </Suspense>
      </Canvas>

      {!hintDismissed && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="bg-zinc-900/80 backdrop-blur border border-zinc-700/50 rounded-full px-4 py-2">
            <p className="font-mono text-xs text-zinc-400 whitespace-nowrap">
              Drag to rotate · Scroll to zoom
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
