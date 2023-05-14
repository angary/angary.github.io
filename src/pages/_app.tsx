import { MathJaxContext } from "better-react-mathjax";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";
import {
  config as mathJaxConfig,
  version as mathJaxVersion,
} from "../util/MathJax";

export default function MyApp({ Component, pageProps }) {
  return (
    <MathJaxContext version={mathJaxVersion} config={mathJaxConfig}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </MathJaxContext>
  );
}
