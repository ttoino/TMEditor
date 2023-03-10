import { ERROR_RETRIEVING_FIREBASE_DOCUMENT } from '@app/constants/logger-messages'
import logger from '@app/utils/logger'
import { FirebaseFiltersQuery } from '@types'
import { FirebaseError } from 'firebase/app'
import { collection, collectionGroup, Firestore, getDocs, query, QuerySnapshot, Timestamp, where } from 'firebase/firestore'

type DataArray = { [key: string]: any }

const getCloudFirestoreCollectionData = (snapshot: QuerySnapshot) => {
  const data: DataArray = {}

  snapshot.forEach(doc => {
    const docData = doc.data()
    const formattedDocData: DataArray = {}

    for (const key in docData) {
      let entry = docData[key]

      // Convert Firestore native timestamps
      if (entry instanceof Timestamp) {
        entry = entry.toDate()
      }

      formattedDocData[key] = entry
    }

    data[doc.id] = formattedDocData
  })
  return data
}

export const queryData = async (dbFirestore: Firestore, table: string, filters: FirebaseFiltersQuery[]) => {
  // TODO
  // - Review subcollections implementation
  try {
    const tableKey = getTableKey(table)
    const collectionReq = table.includes('/') ? collectionGroup(dbFirestore, tableKey) : collection(dbFirestore, tableKey)
    let q = query(collectionReq)

    // Add filters to the query
    filters.forEach(({ target, operator, value }) => {
      q = query(q, where(target, operator, value))
    })

    const querySnapshot = await getDocs(q)

    return getCloudFirestoreCollectionData(querySnapshot)
  } catch (error) {
    logger.error(ERROR_RETRIEVING_FIREBASE_DOCUMENT(<FirebaseError>error))
    throw error
  }
}

const getTableKey = (table: string) => {
  return table.includes('/') ? table.split('/')[1] : table
}
