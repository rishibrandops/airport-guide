import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabaseAdmin } from '@/lib/supabase-server'
import { Airport, Flight, TransportConnection, Parking, FoodAndDrink, Lounge } from '@/types/database'
import FlightBoard from '@/components/FlightBoard'

interface Props {
  params: Promise<{ code: string }>
}

async function getAirport(code: string): Promise<Airport | null> {
  const { data } = await supabaseAdmin
    .from('airports')
    .select('*')
    .eq('iata_code', code.toUpperCase())
    .single()
  return data
}

async function getFlights(airportId: string): Promise<Flight[]> {
  const { data } = await supabaseAdmin
    .from('flights')
    .select('*')
    .eq('airport_id', airportId)
    .order('scheduled_time')
    .limit(50)
  return data ?? []
}

async function getTransport(airportId: string): Promise<TransportConnection[]> {
  const { data } = await supabaseAdmin
    .from('transport_connections')
    .select('*')
    .eq('airport_id', airportId)
    .order('type')
  return data ?? []
}

async function getParking(airportId: string): Promise<Parking[]> {
  const { data } = await supabaseAdmin
    .from('parking')
    .select('*')
    .eq('airport_id', airportId)
  return data ?? []
}

async function getFood(airportId: string): Promise<FoodAndDrink[]> {
  const { data } = await supabaseAdmin
    .from('food_and_drink')
    .select('*')
    .eq('airport_id', airportId)
    .order('name')
  return data ?? []
}

async function getLounges(airportId: string): Promise<Lounge[]> {
  const { data } = await supabaseAdmin
    .from('lounges')
    .select('*')
    .eq('airport_id', airportId)
    .order('name')
  return data ?? []
}

export async function generateMetadata({ params }: Props) {
  const { code } = await params
  const airport = await getAirport(code)
  if (!airport) return {}
  return {
    title: `${airport.name} (${airport.iata_code}) — Airport Guide`,
    description: `Flights, transport, weather, parking and amenities at ${airport.name}, ${airport.city}.`,
  }
}

