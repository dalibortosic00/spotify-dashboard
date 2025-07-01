import type { ReactNode, FC } from "react";
import Card from "./Card.tsx";
import "./FactCard.css";
import type { Artist, Track } from "../types.ts";
import { isArtist, isTrack } from "../utils/typeGuards.ts";

interface FactCardProps {
  title: string;
  value?: string;
  description?: string;
  icon?: ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  itemUrl?: string;
  item?: Artist | Track;
}

const FactCard: FC<FactCardProps> = ({
  title,
  value,
  description,
  icon,
  imageUrl,
  imageAlt,
  itemUrl,
  item,
}) => {
  const derivedValue = item ? item.name : value;

  const derivedDescription = item
    ? isArtist(item)
      ? "You couldn't get enough of them this year!"
      : isTrack(item)
        ? `by ${item.artists.map((a) => a.name).join(", ")}`
        : description
    : description;

  const derivedImageUrl = item
    ? isArtist(item)
      ? (item.images?.[0]?.url ?? undefined)
      : isTrack(item)
        ? item.album.images[0]?.url || undefined
        : imageUrl
    : imageUrl;

  const derivedImageAlt = item
    ? isArtist(item)
      ? item.name
      : isTrack(item)
        ? `${item.name} by ${item.artists[0]?.name}`
        : imageAlt
    : imageAlt;

  const derivedItemUrl = item
    ? (item.external_urls?.spotify ?? undefined)
    : itemUrl;

  const finalValue = derivedValue ?? "";
  const finalDescription = derivedDescription ?? "";
  const finalImageUrl = derivedImageUrl;
  const finalImageAlt = derivedImageAlt;
  const finalItemUrl = derivedItemUrl;

  const content = (
    <>
      {finalImageUrl ? (
        <img
          src={finalImageUrl}
          alt={finalImageAlt ?? title}
          className="fact-card-image"
        />
      ) : (
        icon && <div className="fact-card-icon">{icon}</div>
      )}
      <div className="fact-card-value">{finalValue}</div>
      <p className="fact-card-description">{finalDescription}</p>
    </>
  );

  return (
    <Card title={title}>
      <div className="fact-card-content">
        {finalItemUrl ? (
          <a
            href={finalItemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fact-item-link"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    </Card>
  );
};

export default FactCard;
