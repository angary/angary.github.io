import { ThemeProvider } from 'next-themes'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