export default async function AirportPage({ params }: Props) {
  const { code } = await params
  const airport = await getAirport(code)
  if (!airport) notFound()

  const [flights, transport, parking, food, lounges] = await Promise.all([
    getFlights(airport.id),
    getTransport(airport.id),
    getParking(airport.id),
    getFood(airport.id),
    getLounges(airport.id),
  ])

  const arrivals = flights.filter((f) => f.direction === 'arrival')
  const departures = flights.filter((f) => f.direction === 'departure')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/airports" className="hover:text-foreground transition-colors">Airports</Link>
        <span>/</span>
        <span>{airport.iata_code}</span>
      </div>

      {/* Hero */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-start gap-3">
          <Badge variant="secondary" className="text-2xl font-mono px-4 py-1">{airport.iata_code}</Badge>
          {airport.icao_code && (
            <Badge variant="outline" className="text-base font-mono px-3 py-1">{airport.icao_code}</Badge>
          )}
          {airport.is_international && (
            <Badge className="bg-blue-600 hover:bg-blue-600">International</Badge>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold">{airport.name}</h1>
        <p className="text-xl text-muted-foreground">{airport.city}, {airport.country}</p>

        {/* Quick stats */}
        <div className="flex flex-wrap gap-6 pt-2 text-sm">
          {airport.terminal_count && (
            <div>
              <p className="text-muted-foreground">Terminals</p>
              <p className="font-semibold">{airport.terminal_count}</p>
            </div>
          )}
          {airport.annual_passengers && (
            <div>
              <p className="text-muted-foreground">Annual passengers</p>
              <p className="font-semibold">{(airport.annual_passengers / 1_000_000).toFixed(1)}M</p>
            </div>
          )}
          {airport.timezone && (
            <div>
              <p className="text-muted-foreground">Timezone</p>
              <p className="font-semibold">{airport.timezone}</p>
            </div>
          )}
          {airport.continent && (
            <div>
              <p className="text-muted-foreground">Region</p>
              <p className="font-semibold">{airport.continent}</p>
            </div>
          )}
        </div>

        {/* Contact */}
        {(airport.phone || airport.email || airport.website_url) && (
          <div className="flex flex-wrap gap-4 pt-1 text-sm">
            {airport.phone && (
              <a href={`tel:${airport.phone}`} className="text-muted-foreground hover:text-foreground transition-colors">
                📞 {airport.phone}
              </a>
            )}
            {airport.email && (
              <a href={`mailto:${airport.email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                ✉ {airport.email}
              </a>
            )}
            {airport.website_url && (
              <a href={airport.website_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                🌐 Official website
              </a>
            )}
          </div>
        )}
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="flights">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="flights">Flights {flights.length > 0 && `(${flights.length})`}</TabsTrigger>
          <TabsTrigger value="transport">Transport {transport.length > 0 && `(${transport.length})`}</TabsTrigger>
          <TabsTrigger value="parking">Parking {parking.length > 0 && `(${parking.length})`}</TabsTrigger>
          <TabsTrigger value="food">Food & Drink {food.length > 0 && `(${food.length})`}</TabsTrigger>
          <TabsTrigger value="lounges">Lounges {lounges.length > 0 && `(${lounges.length})`}</TabsTrigger>
        </TabsList>

        {/* Flights */}
        <TabsContent value="flights" className="mt-6">
          <FlightBoard
            airportId={airport.id}
            initialArrivals={arrivals}
            initialDepartures={departures}
          />
        </TabsContent>

        {/* Transport */}
        <TabsContent value="transport" className="mt-6">
          {transport.length === 0 ? (
            <EmptyState icon="🚌" message="No transport connections listed yet" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {transport.map((t) => (
                <Card key={t.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{t.name}</CardTitle>
                      <Badge variant="outline" className="capitalize">{t.type.replace('_', ' ')}</Badge>
                    </div>
                    {t.operator && <p className="text-xs text-muted-foreground">{t.operator}</p>}
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    {t.destination && <p><span className="text-muted-foreground">To: </span>{t.destination}</p>}
                    {t.journey_time_minutes && <p><span className="text-muted-foreground">Journey: </span>{t.journey_time_minutes} min</p>}
                    {t.frequency_minutes && <p><span className="text-muted-foreground">Every: </span>{t.frequency_minutes} min</p>}
                    {t.operating_hours && <p><span className="text-muted-foreground">Hours: </span>{t.operating_hours}</p>}
                    {t.price_from && (
                      <p><span className="text-muted-foreground">From: </span>
                        {t.price_currency} {t.price_from.toFixed(2)}
                      </p>
                    )}
                    {t.description && <p className="text-muted-foreground text-xs pt-1">{t.description}</p>}
                    {t.booking_url && (
                      <a href={t.booking_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs underline text-blue-600 block pt-1">
                        Book →
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Parking */}
        <TabsContent value="parking" className="mt-6">
          {parking.length === 0 ? (
            <EmptyState icon="🅿️" message="No parking information listed yet" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {parking.map((p) => (
                <Card key={p.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{p.name}</CardTitle>
                      {p.type && <Badge variant="outline" className="capitalize text-xs">{p.type.replace('_', ' ')}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    {p.distance_to_terminal && <p><span className="text-muted-foreground">Distance: </span>{p.distance_to_terminal}</p>}
                    {p.price_per_day && (
                      <p><span className="text-muted-foreground">Per day: </span>
                        {p.price_currency} {p.price_per_day.toFixed(2)}
                      </p>
                    )}
                    {p.notes && <p className="text-muted-foreground text-xs pt-1">{p.notes}</p>}
                    {p.booking_url && (
                      <a href={p.booking_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs underline text-blue-600 block pt-1">
                        Book parking →
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Food & Drink */}
        <TabsContent value="food" className="mt-6">
          {food.length === 0 ? (
            <EmptyState icon="🍽️" message="No food & drink information listed yet" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {food.map((f) => (
                <Card key={f.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{f.name}</CardTitle>
                      {f.price_range && <Badge variant="outline">{f.price_range}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    {f.type && <p className="capitalize text-muted-foreground">{f.type.replace('_', ' ')}</p>}
                    {f.cuisine && <p><span className="text-muted-foreground">Cuisine: </span>{f.cuisine}</p>}
                    {f.terminal && <p><span className="text-muted-foreground">Terminal: </span>{f.terminal}</p>}
                    {f.airside && <Badge variant="secondary" className="text-xs">Airside</Badge>}
                    {f.opening_hours && <p><span className="text-muted-foreground">Hours: </span>{f.opening_hours}</p>}
                    {f.notes && <p className="text-muted-foreground text-xs pt-1">{f.notes}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Lounges */}
        <TabsContent value="lounges" className="mt-6">
          {lounges.length === 0 ? (
            <EmptyState icon="🛋️" message="No lounge information listed yet" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lounges.map((l) => (
                <Card key={l.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{l.name}</CardTitle>
                    {l.terminal && <p className="text-xs text-muted-foreground">Terminal {l.terminal}</p>}
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {l.access_methods && l.access_methods.length > 0 && (
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Access</p>
                        <div className="flex flex-wrap gap-1">
                          {l.access_methods.map((m) => (
                            <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {l.amenities && l.amenities.length > 0 && (
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Amenities</p>
                        <div className="flex flex-wrap gap-1">
                          {l.amenities.map((a) => (
                            <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {l.opening_hours && <p><span className="text-muted-foreground">Hours: </span>{l.opening_hours}</p>}
                    {l.price_per_visit && (
                      <p><span className="text-muted-foreground">Walk-in: </span>
                        {l.price_currency} {l.price_per_visit.toFixed(2)}
                      </p>
                    )}
                    {l.notes && <p className="text-muted-foreground text-xs">{l.notes}</p>}
                    {l.booking_url && (
                      <a href={l.booking_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs underline text-blue-600 block">
                        Book lounge access →
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <div className="text-center py-16 text-muted-foreground">
      <p className="text-4xl mb-3">{icon}</p>
      <p>{message}</p>
    </div>
  )
}
