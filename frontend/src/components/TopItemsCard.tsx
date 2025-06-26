import type { FC } from "react";
import Card from "./Card.tsx";
import type { Artist, Track } from "../types.ts";

function isArtist(item: Artist | Track): item is Artist {
  return item.type === "artist";
}

function isTrack(item: Artist | Track): item is Track {
  return item.type === "track";
}

interface TopItemsCardProps {
  title: string;
  items: Artist[] | Track[];
  type: "artist" | "track";
}

const TopItemsCard: FC<TopItemsCardProps> = ({ title, items, type }) => {
  return (
    <Card title={title}>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
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
              {type === "track" && "artists" in item && (
                <p>{item.artists.map((artist) => artist.name).join(", ")}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default TopItemsCard;
