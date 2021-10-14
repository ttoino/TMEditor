export const BASENAME = process.env.PUBLIC_URL || ''
export const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' + BASENAME : process.env.PUBLIC_URL
