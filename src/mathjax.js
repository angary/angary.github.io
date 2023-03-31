import Script from "next/script"

const mathJaxConfig = `MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [['$', '$']],
      processEscapes: true
    }
  });`

export default function MathJax() {
  return <>
    <Script
      type="text/javascript"
      src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML" async
    />
    <Script
      id="MathJax-config"
      type="text/x-mathjax-config"
      dangerouslySetInnerHTML={{ __html: mathJaxConfig }}
    />
  </>
}
