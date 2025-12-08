import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AlertTriangle, Eye, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const RevealCard = ({ id }) => {
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  const revealSecret = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/secret/${id}`
      );

      if (response.status === 404) {
        setError("Secret not found or has already been revealed.");
        setLoading(false);
        return;
      }

      if (response.status === 410) {
        setError("This secret has expired and is no longer available.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!data.success) {
        setError("An error occurred while retrieving the secret.");
        setLoading(false);
        return;
      }

      setSecret(data.message);
      setRevealed(true);
      setLoading(false);
    } catch (error) {
      console.error("Error retrieving secret:", error);
      setError("An error occurred while retrieving the secret.");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg border-primary/30 bg-card/80 backdrop-blur">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl glow tracking-wider">
          [FLASHPAPER]
        </CardTitle>
        <CardDescription className="text-muted-foreground font-mono text-sm">
          {"// incoming encrypted message"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-destructive glow-red">
              <AlertTriangle className="w-5 h-5" />
              <span>[ERROR]</span>
            </div>
            <p className="text-center text-destructive text-sm">{error}</p>
            <Link to={"/"}>
              <Button
                variant="outline"
                className="w-full border-primary/50 text-foreground hover:bg-primary/20 bg-transparent"
              >
                <Home className="w-4 h-4 mr-2" />
                CREATE NEW SECRET
              </Button>
            </Link>
          </div>
        ) : !revealed ? (
          <div className="space-y-4">
            <div className="p-4 border border-primary/30 rounded bg-background/50 text-center">
              <p className="text-muted-foreground text-sm">
                {">"} Someone sent you a secret message
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {"// WARNING: This message will self-destruct after viewing"}
              </p>
            </div>
            <Button
              onClick={revealSecret}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/80 border border-primary"
            >
              <Eye className="w-4 h-4 mr-2" />
              {loading ? "DECRYPTING..." : "REVEAL SECRET"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                {">"} DECRYPTED MESSAGE:
              </label>
              <div className="p-4 bg-background border border-primary/30 rounded text-foreground whitespace-pre-wrap wrap-break-word min-h-24">
                {secret}
              </div>
              <p className="text-xs text-destructive glow-red">
                {"// MESSAGE DESTROYED - This secret no longer exists"}
              </p>
            </div>

            <Link to="/">
              <Button
                className="w-full border-primary/50 text-foreground hover:bg-primary/20 bg-transparent"
                variant="outline"
              >
                <Home className="w-4 h-4 mr-2" />
                CREATE YOUR OWN SECRET
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RevealCard;
