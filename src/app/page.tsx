import LanguageSelector from '@/components/LanguageSelector'
import Dashboard from '@/components/Dashboard'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          MedExplain AI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Making health understanding universal, trustworthy, and accessible
        </p>
      </div>
      
      <LanguageSelector />
      <Dashboard />
    </main>
  )
}