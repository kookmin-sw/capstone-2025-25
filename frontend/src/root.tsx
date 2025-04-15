import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import '@/styles/index.css';
import '@/styles/shadcn-global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

export function meta() {
  return [
    { title: 'AHZ' },
    {
      property: 'og:title',
      content: 'AHZ',
    },
    {
      property: 'og:description',
      content:
        '흩어진 생각을 정리하고, 일상 속 흐름을 바로 잡아주는 ADHD 맞춤형 서비스',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://www.ahz.co.kr/',
    },
    {
      property: 'og:site_name',
      content: 'AHZ',
    },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Outlet />
    </QueryClientProvider>
  );
}
