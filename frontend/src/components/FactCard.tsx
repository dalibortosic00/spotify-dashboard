import type { ReactNode, FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "./Card.tsx";
import "./FactCard.css";
import type { Artist, Track } from "../types.ts";
import { isArtist, isTrack } from "../utils/typeGuards.ts";

interface FactCardProps {
  title: string;
  item?: Artist | Track;
  icon?: ReactNode;
  isLoading?: boolean;
}

const FactCardSkeleton: FC = () => {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      <Skeleton className="fact-card-image" />
      <div className="fact-card-value">
        <Skeleton />
      </div>
      <p className="fact-card-description">
        <Skeleton width="80%" />
      </p>
    </SkeletonTheme>
  );
};

const FactCard: FC<FactCardProps> = ({ title, item, icon, isLoading }) => {
  let value: string | undefined;
  let itemUrl: string | undefined;
  let description: string | undefined;
  let imageUrl: string | undefined;
  let imageAlt: string | undefined;

  if (item) {
    value = item.name;
    itemUrl = item.external_urls?.spotify ?? undefined;

    if (isArtist(item)) {
      description = "You couldn't get enough of them this year!";
      imageUrl = item.images?.[0]?.url ?? undefined;
      imageAlt = item.name;
    } else if (isTrack(item)) {
      description = item.artists.map((a) => a.name).join(", ");
      imageUrl = item.album.images[0]?.url || undefined;
      imageAlt = `${item.name} by ${item.artists[0]?.name}`;
    }
  }

  let content: ReactNode;

  if (isLoading) {
    content = <FactCardSkeleton />;
  } else {
    content = (
      <>
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
      </>
    );

    if (itemUrl) {
      content = (
        <a
          href={itemUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fact-item-link"
        >
          {content}
        </a>
      );
    }
  }

  return (
    <Card title={title}>
      <div className="fact-card-content">{content}</div>
    </Card>
  );
};

export default FactCard;
