"use client"

import { useEffect } from "react"
import { useCookies } from "next-client-cookies"
import { getUsage, checkAuth } from "@/actions/actions"
import { Header } from "@/components/header"
import { List } from "@/components/list"
import { AuthenticatedUserType, UserUsageType } from "@/types"
import { useAppStore } from "@/lib/store" // Import the store
import { useQuery } from "@tanstack/react-query"

export default function Home() {
  const cookies = useCookies()
  const { userToken, setUserToken, setUsage, refresh } = useAppStore() // Use the store

  useEffect(() => {
    const initialUser: AuthenticatedUserType | null = {
      user: cookies.get("user") as string,
      token: cookies.get("token") as string,
    }
    if (initialUser) setUserToken(initialUser)
  }, [])

  const { data: authQuery, isSuccess: authQuerySuccess } = useQuery({
    queryKey: ["auth", userToken?.token],
    queryFn: () => checkAuth(userToken?.token ?? ""), // Handle undefined token
    enabled: !!userToken?.token,
  })
  if (authQuerySuccess) setUserToken(authQuery)

  const handleAuthentication = async (token: string) => {
    const response = await checkAuth(token)
    if (response) {
      setUserToken(response)
    } else {
      setUserToken(null)
    }
  }

  const { data: usageQuery, isSuccess: usageQuerySuccess } = useQuery({
    queryKey: ["usage", userToken?.token],
    queryFn: () => getUsage(userToken!), // Handle potential null userToken
    enabled: !!userToken?.token,
  })
  if (usageQuerySuccess) setUsage(usageQuery)

  useEffect(() => {
    if (userToken && userToken.token) {
      cookies.set("user", userToken.user, { path: "/", expires: 31536000 })
      cookies.set("token", userToken.token, { path: "/", expires: 31536000 })
    } else {
      cookies.remove("user", { path: "/" })
      cookies.remove("token", { path: "/" })
    }
  }, [userToken, cookies])

  return (
    <main>
      <Header onAuthentication={handleAuthentication} />
      {userToken ? (
        <List />
      ) : (
        <div className='fixed w-full h-full flex items-center justify-center'>
          Please use a valid token.
        </div>
      )}
    </main>
  )
}
