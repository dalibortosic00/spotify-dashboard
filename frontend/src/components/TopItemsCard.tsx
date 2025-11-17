import { Link } from "@tanstack/react-router";
import type { FC } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "./Card.tsx";
import type { Artist, TimeRange, Track } from "../types.ts";
import { isArtist, isTrack } from "../utils/typeGuards.ts";
import "./TopItemsCard.css";

interface TopItemsCardProps {
  title: string;
  length: number;
  items?: Artist[] | Track[];
  isLoading?: boolean;
  detailed?: boolean;
  timeRange?: TimeRange;
}

const TopItemsCardSkeleton: FC<Pick<TopItemsCardProps, "length">> = ({
  length,
}) => {
  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      {Array.from({ length }).map((_, index) => (
        <li key={`skeleton-${String(index)}`}>
          <Skeleton className="card-image" />
          <div className="card-text">
            <h4>
              <Skeleton width="120px" />
            </h4>
            <p>
              <Skeleton width="80px" />
            </p>
          </div>
        </li>
      ))}
    </SkeletonTheme>
  );
};

const TopItemsCard: FC<TopItemsCardProps> = ({
  title,
  length,
  items,
  isLoading,
  detailed,
  timeRange,
}) => {
  return (
    <Card title={title}>
      <ul>
        {isLoading ? (
          <TopItemsCardSkeleton length={length} />
        ) : (
          items?.slice(0, length).map((item, index) => (
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
                    <p>
                      {item.artists.map((artist) => artist.name).join(", ")}
                    </p>
                  )}
                </div>
              </a>
            </li>
          ))
        )}
      </ul>
      {!detailed && (
        <Link
          to="/details"
          search={{
            type: items && isArtist(items[0]) ? "artists" : "tracks",
            time_range: timeRange,
          }}
        >
          View More
        </Link>
      )}
    </Card>
  );
};

export default TopItemsCard;
