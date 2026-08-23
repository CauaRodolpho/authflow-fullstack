import { useState, type FormEvent, type InputHTMLAttributes, type ReactElement } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Gamepad2, LockKeyhole, Mail, ShieldCheck, UserRound } from 'lucide-react'
import axios from 'axios'
import api from '@/service/api'
import { cn } from '@/lib/utils'

type Mode = 'login' | 'register'
export type AuthResult = { user: { name: string; email: string }; token: string }
type AuthSwitchProps = { onAuthenticated: (result: AuthResult) => void; notice?: string }

export default function AuthSwitch({ onAuthenticated, notice }: AuthSwitchProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage(null)
    const payload = Object.fromEntries(new FormData(event.currentTarget))
    try {
      const response = await api.post<AuthResult>(mode === 'login' ? '/auth/login' : '/auth/register', payload)
      localStorage.setItem('authflow_token', response.data.token)
      localStorage.setItem('authflow_user', JSON.stringify(response.data.user))
      onAuthenticated(response.data)
      setMessage({ type: 'success', text: `Acesso liberado. Bem-vindo, ${response.data.user.name}!` })
    } catch (error) {
      const text = axios.isAxiosError(error) ? error.response?.data?.details?.[0]?.message ?? error.response?.data?.error ?? 'Nao foi possivel acessar o servidor.' : 'Ocorreu um erro inesperado.'
      setMessage({ type: 'error', text })
    } finally { setLoading(false) }
  }

  function changeMode(next: Mode) { setMode(next); setMessage(null) }

  async function demoAccess() {
    setLoading(true); setMessage(null)
    try {
      const response = await api.post<AuthResult>('/auth/demo')
      localStorage.setItem('authflow_token', response.data.token)
      localStorage.setItem('authflow_user', JSON.stringify(response.data.user))
      onAuthenticated(response.data)
    } catch { setMessage({ type: 'error', text: 'Nao foi possivel iniciar o acesso demo.' }) }
    finally { setLoading(false) }
  }

  return <div className="w-full max-w-[460px] px-5 py-7 sm:p-9">
    <div className="mb-7 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-xl border border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_24px_rgba(56,189,248,.2)]"><ShieldCheck className="size-6 text-cyan-200" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">AuthFlow Gate</p><p className="text-sm text-slate-400">Conexao neural protegida</p></div></div>
    <div className="mb-7 grid grid-cols-2 rounded-xl border border-white/10 bg-white/[0.035] p-1" role="tablist">{(['login', 'register'] as Mode[]).map(item => <button key={item} type="button" onClick={() => changeMode(item)} className={cn('relative rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', mode === item ? 'text-white' : 'text-slate-400 hover:text-slate-200')}>{mode === item && <motion.span layoutId="auth-tab" className="absolute inset-0 rounded-lg border border-cyan-300/20 bg-cyan-300/10" />}<span className="relative">{item === 'login' ? 'Entrar' : 'Criar conta'}</span></button>)}</div>
    <AnimatePresence mode="wait"><motion.div key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .22 }}>
      <h1 className="text-3xl font-semibold tracking-tight text-white">{mode === 'login' ? 'Bem-vindo de volta' : 'Crie seu acesso'}</h1><p className="mt-2 text-sm leading-6 text-slate-400">{mode === 'login' ? 'Entre para continuar no seu ambiente virtual.' : 'Cadastre seus dados para abrir um novo acesso.'}</p>
      <form className="mt-7 space-y-4" onSubmit={submit}>
        {mode === 'register' && <Field icon={<UserRound />} label="Nome" name="name" placeholder="Seu nome" autoComplete="name" />}
        <Field icon={<Mail />} label="E-mail" name="email" placeholder="voce@email.com" type="email" autoComplete="email" />
        <label className="block"><span className="field-label">Senha</span><span className="field-shell group"><LockKeyhole className="size-4 text-slate-500 group-focus-within:text-cyan-300" /><input required minLength={mode === 'register' ? 8 : 1} maxLength={72} name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="••••••••" className="field-input" /><button type="button" onClick={() => setShowPassword(v => !v)} className="text-slate-500 transition hover:text-cyan-200" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></span></label>
        {mode === 'register' && <p className="text-xs text-slate-500">Use no minimo 8 caracteres. Letras, numeros e simbolos como @ # $ % sao permitidos.</p>}
        {(message || notice) && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status" className={cn('rounded-xl border px-4 py-3 text-sm', message?.type === 'success' ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' : notice ? 'border-amber-300/25 bg-amber-300/10 text-amber-100' : 'border-rose-400/25 bg-rose-400/10 text-rose-200')}>{message?.text ?? notice}</motion.p>}
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: .98 }} disabled={loading} className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(56,189,248,.2)] transition disabled:cursor-wait disabled:opacity-60">{loading ? <span className="loader loader-small" /> : <>{mode === 'login' ? 'Acessar sistema' : 'Criar acesso'}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></>}</motion.button>
      </form>
      {mode === 'login' && <><div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-[.18em] text-slate-600"><span className="h-px flex-1 bg-white/10" />ou<span className="h-px flex-1 bg-white/10" /></div><button type="button" disabled={loading} onClick={demoAccess} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[.06] text-sm font-medium text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 disabled:opacity-50"><Gamepad2 className="size-4" />Acessar demonstracao</button><p className="mt-2 text-center text-xs text-slate-500">Entrada imediata, sem cadastro.</p></>}
    </motion.div></AnimatePresence>
    <p className="mt-7 text-center text-[11px] uppercase tracking-[.18em] text-slate-600">Secure link · neural interface · v1.0</p>
  </div>
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { icon: ReactElement; label: string }
function Field({ icon, label, ...props }: FieldProps) { return <label className="block"><span className="field-label">{label}</span><span className="field-shell group"><span className="text-slate-500 group-focus-within:text-cyan-300 [&>svg]:size-4">{icon}</span><input required {...props} className="field-input" /></span></label> }
