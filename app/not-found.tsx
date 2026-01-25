import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-slate-700 bg-slate-900 shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-slate-800 border border-slate-700">
            <FileQuestion className="h-12 w-12 text-amber-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-100 mb-2">Page Not Found</h1>
        <p className="text-slate-400 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold">
          <Link href="/">
            Return Home
          </Link>
        </Button>
      </Card>
    </main>
  )
}
