import { ReactNode } from "react"

export default function Stat({
  value,
  title,
  children
}: {
  value: number,
  title: string,
  children?: ReactNode
}) {

  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <p className="stat-title">{title}</p>
      {children}
    </div>
  )
}
