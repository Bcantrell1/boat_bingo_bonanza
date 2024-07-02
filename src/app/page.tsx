import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex h-auto flex-col items-center p-24">
      <h1 className="text-4xl text-center font-bold mb-8">Boat Bingo Bonanza</h1>
      <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Start Playing
      </Link>
    </main>
  )
}