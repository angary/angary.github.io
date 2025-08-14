export interface WritingMetadata {
  title: string;
  description: string;
  date: string;
  mathjax: boolean;
}

export interface Writing extends WritingMetadata {
  path: string;
}
