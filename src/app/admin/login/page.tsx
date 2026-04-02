'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.replace('/admin')
      } else {
        const { error: msg } = await res.json()
        setError(msg || 'Incorrect password')
      }
    } catch {
      setError('Connection error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/images/majestic-logo-black.png"
            alt="Majestic"
            width={140}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Card */}
        <div className="bg-white border border-[rgba(0,0,0,0.08)] p-8">
          <h1 className="text-sm font-semibold uppercase tracking-widest text-[#0c0c0c] mb-1">
            Admin Panel
          </h1>
          <p className="text-xs text-[#888] mb-8">Majestic Furniture — Internal Access</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#484848] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full h-11 px-3 border border-[rgba(0,0,0,0.15)] bg-white text-sm text-[#0c0c0c] outline-none focus:border-[#0c0c0c] transition-colors"
                placeholder="Enter admin password"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full h-11 bg-[#0c0c0c] text-white text-sm font-medium tracking-wide hover:bg-[#2c2c2c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#aaa] mt-6">
          Majestic Furniture © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
