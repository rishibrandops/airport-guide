/**
 * Seed airports from OurAirports public dataset
 * Source: https://davidmegginson.github.io/ourairports-data/airports.csv
 *
 * Run with: npx tsx scripts/seed-airports.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const AIRPORTS_CSV_URL = 'https://davidmegginson.github.io/ourairports-data/airports.csv'
const COUNTRIES_CSV_URL = 'https://davidmegginson.github.io/ourairports-data/countries.csv'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Continent mapping by ISO country code (broad coverage)
const CONTINENT_MAP: Record<string, string> = {
  AF: 'Africa', DZ: 'Africa', AO: 'Africa', BJ: 'Africa', BW: 'Africa',
  BF: 'Africa', BI: 'Africa', CM: 'Africa', CV: 'Africa', CF: 'Africa',
  TD: 'Africa', KM: 'Africa', CG: 'Africa', CD: 'Africa', CI: 'Africa',
  DJ: 'Africa', EG: 'Africa', GQ: 'Africa', ER: 'Africa', ET: 'Africa',
  GA: 'Africa', GM: 'Africa', GH: 'Africa', GN: 'Africa', GW: 'Africa',
  KE: 'Africa', LS: 'Africa', LR: 'Africa', LY: 'Africa', MG: 'Africa',
  MW: 'Africa', ML: 'Africa', MR: 'Africa', MU: 'Africa', MA: 'Africa',
  MZ: 'Africa', NA: 'Africa', NE: 'Africa', NG: 'Africa', RE: 'Africa',
  RW: 'Africa', ST: 'Africa', SN: 'Africa', SC: 'Africa', SL: 'Africa',
  SO: 'Africa', ZA: 'Africa', SS: 'Africa', SD: 'Africa', SZ: 'Africa',
  TZ: 'Africa', TG: 'Africa', TN: 'Africa', UG: 'Africa', EH: 'Africa',
  ZM: 'Africa', ZW: 'Africa',

  AS: 'Oceania', AU: 'Oceania', FJ: 'Oceania', GU: 'Oceania', KI: 'Oceania',
  MH: 'Oceania', FM: 'Oceania', NR: 'Oceania', NC: 'Oceania', NZ: 'Oceania',
  NU: 'Oceania', NF: 'Oceania', MP: 'Oceania', PW: 'Oceania', PG: 'Oceania',
  PH: 'Oceania', WS: 'Oceania', SB: 'Oceania', TL: 'Oceania', TO: 'Oceania',
  TV: 'Oceania', VU: 'Oceania', WF: 'Oceania',

  AF2: 'Asia', AM: 'Asia', AZ: 'Asia', BH: 'Asia', BD: 'Asia', BT: 'Asia',
  BN: 'Asia', KH: 'Asia', CN: 'Asia', CY: 'Asia', GE: 'Asia', HK: 'Asia',
  IN: 'Asia', ID: 'Asia', IR: 'Asia', IQ: 'Asia', IL: 'Asia', JP: 'Asia',
  JO: 'Asia', KZ: 'Asia', KW: 'Asia', KG: 'Asia', LA: 'Asia', LB: 'Asia',
  MO: 'Asia', MY: 'Asia', MV: 'Asia', MN: 'Asia', MM: 'Asia', NP: 'Asia',
  KP: 'Asia', OM: 'Asia', PK: 'Asia', PS: 'Asia', QA: 'Asia', SA: 'Asia',
  SG: 'Asia', KR: 'Asia', LK: 'Asia', SY: 'Asia', TW: 'Asia', TJ: 'Asia',
  TH: 'Asia', TR: 'Asia', TM: 'Asia', AE: 'Asia', UZ: 'Asia', VN: 'Asia',
  YE: 'Asia',

  AL: 'Europe', AD: 'Europe', AT: 'Europe', BY: 'Europe', BE: 'Europe',
  BA: 'Europe', BG: 'Europe', HR: 'Europe', CZ: 'Europe', DK: 'Europe',
  EE: 'Europe', FI: 'Europe', FR: 'Europe', DE: 'Europe', GR: 'Europe',
  HU: 'Europe', IS: 'Europe', IE: 'Europe', IT: 'Europe', XK: 'Europe',
  LV: 'Europe', LI: 'Europe', LT: 'Europe', LU: 'Europe', MK: 'Europe',
  MT: 'Europe', MD: 'Europe', MC: 'Europe', ME: 'Europe', NL: 'Europe',
  NO: 'Europe', PL: 'Europe', PT: 'Europe', RO: 'Europe', RU: 'Europe',
  SM: 'Europe', RS: 'Europe', SK: 'Europe', SI: 'Europe', ES: 'Europe',
  SE: 'Europe', CH: 'Europe', UA: 'Europe', GB: 'Europe', VA: 'Europe',

  AG: 'North America', BS: 'North America', BB: 'North America', BZ: 'North America',
  CA: 'North America', CR: 'North America', CU: 'North America', DM: 'North America',
  DO: 'North America', SV: 'North America', GD: 'North America', GT: 'North America',
  HT: 'North America', HN: 'North America', JM: 'North America', MX: 'North America',
  NI: 'North America', PA: 'North America', KN: 'North America', LC: 'North America',
  VC: 'North America', TT: 'North America', US: 'North America',

  AR: 'South America', BO: 'South America', BR: 'South America', CL: 'South America',
  CO: 'South America', EC: 'South America', GY: 'South America', PY: 'South America',
  PE: 'South America', SR: 'South America', UY: 'South America', VE: 'South America',

  AQ: 'Antarctica',
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n')
  const headers = parseCSVLine(lines[0])
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h.trim()] = (values[i] ?? '').trim() })
    return row
  })
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}

async function fetchCSV(url: string): Promise<string> {
  console.log(`Fetching: ${url}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.text()
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  }

  // Fetch both CSVs
  const [airportsCsv, countriesCsv] = await Promise.all([
    fetchCSV(AIRPORTS_CSV_URL),
    fetchCSV(COUNTRIES_CSV_URL),
  ])

  // Build country name map: iso_code -> name
  const countryRows = parseCSV(countriesCsv)
  const countryNames: Record<string, string> = {}
  for (const row of countryRows) {
    if (row.code) countryNames[row.code] = row.name
  }

  // Parse airports
  const allAirports = parseCSV(airportsCsv)
  console.log(`Total airports in dataset: ${allAirports.length}`)

  // Filter: large or medium airports with a valid IATA code
  const filtered = allAirports.filter((a) =>
    (a.type === 'large_airport' || a.type === 'medium_airport') &&
    a.iata_code &&
    a.iata_code.length === 3 &&
    a.name
  )
  console.log(`After filtering (large/medium + IATA): ${filtered.length}`)

  // Transform to our schema
  const airports = filtered.map((a) => ({
    iata_code: a.iata_code.toUpperCase(),
    icao_code: a.ident || null,
    name: a.name,
    city: a.municipality || a.name,
    country: countryNames[a.iso_country] || a.iso_country,
    country_code: a.iso_country,
    continent: CONTINENT_MAP[a.iso_country] ?? a.continent ?? null,
    latitude: a.latitude_deg ? parseFloat(a.latitude_deg) : null,
    longitude: a.longitude_deg ? parseFloat(a.longitude_deg) : null,
    timezone: null,
    is_international: a.type === 'large_airport',
    last_refreshed_at: new Date().toISOString(),
  }))

  // Upsert in batches of 200
  const BATCH = 200
  let inserted = 0
  let errors = 0

  for (let i = 0; i < airports.length; i += BATCH) {
    const batch = airports.slice(i, i + BATCH)
    const { error } = await supabase
      .from('airports')
      .upsert(batch, { onConflict: 'iata_code', ignoreDuplicates: false })

    if (error) {
      console.error(`Batch ${Math.floor(i / BATCH) + 1} error:`, error.message)
      errors++
    } else {
      inserted += batch.length
      process.stdout.write(`\rInserted: ${inserted}/${airports.length}`)
    }
  }

  console.log(`\n\nDone! ${inserted} airports upserted, ${errors} batch errors.`)

  // Final count
  const { count } = await supabase
    .from('airports')
    .select('*', { count: 'exact', head: true })
  console.log(`Total airports in database: ${count}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
