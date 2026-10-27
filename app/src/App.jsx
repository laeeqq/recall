import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Auth from './Auth'

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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-white">
        Logged in as <span className="text-indigo-400">{session.user.email}</span>
      </h1>
      <button
        onClick={() => supabase.auth.signOut()}
        className="rounded-lg bg-slate-700 hover:bg-slate-600 text-white px-4 py-2"
      >
        Log out
      </button>
    </div>
  )
}