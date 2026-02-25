'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { Airport } from '@/types/database'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Airport[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    const timeout = setTimeout(async () => {
      setLoading(true)
      const upper = query.trim().toUpperCase()
      const { data } = await supabase
        .from('airports')
        .select('id, iata_code, name, city, country, country_code')
        .or(`iata_code.eq.${upper},name.ilike.%${query.trim()}%,city.ilike.%${query.trim()}%`)
        .limit(8)
      setResults(data ?? [])
      setOpen(true)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  function handleSelect(airport: Airport) {
    setOpen(false)
    setQuery('')
    router.push(`/airport/${airport.iata_code}`)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && query.trim().length >= 2) {
      setOpen(false)
      router.push(`/airports?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by airport name or IATA code (e.g. LHR, Heathrow)"
          className="pl-11 h-14 text-base bg-white text-slate-900 border-0 shadow-lg rounded-xl"
          aria-label="Search airports"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">...</span>
        )}
      </div>

      {open && results.length > 0 && (
        <div
          className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border z-50 overflow-hidden"
          role="listbox"
        >
          {results.map((airport) => (
            <button
              key={airport.id}
              onClick={() => handleSelect(airport)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
              role="option"
            >
              <span className="font-mono font-bold text-slate-700 w-12 shrink-0">{airport.iata_code}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{airport.name}</p>
                <p className="text-xs text-slate-500">{airport.city}, {airport.country}</p>
              </div>
            </button>
          ))}
          <button
            onClick={() => {
              setOpen(false)
              router.push(`/airports?search=${encodeURIComponent(query.trim())}`)
            }}
            className="w-full px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 border-t text-left"
          >
            See all results for &ldquo;{query}&rdquo; →
          </button>
        </div>
      )}
    </div>
  )
}
