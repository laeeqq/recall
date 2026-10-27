import { useState } from 'react';
import { supabase } from './supabase';

export default function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { error } = isSignUp 
        ? await supabase.auth.signUp({ email,password})

        : await supabase.auth.signInWithPassword({ email,password})

        if (error) setMessage(error.message)
        setLoading(false)

    }

}
