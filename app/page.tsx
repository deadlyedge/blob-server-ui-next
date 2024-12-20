import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { List } from "@/components/list"

export default function Home() {
  return (
    <main id="drop-zone" className='w-full h-full'>
      <Header />
      <List />
      <Footer />
    </main>
  )
}
