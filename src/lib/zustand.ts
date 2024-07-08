import { createWithEqualityFn } from 'zustand/traditional'
import { persist, devtools, createJSONStorage } from 'zustand/middleware'
import { get, set, del } from 'idb-keyval' // can use anything: IndexedDB, Ionic Storage, etc.
import reducer from './reducer'
const middlewares = (set: any, get: any) => ({
  ...reducer(set, get),
})

const storage = {
  getItem: async (name: any) => {
    return await get(name)
  },
  setItem: async (name: any, value: any) => {
    await set(name, value)
  },
  removeItem: async (name: any) => {
    await del(name)
  },
}

let useStore: any = persist(middlewares, {
  name: 'CareerUstad', // name of the item in the storage (must be unique)
  storage: createJSONStorage(() => storage),
})

if (process.env.NODE_ENV !== 'production') {
  useStore = devtools(useStore, { name: 'tracking' })
}

useStore = createWithEqualityFn(useStore)

export default useStore
