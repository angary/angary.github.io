type SectionHeadingProps = {
  title: string;
  onClick: () => void;
  className?: string;
};

export default function SectionHeading({ title, onClick, className }: SectionHeadingProps) {
  return (
    <h1 onClick={onClick} className={className}>
      {title}
    </h1>
  );
}
