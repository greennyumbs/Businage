'use client'

import {NextUIProvider} from '@nextui-org/react';
import {useRouter} from 'next/navigation'

export function Providers({children}) {
  const router = useRouter();

  return (
    <NextUIProvider navigate={router.push}>
    {/* This is to enable website to use client-side routing
    See here for more info: https://nextui.org/docs/guide/routing https://nextjs.org/learn-pages-router/basics/navigate-between-pages/client-side */}
      {children}
    </NextUIProvider>
  )
}