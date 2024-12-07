"use client"

import { useEffect } from "react"
import { useCookies } from "next-client-cookies"
// import {  } from "@/actions/check"
import { getUsage, checkAuth } from "@/actions/actions"
import { Header } from "@/components/header"
import { List } from "@/components/list"
import { AuthenticatedUserType, UserUsageType } from "@/types"
// import { useRefresh } from "@/components/providers"
import { useAppStore } from "@/lib/store" // Import the store

export default function Home() {
  const cookies = useCookies()
  // const { refresh } = useRefresh()
  const { userToken, setUserToken, setUsage, refresh } = useAppStore() // Use the store

  useEffect(() => {
    const initialUser: AuthenticatedUserType | null = {
      user: cookies.get("user") || "",
      token: cookies.get("token") || "",
    }
    if (initialUser) setUserToken(initialUser)
  }, [])

  // useEffect(() => {
  //   if (userToken && userToken.token) {
  //     cookies.set("user", userToken.user, { path: "/", expires: 31536000 })
  //     cookies.set("token", userToken.token, { path: "/", expires: 31536000 })
  //   } else {
  //     // setUserToken(null)
  //     cookies.remove("user", { path: "/" })
  //     cookies.remove("token", { path: "/" })
  //   }
  // }, [userToken])

  useEffect(() => {
    const fetchUsage = async () => {
      if (userToken && userToken.token) {
        const response = await getUsage(userToken)
        // Assuming getUsage returns UserUsageType, handle it accordingly
        setUsage(response as UserUsageType) // Adjust this based on your actual usage handling
      }
    }
    fetchUsage()
  }, [userToken, refresh])

  return (
    <main>
      <Header />
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
