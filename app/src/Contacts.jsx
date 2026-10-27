import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [name, setName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadContacts() {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('name')

      if (error) setError(error.message)
      else setContacts(data)
      setLoading(false)
    }
    loadContacts()
  }, [])

  async function addContact(e) {
    e.preventDefault()
    if (!name.trim()) return

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        name: name.trim(),
        relationship: relationship.trim() || null,
      })
      .select()
      .single()

    if (error) {
      setError(error.message)
      return
    }

    setContacts([...contacts, data].sort((a, b) => a.name.localeCompare(b.name)))
    setName('')
    setRelationship('')
    setError('')
  }

  async function deleteContact(id) {
    if (!confirm('Delete this contact and all their conversations?')) return

    const { error } = await supabase.from('contacts').delete().eq('id', id)

    if (error) setError(error.message)
    else setContacts(contacts.filter((c) => c.id !== id))
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Your people</h2>

      <form onSubmit={addContact} className="flex gap-2 mb-6">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1 rounded-lg bg-slate-800 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          placeholder="Relationship (friend, client...)"
          value={relationship}
          onChange={(e) => setRelationship(e.target.value)}
          className="flex-1 rounded-lg bg-slate-800 text-white px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-4"
        >
          Add
        </button>
      </form>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : contacts.length === 0 ? (
        <p className="text-slate-400">No contacts yet. Add your first person above.</p>
      ) : (
        <ul className="space-y-2">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="flex items-center gap-3 bg-slate-800 rounded-lg p-3"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center">
                {contact.name[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{contact.name}</p>
                {contact.relationship && (
                  <p className="text-sm text-slate-400">{contact.relationship}</p>
                )}
              </div>
              <button
                onClick={() => deleteContact(contact.id)}
                className="text-sm text-slate-400 hover:text-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}