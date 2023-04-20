export interface PostMetadata {
  title: string;
  description: string;
  date: string;
  mathjax: boolean;
}

export interface Post extends PostMetadata {
  path: string;
}
