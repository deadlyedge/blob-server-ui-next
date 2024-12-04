"use client"

import { checkToken } from "@/actions/check"
import { listFiles } from "@/actions/list"
import { Header } from "@/components/header"
import { List } from "@/components/list"
import { FileInfoType } from "@/types"
import { useCookies } from "next-client-cookies"
import { useEffect, useState } from "react"

type UserInfo = {
  user: string
  token: string
} | null

export default function Home() {
  const cookies = useCookies()

  const [userInfo, setUserInfo] = useState<UserInfo>({
    user: cookies.get("user") as string,
    token: cookies.get("token") as string,
  })
  // const [filesInfo, setFilesInfo] = useState<FileInfoType[] | null>([])

  const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const response = await checkToken(e.target.value)
    if (response) {
      setUserInfo(response)
      cookies.set("user", response.user, {
        expires: new Date(Date.now() + 31536000000),
      }) // 1 year
      cookies.set("token", response.token, {
        expires: new Date(Date.now() + 31536000000),
      }) // 1 year
    } else {
      setUserInfo(null)
      cookies.remove("user")
      cookies.remove("token")
    }
  }

  return (
    <main>
      <Header userInfo={userInfo} handleOnChange={handleOnChange} />
      <List token={userInfo?.token} />
    </main>
  )
}
