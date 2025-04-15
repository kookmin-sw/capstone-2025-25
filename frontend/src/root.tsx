import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import '@/styles/index.css';
import '@/styles/shadcn-global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AHZ</title>
        <meta property="og:title" content="AHZ" />
        <meta
          property="og:description"
          content="흩어진 생각을 정리하고, 일상 속 흐름을 바로 잡아주는 ADHD 맞춤형 서비스"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.ahz.co.kr/" />
        <meta property="og:site_name" content="AHZ" />
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
