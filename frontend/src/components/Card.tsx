import type { FC, ReactNode } from "react";
import "./Card.css";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  subtitle?: string;
  fullWidth?: boolean;
}

const Card: FC<CardProps> = ({
  title,
  subtitle,
  children,
  className,
  fullWidth,
}) => {
  return (
    <div
      className={`card ${className ?? ""} ${fullWidth ? "card-full-width" : ""}`}
    >
      {title && <h3 className="card-title">{title}</h3>}
      {subtitle && <p className="card-subtitle">{subtitle}</p>}
      <div className="card-content">{children}</div>
    </div>
  );
};

export default Card;
