import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { supabaseAdmin } from '@/lib/supabase-server'
import { Airport } from '@/types/database'
import SearchBar from '@/components/SearchBar'

async function getFeaturedAirports(): Promise<Airport[]> {
  const { data } = await supabaseAdmin
    .from('airports')
    .select('*')
    .order('annual_passengers', { ascending: false })
    .limit(6)
  return data ?? []
}

const continents = ['Europe', 'Asia', 'North America', 'Oceania', 'Africa', 'South America']

export default async function HomePage() {
  const featured = await getFeaturedAirports()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm">
            <span>✈</span>
            <span>International Airport Directory</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Find any airport,<br />anywhere in the world
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Search by airport name or IATA code. Get flights, transport connections,
            weather, parking, lounges, and more.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Browse by continent */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-semibold mb-6">Browse by region</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {continents.map((continent) => (
            <Link
              key={continent}
              href={`/airports?continent=${encodeURIComponent(continent)}`}
              className="border rounded-lg p-4 text-center hover:bg-muted transition-colors text-sm font-medium"
            >
              {continent}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured airports */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Busiest airports</h2>
            <Link href="/airports" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((airport) => (
              <AirportCard key={airport.id} airport={airport} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function AirportCard({ airport }: { airport: Airport }) {
  const passengers = airport.annual_passengers
    ? (airport.annual_passengers / 1_000_000).toFixed(1) + 'M pax/yr'
    : null

  return (
    <Link href={`/airport/${airport.iata_code}`}>
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{airport.country}</p>
              <h3 className="font-semibold leading-tight mt-0.5">{airport.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{airport.city}</p>
            </div>
            <Badge variant="secondary" className="text-base font-mono shrink-0">
              {airport.iata_code}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {airport.continent && <span>{airport.continent}</span>}
            {passengers && (
              <>
                <span>·</span>
                <span>{passengers}</span>
              </>
            )}
            {airport.terminal_count && (
              <>
                <span>·</span>
                <span>{airport.terminal_count} terminals</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
