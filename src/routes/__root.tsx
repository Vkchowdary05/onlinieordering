import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { MotionConfig } from 'framer-motion'
import { MediCareProvider } from '../context/MediCareContext'
import { ToastContainer } from '../components/v14/ToastContainer'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'light';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'MediCare - Hospital Appointment Booking System',
      },
      {
        name: 'description',
        content:
          'Modern healthcare appointment scheduling, patient portal, and hospital operations dashboard.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="dashboard-v14-bg antialiased min-h-screen selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        <MotionConfig reducedMotion="always" transition={{ duration: 0 }}>
          <MediCareProvider>
            {children}
            <ToastContainer />
          </MediCareProvider>
        </MotionConfig>
        <Scripts />
      </body>
    </html>
  )
}
