import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'STARTRADER AI Pioneer Program — Apply Now' },
      {
        name: 'description',
        content:
          'Join the STARTRADER AI Pioneer Program. 2-month enterprise AI accounts, training, and AI Leadership Awards for top performers.',
      },
      { property: 'og:title', content: 'STARTRADER AI Pioneer Program' },
      {
        property: 'og:description',
        content:
          'Apply for 2 months of enterprise AI access, hands-on learning, and a chance to win the AI Leadership Award.',
      },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-navy text-white antialiased">
        {children}
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
