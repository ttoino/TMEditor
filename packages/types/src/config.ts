import { DBConfig } from "./database"

export interface ResponseSiteConfig {
  title: string,
  usersDB: string,
  databases: DBConfig[],
  pages: PageName[]
}

export interface PageName {
  name: string,
  fileName: string
}