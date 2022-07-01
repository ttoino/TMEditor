// ERRORS
export const ERROR_LOADING_YAML = "Couldn't open yaml file."
export const ERROR_RETRIEVING_FIREBASE_DOCUMENT = (error: Error) => `Error while retrieving document: ${error}`
export const ERROR_CACHE = (error: any) => `Cache client error: ${error}.`
export const INVALID_FHIR_SUBTYPE = (id: string) => `Invalid FHIR subtype in ${id}.`
export const ERROR_FETCHING_FHIR_DATA = (error: string) => `Error retrieving FHIR data: ${error}.`

// INFO's
export const SIGN_IN_FAILED = (code: number | string, message: string) => `Sign In failed with code: ${code} with message: ${message}.`
export const SUCCESSFULLY_CONNECTED_TO_DB = (id: string) => `Connection to ${id} has been established successfully.`
export const STARTED_LISTENING = (port: number) => `Server started listening on port ${port}!`
export const CACHE_CONNECTED = 'Redis cache connected.'

// WARNS
export const CACHE_NOT_CONNECTED = (error: string) => `Cache not connected: ${error}.`
