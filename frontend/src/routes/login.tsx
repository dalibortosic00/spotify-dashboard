import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth.ts";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { token, isCheckingToken, loginUrl } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      void navigate({ to: "/" });
    }
  }, [token, navigate]);

  const handleLogin = () => {
    window.location.href = loginUrl;
  };

  if (isCheckingToken) return null;

  return (
    <div>
      <button type="button" onClick={handleLogin}>
        Login with Spotify
      </button>
    </div>
  );
}
