import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function Contacts() {
    const [contacts, setContacts] = useState([])
    const [name, setName] = useState('')
    const [relationship, setRelationship] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    

}