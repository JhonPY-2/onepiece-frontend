export const API_URL =
  typeof window === 'undefined'
    ? process.env.API_URL_SERVER || 'http://localhost:3000'
    : 'http://localhost:3000';