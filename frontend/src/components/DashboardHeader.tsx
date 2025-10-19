import type { FC } from "react";
import type { User } from "../types.ts";
import "./DashboardHeader.css";

interface DashboardHeaderProps {
  currentUser: User | undefined;
  logOut: () => void;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ currentUser, logOut }) => {
  return (
    <div className="dashboard-header">
      <h1>
        {currentUser ? `Welcome, ${currentUser.display_name}` : "Welcome"}
      </h1>

      <button type="button" onClick={logOut}>
        Log Out
      </button>
    </div>
  );
};

export default DashboardHeader;
