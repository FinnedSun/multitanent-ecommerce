"use client"

import { TriangleAlertIcon } from 'lucide-react'
import React from 'react'

const ErrorPage = () => {
  return (
    <div className='border border-red-800 border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-red-50 w-full rounded-lg'>
      <TriangleAlertIcon />
      <p className="text-red-800">Someting went wrong</p>
    </div >
  )
}

export default ErrorPage