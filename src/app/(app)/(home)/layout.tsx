import configPromise from '@payload-config'
import { getPayload } from 'payload'


import React from 'react'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { SearchFilters } from './search-filters'
import { Category } from '@/payload-types'



const HomeLayout = async ({ children }: {
  children: React.ReactNode
}) => {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'categories',
    depth: 1, // 1 level deep
    pagination: false, // Get all documents, no pagination
    where: {
      parent: {
        exists: false,
      },
    }
  })

  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      ...(doc as Category),
      // ...doc,
      subcategories: undefined,
    }))
  }))

  console.log(
    data,
    formattedData
  )

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className='flex-1 bg-[#f4f4f4]'>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default HomeLayout