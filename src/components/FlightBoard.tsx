'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Flight } from '@/types/database'
import { supabase } from '@/lib/supabase'

interface Props {
  airportId: string
  initialArrivals: Flight[]
  initialDepartures: Flight[]
}

const STATUS_COLORS: Record<string, string> = {
  on_time: 'bg-green-100 text-green-800',
  scheduled: 'bg-blue-100 text-blue-800',
  delayed: 'bg-amber-100 text-amber-800',
  cancelled: 'bg-red-100 text-red-800',
  landed: 'bg-slate-100 text-slate-700',
  departed: 'bg-slate-100 text-slate-700',
  boarding: 'bg-purple-100 text-purple-800',
  gate_open: 'bg-teal-100 text-teal-800',
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function FlightBoard({ airportId, initialArrivals, initialDepartures }: Props) {
  const [arrivals, setArrivals] = useState<Flight[]>(initialArrivals)
  const [departures, setDepartures] = useState<Flight[]>(initialDepartures)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [isPending, startTransition] = useTransition()

  function handleRefresh() {
    startTransition(async () => {
      const { data } = await supabase
        .from('flights')
        .select('*')
        .eq('airport_id', airportId)
        .order('scheduled_time')
        .limit(50)

      if (data) {
        const typed = data as Flight[]
        setArrivals(typed.filter((f) => f.direction === 'arrival'))
        setDepartures(typed.filter((f) => f.direction === 'departure'))
        setLastRefreshed(new Date())
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Last updated: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isPending}
          aria-label="Refresh flight data"
        >
          {isPending ? 'Refreshing...' : '↻ Refresh'}
        </Button>
      </div>

      <Tabs defaultValue="departures">
        <TabsList>
          <TabsTrigger value="departures">
            Departures {departures.length > 0 && `(${departures.length})`}
          </TabsTrigger>
          <TabsTrigger value="arrivals">
            Arrivals {arrivals.length > 0 && `(${arrivals.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departures" className="mt-4">
          <FlightTable flights={departures} direction="departure" loading={isPending} />
        </TabsContent>
        <TabsContent value="arrivals" className="mt-4">
          <FlightTable flights={arrivals} direction="arrival" loading={isPending} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FlightTable({ flights, direction, loading }: { flights: Flight[]; direction: string; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-3xl mb-3">✈</p>
        <p>No {direction} flights listed</p>
        <p className="text-xs mt-1">Flight data is refreshed daily</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th className="px-4 py-3 font-medium">Flight</th>
            <th className="px-4 py-3 font-medium">Airline</th>
            <th className="px-4 py-3 font-medium">{direction === 'departure' ? 'Destination' : 'Origin'}</th>
            <th className="px-4 py-3 font-medium">Scheduled</th>
            <th className="px-4 py-3 font-medium">Estimated</th>
            <th className="px-4 py-3 font-medium">Gate</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight, i) => (
            <tr key={flight.id} className={`border-b last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
              <td className="px-4 py-3 font-mono font-semibold">{flight.flight_number}</td>
              <td className="px-4 py-3">{flight.airline}</td>
              <td className="px-4 py-3 font-mono">
                {direction === 'departure' ? flight.destination_iata : flight.origin_iata}
              </td>
              <td className="px-4 py-3">{formatTime(flight.scheduled_time)}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {flight.estimated_time ? formatTime(flight.estimated_time) : '—'}
              </td>
              <td className="px-4 py-3">{flight.gate ?? '—'}</td>
              <td className="px-4 py-3">
                {flight.status ? (
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[flight.status] ?? 'bg-slate-100 text-slate-700'}`}>
                    {flight.status.replace('_', ' ')}
                  </span>
                ) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
