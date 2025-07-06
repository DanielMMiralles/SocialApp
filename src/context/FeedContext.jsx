import { createContext, useContext, useState } from 'react'

const FeedContext = createContext()

export const useFeedFilter = () => {
  const context = useContext(FeedContext)
  if (!context) {
    throw new Error('useFeedFilter must be used within a FeedProvider')
  }
  return context
}

export const FeedProvider = ({ children }) => {
  const [showFollowingOnly, setShowFollowingOnly] = useState(false)

  return (
    <FeedContext.Provider value={{
      showFollowingOnly,
      setShowFollowingOnly
    }}>
      {children}
    </FeedContext.Provider>
  )
}