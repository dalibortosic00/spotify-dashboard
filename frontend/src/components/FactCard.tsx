import type { ReactNode, FC } from "react";
import Card from "./Card.tsx";
import "./FactCard.css";

interface FactCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: ReactNode;
  imageUrl?: string;
  imageAlt?: string;
}

const FactCard: FC<FactCardProps> = ({
  title,
  value,
  description,
  icon,
  imageUrl,
  imageAlt,
}) => {
  return (
    <Card title={title}>
      <div className="fact-card-content">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt ?? title}
            className="fact-card-image"
          />
        ) : (
          icon && <div className="fact-card-icon">{icon}</div>
        )}

        <div className="fact-card-value">{value}</div>
        <p className="fact-card-description">{description}</p>
      </div>
    </Card>
  );
};

export default FactCard;
