declare module "*.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

export interface WritingMetadata {
  title: string;
  description: string;
  date: string;
  mathjax: boolean;
  type: string;
}

export interface Writing extends WritingMetadata {
  path: string;
}

export type HeadingInfo = {
  id: string;
  text: string;
  level: number;
};
