interface SectionHeadingProps {
  beforeHighlight: string;
  highlight: string;
  afterHighlight?: string;
  className?: string;
}

export default function SectionHeading({
  beforeHighlight,
  highlight,
  afterHighlight = "",
  className = "",
}: SectionHeadingProps) {
  return (
    <h2
      className={`text-2xl md:text-3xl lg:text-[32px] font-bold text-[#002233] text-center leading-tight ${className}`}
    >
      {beforeHighlight}{" "}
      <span className="text-[#006666]">{highlight}</span>
      {afterHighlight}
    </h2>
  );
}
