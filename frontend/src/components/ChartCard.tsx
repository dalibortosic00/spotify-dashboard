import type { FC, ReactNode } from "react";
import Card from "./Card.tsx";
import "./ChartCard.css";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

const ChartCard: FC<ChartCardProps> = ({
  title,
  subtitle,
  children,
  className,
  fullWidth,
}) => {
  return (
    <Card
      title={title}
      subtitle={subtitle}
      className={`chart-card ${className ?? ""}`}
      fullWidth={fullWidth}
    >
      <div className="chart-card-content">{children}</div>
    </Card>
  );
};

export default ChartCard;
