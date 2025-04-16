import React from 'react'
import { Navbar } from './navbar'
import { Footer } from './footer'


const HomeLayout = ({ children }: {
  children: React.ReactNode
}) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='flex-1 bg-[#f4f4f4]'>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default HomeLayout