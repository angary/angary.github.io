# angary.github.io

Built with next.js.

## Development

To start the development server

```sh
yarn dev
```

## TikZ Diagrams

This project supports TikZ diagrams that are compiled to SVG at build time.

Requirements: `pdflatex` and `pdf2svg` and afterwards install the following

```
tlmgr install standalone
tlmgr install pgfplots
```

1. **During Build**: The build process scans markdown files for `tikz` code blocks
2. **LaTeX Compilation**: Each TikZ diagram is compiled using local `pdflatex` 
3. **SVG Generation**: PDFs are converted to SVG using `pdf2svg` or `inkscape`
4. **Caching**: Generated SVGs are cached in `public/tikz-cache/` and served statically
## Build & Deploy

To build the site:

```sh
yarn build
```

To publish and upload:

```sh
sh deploy.sh
```
