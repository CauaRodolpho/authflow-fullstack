import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import AuthSwitch from '@/components/ui/auth-switch'
import { Card } from '@/components/ui/card'
import { SplineScene } from '@/components/ui/splite'
import { Spotlight } from '@/components/ui/spotlight'
import Dashboard from '@/components/dashboard'
import type { AuthResult } from '@/components/ui/auth-switch'
import { useEffect, useState, type MouseEvent } from 'react'

export default function App() {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 45, damping: 24, mass: 1.2 })
  const smoothY = useSpring(pointerY, { stiffness: 45, damping: 24, mass: 1.2 })
  const gridX = useTransform(smoothX, [-1, 1], [-10, 10])
  const gridY = useTransform(smoothY, [-1, 1], [-8, 8])
  const savedUser = localStorage.getItem('authflow_user')
  const [session, setSession] = useState<AuthResult['user'] | null>(() => {
    if (!localStorage.getItem('authflow_token') || !savedUser) return null
    try { return JSON.parse(savedUser) } catch { return null }
  })
  const [authNotice, setAuthNotice] = useState('')

  useEffect(() => {
    const expired = () => { setSession(null); setAuthNotice('Sua sessao expirou. Entre novamente para continuar.') }
    window.addEventListener('authflow:expired', expired)
    return () => window.removeEventListener('authflow:expired', expired)
  }, [])

  function logout() {
    localStorage.removeItem('authflow_token'); localStorage.removeItem('authflow_user'); setSession(null); setAuthNotice('Sessao encerrada com seguranca.')
  }

  if (session) return <Dashboard accountName={session.name} onLogout={logout} />

  function moveGrid(event: MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1)
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1)
  }

  function centerGrid() { pointerX.set(0); pointerY.set(0) }

  return <main onMouseMove={moveGrid} onMouseLeave={centerGrid} className="relative grid min-h-screen place-items-center overflow-hidden bg-void px-4 py-8 text-white">
    <motion.div aria-hidden className="cyber-grid pointer-events-none absolute -inset-5 opacity-35" style={{ x: gridX, y: gridY }} /><div className="pointer-events-none absolute -left-32 top-1/4 size-80 rounded-full bg-blue-600/10 blur-[110px]" /><div className="pointer-events-none absolute -right-28 bottom-0 size-96 rounded-full bg-cyan-400/10 blur-[130px]" />
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease: 'easeOut' }} className="relative w-full max-w-5xl">
      <Card className="relative grid min-h-[650px] overflow-hidden border-cyan-200/15 bg-panel/80 backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
        <Spotlight size={340} />
        <section className="relative hidden overflow-hidden border-r border-white/10 lg:block" aria-label="Cena virtual interativa"><div className="absolute inset-x-0 top-0 z-10 p-9"><p className="text-xs font-medium uppercase tracking-[.25em] text-cyan-300">Virtual Access Layer</p><h2 className="mt-3 max-w-sm text-4xl font-semibold leading-tight">Sua identidade.<br /><span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">Seu proximo nivel.</span></h2><p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">Uma passagem segura para experiencias digitais, criada com uma interface holografica limpa e imersiva.</p></div><div className="absolute inset-0 top-28"><SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="h-full w-full" /></div><div className="pointer-events-none absolute bottom-7 left-8 flex items-center gap-2 text-[10px] uppercase tracking-[.22em] text-cyan-200/60"><span className="size-1.5 animate-pulse rounded-full bg-cyan-300" />3D neural interface online</div></section>
        <section className="relative flex items-center justify-center"><div className="pointer-events-none absolute left-1/2 top-6 h-px w-28 -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent lg:hidden" /><AuthSwitch notice={authNotice} onAuthenticated={result => { setSession(result.user); setAuthNotice('') }} /></section>
      </Card>
    </motion.div>
  </main>
}
