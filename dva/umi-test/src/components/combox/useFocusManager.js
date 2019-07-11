import { useState } from 'react'

const useFocusManager = () => {
  const [focused, setFocus] = useState(false)
  let timeoutId
  return {
    focused,
    setFocus,
    handleFocus: () => {
      clearTimeout(timeoutId)
      if (!focused) {
        setFocus(true)
      }
    },
    handleBlur: () => {
      timeoutId = setTimeout(() => {
        if (focused) {
          setFocus(false)
        }
      })
    },
  }
}

export { useFocusManager }
