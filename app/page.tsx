"use client"

import { useEffect, useState } from "react"
import { useCookies } from "next-client-cookies"
import { checkToken } from "@/actions/check"
import { getUsage } from "@/actions/usage"
import { Header } from "@/components/header"
import { List } from "@/components/list"
import { AuthenticatedUserType, UserUsageType } from "@/types"
import { useRefresh } from "@/components/providers"

// More descriptive type alias

export default function Home() {
  const cookies = useCookies() // Destructure for clarity
  const { refresh } = useRefresh()
  const [userToken, setUserToken] = useState<AuthenticatedUserType | null>(null) // More concise name

  const [usage, setUsage] = useState<UserUsageType | null>(null) // More concise name

  // Initialize user state from cookies on mount
  useEffect(() => {
    const initialUser = {
      user: cookies.get("user") as string,
      token: cookies.get("token") as string,
    }
    setUserToken(initialUser.user && initialUser.token ? initialUser : null)
  }, [cookies])

  const handleAuthentication = async (token: string) => {
    const response = await checkToken(token)
    if (response) {
      setUserToken(response)
      cookies.set("user", response.user, { path: "/", expires: 31536000 }) // 1 year
      cookies.set("token", response.token, { path: "/", expires: 31536000 }) // 1 year
    } else {
      setUserToken(null)
      cookies.remove("user", { path: "/" })
      cookies.remove("token", { path: "/" })
    }
  }

  useEffect(() => {
    const fetchUsage = async () => {
      if (userToken?.token) {
        const response = await getUsage(userToken)
        setUsage(response)
      }
    }
    fetchUsage()
  }, [userToken, refresh])

  return (
    <main>
      <Header
        userToken={userToken}
        usage={usage}
        onAuthentication={handleAuthentication}
      />
      {userToken ? (
        <List token={userToken.token} />
      ) : (
        <div className='fixed w-full h-full flex items-center justify-center'>
          Please use a valid token.
        </div>
      )}
    </main>
  )
}
