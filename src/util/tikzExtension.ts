export const tikzExtension = {
  name: 'tikz',
  level: 'block',
  start(src: string) { 
    return src.match(/^```tikz/)?.index; 
  },
  tokenizer(src: string) {
    const rule = /^```tikz\n([\s\S]*?)\n```/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'tikz',
        raw: match[0],
        code: match[1].trim()
      };
    }
  },
  renderer(token: any) {
    // TikZJax will automatically process this on the client
    return `<script type="text/tikz">
\\begin{tikzpicture}
${token.code}
\\end{tikzpicture}
</script>`;
  }
};
