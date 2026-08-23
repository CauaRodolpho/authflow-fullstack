import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform, type SpringOptions } from 'framer-motion'
import { cn } from '@/lib/utils'
type SpotlightProps = { className?: string; size?: number; springOptions?: SpringOptions }
export function Spotlight({ className, size = 260, springOptions = { bounce: 0 } }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null); const [parent, setParent] = useState<HTMLElement | null>(null); const [hovered, setHovered] = useState(false)
  const x = useSpring(0, springOptions); const y = useSpring(0, springOptions); const left = useTransform(x, v => `${v - size / 2}px`); const top = useTransform(y, v => `${v - size / 2}px`)
  useEffect(() => { const element = ref.current?.parentElement; if (element) setParent(element) }, [])
  const move = useCallback((event: MouseEvent) => { if (!parent) return; const rect = parent.getBoundingClientRect(); x.set(event.clientX - rect.left); y.set(event.clientY - rect.top) }, [parent, x, y])
  useEffect(() => { if (!parent) return; const enter = () => setHovered(true); const leave = () => setHovered(false); parent.addEventListener('mousemove', move); parent.addEventListener('mouseenter', enter); parent.addEventListener('mouseleave', leave); return () => { parent.removeEventListener('mousemove', move); parent.removeEventListener('mouseenter', enter); parent.removeEventListener('mouseleave', leave) } }, [parent, move])
  return <motion.div ref={ref} aria-hidden className={cn('pointer-events-none absolute rounded-full bg-cyan-300/20 blur-3xl transition-opacity duration-300', hovered ? 'opacity-100' : 'opacity-30', className)} style={{ width: size, height: size, left, top }} />
}
