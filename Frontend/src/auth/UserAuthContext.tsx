"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  history?: string[]
}

interface UserAuthContextType {
  user: User | null
  isAuthenticated: boolean
  signIn: (userData: User) => void
  signOut: () => void
}

export const UserAuthContext = createContext<UserAuthContextType>({
  user: null,
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
})

interface UserAuthProviderProps {
  children: ReactNode
}

export function UserAuthProvider({ children }: UserAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setIsAuthenticated(true)
    }
  }, [])

  const signIn = (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const signOut = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  return (
    <UserAuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>{children}</UserAuthContext.Provider>
  )
}
