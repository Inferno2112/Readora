import React from 'react'

const Container = ({ children }) => {
  return (
    <div className='relative w-full max-w-7xl mx-auto px-6 lg:px-8'>
      {children}
    </div>
  )
}

export default Container
