import type { FC } from "react";
import Card from "./Card.tsx";
import type { Artist, Track } from "../types.ts";
import { isArtist, isTrack } from "../utils/typeGuards.ts";
import "./TopItemsCard.css";

interface TopItemsCardProps {
  title: string;
  items: Artist[] | Track[];
}

const TopItemsCard: FC<TopItemsCardProps> = ({ title, items }) => {
  return (
    <Card title={title}>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={item.external_urls?.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="top-item-link"
            >
              {isArtist(item) && item.images && item.images.length > 0 && (
                <img
                  src={item.images[0].url}
                  alt={item.name}
                  className="card-image"
                />
              )}
              {isTrack(item) && item.album.images.length > 0 && (
                <img
                  src={item.album.images[0].url}
                  alt={item.name}
                  className="card-image"
                />
              )}
              <div className="card-text">
                <h4>
                  {index + 1}. {item.name}
                </h4>
                {isTrack(item) && (
                  <p>{item.artists.map((artist) => artist.name).join(", ")}</p>
                )}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default TopItemsCard;
