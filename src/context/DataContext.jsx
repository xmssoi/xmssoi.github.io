import { createContext, useContext } from 'react'
import awardsData from '../data/awards.json'
import noipData from '../data/noip.json'
import cspData from '../data/csp.json'
import apioData from '../data/apio.json'
import noiData from '../data/noi.json'

const DataContext = createContext(null)

const value = {
  awards: awardsData,
  noip: noipData,
  csp: cspData,
  apio: apioData,
  noi: noiData,
}

export function DataProvider({ children }) {
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}