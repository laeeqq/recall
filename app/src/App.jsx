import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function App() {
  const [status, setStatus] = useState('Checking connection...')

  useEffect(() => {
    async function checkConnection() {
      const { error } = await supabase.auth.getSession()
      if (error) {
        setStatus('Connection failed: ' + error.message)
      } else {
        setStatus('Connected to Supabase ✅')
      }
    }
    checkConnection()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <h1 className="text-2xl font-bold text-white">{status}</h1>
    </div>
  )
}