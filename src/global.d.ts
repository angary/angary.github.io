declare module "*.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

export interface WritingMetadata {
  title: string;
  description: string;
  date: string;
  mathjax: boolean;
  hljs?: boolean;
}

export interface Writing extends WritingMetadata {
  path: string;
}
