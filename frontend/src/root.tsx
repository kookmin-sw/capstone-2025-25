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
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GKS1P1FHDB"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-GKS1P1FHDB', { send_page_view: false });
    `,
          }}
        ></script>

        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Bubble Pop</title>
        <meta property="og:title" content="Bubble Pop" />
        <meta
          property="og:description"
          content="머릿속을 맑게, 오늘을 명확하게"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.bubble-pop.kr/" />
        <meta property="og:site_name" content="Bubble Pop" />
        <meta property="og:image" content="/pwa-512x512.png" />
        <meta
          property="og:image:alt"
          content="Bubble Pop - 머릿속을 맑게, 오늘을 명확하게"
        />

        <link rel="manifest" href="/manifest.json" />

        <Meta />
        <Links />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/logo.svg" sizes="any" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
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
