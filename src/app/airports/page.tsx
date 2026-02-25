import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { supabaseAdmin } from '@/lib/supabase-server'
import { Airport } from '@/types/database'

interface Props {
  searchParams: Promise<{ search?: string; continent?: string; country?: string }>
}

async function getAirports(search?: string, continent?: string, country?: string): Promise<Airport[]> {
  let query = supabaseAdmin.from('airports').select('*').order('name')

  if (search) {
    const upper = search.toUpperCase()
    query = query.or(`iata_code.eq.${upper},name.ilike.%${search}%,city.ilike.%${search}%,country.ilike.%${search}%`)
  }
  if (continent) query = query.eq('continent', continent)
  if (country) query = query.eq('country', country)

  const { data } = await query.limit(100)
  return data ?? []
}

export default async function AirportsPage({ searchParams }: Props) {
  const params = await searchParams
  const { search, continent, country } = params
  const airports = await getAirports(search, continent, country)

  const title = search
    ? `Results for "${search}"`
    : continent
    ? `${continent} Airports`
    : country
    ? `${country} Airports`
    : 'All Airports'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span>Airports</span>
          {continent && (
            <>
              <span>/</span>
              <span>{continent}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground mt-1">
          {airports.length} airport{airports.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Continent filters */}
      {!search && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/airports">
            <Badge variant={!continent ? 'default' : 'outline'} className="cursor-pointer">All</Badge>
          </Link>
          {['Europe', 'Asia', 'North America', 'Oceania', 'Africa', 'South America'].map((c) => (
            <Link key={c} href={`/airports?continent=${encodeURIComponent(c)}`}>
              <Badge variant={continent === c ? 'default' : 'outline'} className="cursor-pointer">{c}</Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Grid */}
      {airports.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-4">✈</p>
          <p className="text-lg font-medium">No airports found</p>
          <p className="text-sm mt-1">Try a different search term or browse by region</p>
          <Link href="/airports" className="text-sm underline mt-4 inline-block">
            View all airports
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {airports.map((airport) => (
            <Link key={airport.id} href={`/airport/${airport.iata_code}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground truncate">{airport.country}</p>
                      <h3 className="font-medium text-sm leading-tight truncate mt-0.5">{airport.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{airport.city}</p>
                    </div>
                    <Badge variant="secondary" className="font-mono shrink-0 text-sm">
                      {airport.iata_code}
                    </Badge>
                  </div>
                  {airport.continent && (
                    <p className="text-xs text-muted-foreground">{airport.continent}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
