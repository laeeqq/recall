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
            const {data, error} = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                setError(error.message)
            } else {
                setContacts(data)
            }
            setLoading(false)
        }
        loadContacts()
    }, [])

    async function addContact(e) {
        e.preventDefault()
        if (!name.trim()) return

        const {data, error} = await supabase 
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


}