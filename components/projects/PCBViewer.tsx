'use client'

import { Suspense, useRef, useState, useCallback, useEffect } from 'react'
import { Canvas, useThree, useLoader } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Html, useProgress, GizmoHelper, GizmoViewport } from '@react-three/drei'
import { Box3, Vector3, Object3D, PerspectiveCamera } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
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

function fitCamera(object: Object3D, camera: PerspectiveCamera) {
  const box = new Box3().setFromObject(object)
  const size = new Vector3()
  const center = new Vector3()
  box.getSize(size)
  box.getCenter(center)
  const maxDim = Math.max(size.x, size.y, size.z)
  const fovRad = (camera.fov * Math.PI) / 180
  const distance = (maxDim / (2 * Math.tan(fovRad / 2))) * 1.8
  camera.position.set(center.x, center.y + maxDim * 0.3, center.z + distance)
  camera.lookAt(center)
  camera.near = distance * 0.001
  camera.far = distance * 100
  camera.updateProjectionMatrix()
}

function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const { camera } = useThree()
  useEffect(() => { fitCamera(scene, camera as PerspectiveCamera) }, [scene, camera])
  return <primitive object={scene} />
}

function OBJModel({ url }: { url: string }) {
  const mtlUrl = url.replace(/\.obj$/i, '.mtl')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materials = useLoader(MTLLoader as any, mtlUrl) as MTLLoader.MaterialCreator
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const obj = useLoader(OBJLoader as any, url, (loader: OBJLoader) => {
    materials.preload()
    loader.setMaterials(materials)
  }) as Object3D
  const { camera } = useThree()
  useEffect(() => { fitCamera(obj, camera as PerspectiveCamera) }, [obj, camera])
  return <primitive object={obj} />
}

function Model({ url }: { url: string }) {
  return /\.obj$/i.test(url) ? <OBJModel url={url} /> : <GLTFModel url={url} />
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
        camera={{ position: [0, 1, 5], fov: 45, near: 0.001, far: 100000 }}
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
            minDistance={0}
            maxDistance={Infinity}
            makeDefault
          />
          <GizmoHelper alignment="top-right" margin={[72, 72]}>
            <GizmoViewport
              axisColors={['#e54d4d', '#4de54d', '#4d8be5']}
              labelColor="white"
            />
          </GizmoHelper>
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
