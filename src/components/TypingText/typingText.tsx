// TypingText.tsx

import React, { useState, useEffect } from 'react'
import PrettifyHTML from '../PretitterHtmls/pretitterhtml'

interface TypingTextProps {
  text: string
  speed?: number // Typing speed in milliseconds
  key?: number
}

const TypingText = React.forwardRef((props: TypingTextProps, ref: any) => {
  const { text, speed, key } = props
  const [currentText, setCurrentText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userScrolledUp, setUserScrolledUp] = useState(false)

  useEffect(() => {
    let timeout: any

    if (currentIndex <= text.length) {
      timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + (text[currentIndex] ?? ''))
        setCurrentIndex((prevIndex) => prevIndex + 1)
        if (!userScrolledUp && ref.current) {
          ref.current.scrollTop = ref.current.scrollHeight
        }
      }, speed)
    }

    return () => clearTimeout(timeout)
  }, [currentIndex, speed, text])

  const handleScroll = () => {
    if (ref.current) {
      setUserScrolledUp(ref.current.scrollTop < ref.current.scrollHeight - ref.current.clientHeight)
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('scroll', handleScroll)
      return () => ref.current.removeEventListener('scroll', handleScroll)
    }
  }, [ref])
  return <PrettifyHTML htmlString={currentText} />
})
TypingText.displayName = 'TypingText' // Add display name here

export default TypingText
