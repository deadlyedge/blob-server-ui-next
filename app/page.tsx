import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { List } from "@/components/list"

export default function Home() {
	return (
		<main className="h-screen flex flex-col">
			<Header />
			<div className="overflow-y-auto -mt-20 pt-20">
				<List />
				<Footer />
			</div>
		</main>
	)
}
