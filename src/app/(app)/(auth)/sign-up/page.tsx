import { SignUpViews } from '@/modules/auth/ui/views/sign-up-view'
import { caller } from '@/trpc/server';
import { redirect } from 'next/navigation';
import React from 'react'

export const dynamic = "force-dynamic"

const SignUpPage = async () => {
  const session = await caller.auth.session();

  if (session.user) {
    redirect("/")
  }
  return <SignUpViews />
}

export default SignUpPage