"use client"

import { Button } from '@/components/ui/button';
import { generateTenantUrl } from '@/lib/utils';
import { CheckoutButton } from '@/modules/checkout/ui/components/checkout-button';
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query';
import { ShoppingCartIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface NavbarProps {
  slug: string;
};

export const Navbar = ({
  slug,
}: NavbarProps) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug, }))

  return (
    <nav className='h-20 border-b font-medium bg-white'>
      <div className='max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12'>
        <Link href={generateTenantUrl(slug)} className='flex items-center gap-2'>
          {data.image?.url && (
            < Image
              src={data.image.url}
              alt={slug}
              width={32}
              height={32}
              className='rounded-full border shrink-0 size-[32px]'
            />
          )}
          <p className='text-xl'>
            {data?.name}
          </p>
        </Link>
        <CheckoutButton
          hideIfEmpty
          tenantSlug={slug}
        />
      </div>
    </nav>
  )
}

export const NavbarSkeleton = () => {
  return (
    <nav className='h-20 border-b font-medium bg-white'>
      <div className='max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12'>
        <div />
        <Button className='bg-white' disabled>
          <ShoppingCartIcon className='text-black' />
        </Button>
      </div>
    </nav>
  )
}