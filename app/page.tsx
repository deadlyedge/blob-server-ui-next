"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { List } from "@/components/list"
import { AuthenticatedUserType } from "@/types"
import { cookiesStorage, useAppStore } from "@/lib/store" // Import the store

export default function Home() {
  const { userToken, setUserToken, setUsage } = useAppStore() // Use the store

  useEffect(() => {
    const initialUser: AuthenticatedUserType | null = cookiesStorage.getItem()
    if (initialUser) setUserToken(initialUser)
  }, [setUserToken])

  useEffect(() => {
    setUsage() // Adjust this based on your actual usage handling
  }, [userToken, setUsage])

  return (
    <main className='w-full h-full'>
      <Header />
      {userToken?.user ? (
        <List />
      ) : (
        <div className='fixed w-full h-full flex items-center justify-center'>
          Please use a valid token.
        </div>
      )}
    </main>
  )
}
