export default defineEventHandler((event) => {
  return {
    stations: [
      { id: 1, name: 'Berlin Station', location: 'Berlin' },
      { id: 2, name: 'Munich Station', location: 'Munich' },
      { id: 3, name: 'Hamburg Station', location: 'Hamburg' }
    ]
  }
}) 