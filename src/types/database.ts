export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      airports: {
        Row: {
          annual_passengers: number | null
          city: string
          continent: string | null
          country: string
          country_code: string
          created_at: string | null
          email: string | null
          iata_code: string
          icao_code: string | null
          id: string
          is_international: boolean | null
          last_refreshed_at: string | null
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          terminal_count: number | null
          timezone: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          annual_passengers?: number | null
          city: string
          continent?: string | null
          country: string
          country_code: string
          created_at?: string | null
          email?: string | null
          iata_code: string
          icao_code?: string | null
          id?: string
          is_international?: boolean | null
          last_refreshed_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          terminal_count?: number | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          annual_passengers?: number | null
          city?: string
          continent?: string | null
          country?: string
          country_code?: string
          created_at?: string | null
          email?: string | null
          iata_code?: string
          icao_code?: string | null
          id?: string
          is_international?: boolean | null
          last_refreshed_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          terminal_count?: number | null
          timezone?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
      }
      flights: {
        Row: {
          actual_time: string | null
          airline: string
          airline_iata: string | null
          airport_id: string
          created_at: string | null
          destination_iata: string | null
          direction: string
          estimated_time: string | null
          flight_number: string
          gate: string | null
          id: string
          last_refreshed_at: string | null
          origin_iata: string | null
          scheduled_time: string
          status: string | null
          terminal: string | null
        }
      }
      food_and_drink: {
        Row: {
          airport_id: string
          airside: boolean | null
          created_at: string | null
          cuisine: string | null
          id: string
          name: string
          notes: string | null
          opening_hours: string | null
          price_range: string | null
          terminal: string | null
          type: string | null
          updated_at: string | null
        }
      }
      lounges: {
        Row: {
          access_methods: string[] | null
          airport_id: string
          amenities: string[] | null
          booking_url: string | null
          created_at: string | null
          id: string
          name: string
          notes: string | null
          opening_hours: string | null
          price_currency: string | null
          price_per_visit: number | null
          terminal: string | null
          updated_at: string | null
        }
      }
      parking: {
        Row: {
          airport_id: string
          booking_url: string | null
          created_at: string | null
          distance_to_terminal: string | null
          id: string
          name: string
          notes: string | null
          price_currency: string | null
          price_per_day: number | null
          type: string | null
          updated_at: string | null
        }
      }
      transport_connections: {
        Row: {
          airport_id: string
          booking_url: string | null
          created_at: string | null
          description: string | null
          destination: string | null
          frequency_minutes: number | null
          id: string
          journey_time_minutes: number | null
          name: string
          operating_hours: string | null
          operator: string | null
          price_currency: string | null
          price_from: number | null
          type: string
          updated_at: string | null
        }
      }
      weather_cache: {
        Row: {
          airport_id: string
          condition: string | null
          condition_icon: string | null
          feels_like_c: number | null
          fetched_at: string | null
          humidity_pct: number | null
          id: string
          temperature_c: number | null
          visibility_km: number | null
          wind_direction: string | null
          wind_speed_kmh: number | null
        }
      }
    }
  }
}

export type Airport = Database['public']['Tables']['airports']['Row']
export type Flight = Database['public']['Tables']['flights']['Row']
export type TransportConnection = Database['public']['Tables']['transport_connections']['Row']
export type Parking = Database['public']['Tables']['parking']['Row']
export type FoodAndDrink = Database['public']['Tables']['food_and_drink']['Row']
export type Lounge = Database['public']['Tables']['lounges']['Row']
export type WeatherCache = Database['public']['Tables']['weather_cache']['Row']
