import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))
interface SplineSceneProps { scene: string; className?: string }
export function SplineScene({ scene, className }: SplineSceneProps) { return <Suspense fallback={<div className="grid h-full w-full place-items-center"><span className="loader" /></div>}><Spline scene={scene} className={className} /></Suspense> }
