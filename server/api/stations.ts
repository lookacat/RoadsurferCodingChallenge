import type { ExternalStation, Station } from '~/types/station'

export default defineEventHandler(async (event) => {
  try {
    const response = await fetch('https://605c94c36d85de00170da8b4.mockapi.io/stations')
    const stations: ExternalStation[] = await response.json()
    
    // Filter out station id 7 since it seems to be a nonsense station
    return {
      stations: stations
        .filter(station => station.id !== '7')
        .map((station): Station => ({
          id: station.id,
          name: station.name,
          location: station.name
        }))
    }
  } catch (error) {
    console.error('Error fetching stations:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch stations'
    })
  }
}) 