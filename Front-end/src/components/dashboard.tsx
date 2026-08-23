import { useEffect, useMemo, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Edit3, LogOut, Plus, Search, Trash2, UserPlus, UsersRound, X } from 'lucide-react'
import axios from 'axios'
import api from '@/service/api'

type User = { id: string; name: string; email: string; age: number; createdAt?: string }
type DashboardProps = { accountName: string; onLogout: () => void }
type Toast = { type: 'success' | 'error'; text: string } | null

export default function Dashboard({ accountName, onLogout }: DashboardProps) {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<User | null>(null)
  const [deleting, setDeleting] = useState<User | null>(null)
  const [toast, setToast] = useState<Toast>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)

  async function loadUsers() {
    try {
      setLoading(true)
      const response = await api.get<User[]>('/usuarios')
      setUsers(response.data)
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) showToast('error', 'Nao foi possivel carregar os usuarios.')
    } finally { setLoading(false) }
  }

  useEffect(() => { void loadUsers() }, [])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const visibleUsers = useMemo(() => users.filter(user => `${user.name} ${user.email} ${user.age}`.toLowerCase().includes(search.trim().toLowerCase())), [users, search])
  const averageAge = users.length ? Math.round(users.reduce((sum, user) => sum + user.age, 0) / users.length) : 0

  function showToast(type: 'success' | 'error', text: string) { setToast({ type, text }) }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form))
    try {
      setSaving(true)
      if (editing) await api.put(`/usuarios/${editing.id}`, data)
      else await api.post('/usuarios', data)
      const successText = editing ? 'Usuario atualizado com sucesso.' : 'Usuario cadastrado com sucesso.'
      setEditing(null)
      form.reset()
      showToast('success', successText)
      await loadUsers()
    } catch (error) {
      const text = axios.isAxiosError(error) ? error.response?.data?.details?.[0]?.message ?? error.response?.data?.error : null
      showToast('error', text ?? 'Confira os dados e tente novamente.')
    } finally { setSaving(false) }
  }

  async function confirmDelete() {
    if (!deleting) return
    try {
      setRemoving(true)
      await api.delete(`/usuarios/${deleting.id}`)
      setDeleting(null)
      showToast('success', 'Usuario excluido com sucesso.')
      await loadUsers()
    } catch { showToast('error', 'Nao foi possivel excluir o usuario.') }
    finally { setRemoving(false) }
  }

  return <main className="min-h-screen overflow-hidden bg-void text-white">
    <div aria-hidden className="cyber-grid pointer-events-none fixed inset-0 opacity-25" />
    <div className="pointer-events-none fixed -left-40 top-1/3 size-96 rounded-full bg-blue-600/10 blur-[130px]" />
    <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-300/10"><UsersRound className="size-5 text-cyan-200" /></div><div><p className="text-xs uppercase tracking-[.22em] text-cyan-300">AuthFlow Control</p><h1 className="text-xl font-semibold">Painel de usuarios</h1></div></div>
        <div className="flex items-center gap-4"><p className="hidden text-sm text-slate-400 sm:block">Ola, <span className="text-white">{accountName}</span></p><button onClick={onLogout} className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-rose-300/30 hover:text-rose-200"><LogOut className="size-4" />Sair</button></div>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Usuarios cadastrados" value={users.length} icon={<UsersRound />} />
        <Stat label="Media de idade" value={averageAge ? `${averageAge} anos` : '—'} icon={<UserPlus />} />
        <Stat label="Resultados visiveis" value={visibleUsers.length} icon={<Search />} />
      </section>

      <section className="mt-6 grid items-start gap-6 lg:grid-cols-[360px_1fr]">
        <motion.form layout key={editing?.id ?? 'new'} onSubmit={save} className="rounded-2xl border border-cyan-200/15 bg-panel/85 p-6 shadow-holo backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.18em] text-cyan-300">Registro</p><h2 className="mt-1 text-xl font-semibold">{editing ? 'Editar usuario' : 'Novo usuario'}</h2></div>{editing && <button type="button" onClick={() => setEditing(null)} className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white" aria-label="Cancelar edicao"><X className="size-5" /></button>}</div>
          <DashField label="Nome" name="name" defaultValue={editing?.name} placeholder="Nome completo" minLength={2} maxLength={80} />
          <DashField label="Idade" name="age" defaultValue={editing?.age} placeholder="18" type="number" min="1" max="120" />
          <DashField label="E-mail" name="email" defaultValue={editing?.email} placeholder="email@exemplo.com" type="email" maxLength={120} />
          <motion.button whileTap={{ scale: .98 }} disabled={saving} className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 text-sm font-semibold text-slate-950 transition disabled:cursor-wait disabled:opacity-60">{saving ? <span className="loader loader-small" /> : <><Plus className="size-4" />{editing ? 'Salvar alteracoes' : 'Cadastrar usuario'}</>}</motion.button>
        </motion.form>

        <div className="min-w-0 rounded-2xl border border-white/10 bg-panel/70 p-5 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs uppercase tracking-[.18em] text-cyan-300">Base de dados</p><h2 className="mt-1 text-xl font-semibold">Usuarios cadastrados <span className="text-sm font-normal text-slate-500">({users.length})</span></h2></div><label className="flex h-11 w-full items-center gap-2 rounded-xl border border-white/10 bg-white/[.035] px-3 transition focus-within:border-cyan-300/40 sm:w-64"><Search className="size-4 shrink-0 text-slate-500" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Nome, email ou idade" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600" /></label></div>
          <div className="mt-5 space-y-3">{loading ? <LoadingList /> : visibleUsers.length === 0 ? <div className="grid place-items-center py-14 text-center"><UsersRound className="mb-3 size-8 text-slate-700" /><p className="text-slate-400">Nenhum usuario encontrado.</p><p className="mt-1 text-xs text-slate-600">Cadastre um novo usuario ou altere a pesquisa.</p></div> : visibleUsers.map((user, index) => <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .04, .24) }} key={user.id} className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-white/[.025] p-4 transition hover:border-cyan-300/20 sm:flex-row sm:items-center"><div className="min-w-0"><h3 className="truncate font-medium">{user.name}</h3><p className="mt-1 truncate text-sm text-slate-400">{user.email} · {user.age} anos</p></div><div className="flex shrink-0 gap-2"><button onClick={() => setEditing(user)} className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-cyan-300/25 hover:text-cyan-200" aria-label={`Editar ${user.name}`}><Edit3 className="size-4" /></button><button onClick={() => setDeleting(user)} className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:border-rose-300/25 hover:text-rose-300" aria-label={`Excluir ${user.name}`}><Trash2 className="size-4" /></button></div></motion.article>)}</div>
        </div>
      </section>
    </div>

    <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} role="status" className={`fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl ${toast.type === 'success' ? 'border-emerald-300/25 bg-emerald-950/90 text-emerald-100' : 'border-rose-300/25 bg-rose-950/90 text-rose-100'}`}>{toast.type === 'success' ? <CheckCircle2 className="size-5 text-emerald-300" /> : <AlertTriangle className="size-5 text-rose-300" />}{toast.text}<button onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100" aria-label="Fechar mensagem"><X className="size-4" /></button></motion.div>}</AnimatePresence>

    <AnimatePresence>{deleting && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-title" onMouseDown={event => { if (event.target === event.currentTarget && !removing) setDeleting(null) }}><motion.div initial={{ opacity: 0, scale: .96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .97 }} className="w-full max-w-md rounded-2xl border border-rose-300/20 bg-[#091426] p-6 shadow-2xl"><div className="grid size-11 place-items-center rounded-xl border border-rose-300/20 bg-rose-400/10"><AlertTriangle className="size-5 text-rose-300" /></div><h2 id="delete-title" className="mt-5 text-xl font-semibold">Excluir usuario?</h2><p className="mt-2 text-sm leading-6 text-slate-400">O registro de <strong className="font-medium text-white">{deleting.name}</strong> sera removido permanentemente. Esta acao nao pode ser desfeita.</p><div className="mt-6 flex justify-end gap-3"><button disabled={removing} onClick={() => setDeleting(null)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5">Cancelar</button><button disabled={removing} onClick={() => void confirmDelete()} className="flex min-w-24 items-center justify-center rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{removing ? <span className="loader loader-small" /> : 'Excluir'}</button></div></motion.div></motion.div>}</AnimatePresence>
  </main>
}

function Stat({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) { return <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-panel/60 p-4 backdrop-blur-md"><div className="grid size-10 place-items-center rounded-xl bg-cyan-300/10 text-cyan-200 [&>svg]:size-5">{icon}</div><div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-lg font-semibold">{value}</p></div></div> }
function LoadingList() { return <div className="space-y-3">{[1, 2, 3].map(item => <div key={item} className="h-[74px] animate-pulse rounded-xl border border-white/5 bg-white/[.025]" />)}</div> }
function DashField(props: InputHTMLAttributes<HTMLInputElement> & { label: string }) { const { label, ...inputProps } = props; return <label className="mb-4 block"><span className="field-label">{label}</span><input required {...inputProps} className="h-11 w-full rounded-xl border border-white/10 bg-white/[.035] px-4 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40" /></label> }
