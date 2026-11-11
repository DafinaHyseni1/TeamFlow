interface StatsCardProps {
  title: string;
  value: string;
  description: string;
}

function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <div className="stat-card">
      <span className="stat-label">{title}</span>
      <h2>{value}</h2>
      <span className="stat-note">{description}</span>
    </div>
  );
}

export default StatsCard;
