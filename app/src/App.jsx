import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Auth from './Auth'
import Contacts from './Contacts'

export default function App() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white">
          Recall<span className="text-indigo-400">.</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">{session.user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm px-3 py-1"
          >
            Log out
          </button>
        </div>
      </header>
      <Contacts />
    </div>
  )
}