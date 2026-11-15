import { createContext, useContext, useState, useEffect } from 'react'
import { api, getToken } from './api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [checkingLogin, setCheckingLogin] = useState(() => Boolean(getToken()))

    useEffect(() => {
        function handleSessionExpired() {
            setUser(null)
        }
        window.addEventListener('session-expired', handleSessionExpired) // sent by api() when the token stops working

        // The token survives a page reload but the user doesn't, so we load the user again
        if (getToken()) {
            api('GET', '/api/users/me')
            .then((json) => setUser(json.data))
            .catch(() => {})
            .finally(() => setCheckingLogin(false))
        }

        return () => window.removeEventListener('session-expired', handleSessionExpired)
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, checkingLogin }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
