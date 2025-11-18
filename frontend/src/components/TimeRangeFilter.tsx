import type { FC } from "react";
import type { TimeRange } from "../types/index.ts";
import "./TimeRangeFilter.css";

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "long_term", label: "Last Year" },
  { value: "medium_term", label: "Last 6 Months" },
  { value: "short_term", label: "Last 4 Weeks" },
];

interface TimeRangeFilterProps {
  currentTimeRange: TimeRange;
  onTimeRangeChange: (newTimeRange: TimeRange) => void;
}

const TimeRangeFilter: FC<TimeRangeFilterProps> = ({
  currentTimeRange,
  onTimeRangeChange,
}) => {
  return (
    <div className="time-range-filter">
      {TIME_RANGES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={
            currentTimeRange === value
              ? "time-range-button active"
              : "time-range-button"
          }
          onClick={() => {
            onTimeRangeChange(value);
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeFilter;
