export default function Stat({
  value,
  title,
  watermark
}: {
  value: number,
  title: string,
  watermark?: {
    src: string;
    alt: string;
  }
}) {

  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <p className="stat-title">{title}</p>
      {watermark?.src && <img src={watermark?.src} alt={watermark?.alt} className="stat-watermark" />}
    </div>
  )
}
