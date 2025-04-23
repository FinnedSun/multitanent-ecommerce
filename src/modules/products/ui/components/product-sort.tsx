"use client"

import React from 'react'
import { useProductFilters } from '../../hooks/use-product-filters'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const ProductSort = () => {
  const [filters, setFilters] = useProductFilters()

  return (
    <div className='flex items-center gap-2'>
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "cureted" && "bg-transparent border-transparent hover:bg-transparent hover:border"
        )}
        variant={"secondary"}
        onClick={() => setFilters({ sort: "cureted" })}
      >
        Cureted
      </Button>
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "trending" && "bg-transparent border-transparent hover:bg-transparent hover:border"
        )}
        variant={"secondary"}
        onClick={() => setFilters({ sort: "trending" })}
      >
        Trending
      </Button>
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "hot_and_new" && "bg-transparent border-transparent hover:bg-transparent hover:border"
        )}
        variant={"secondary"}
        onClick={() => setFilters({ sort: "hot_and_new" })}
      >
        Hot & New
      </Button>
    </div>
  )
}
