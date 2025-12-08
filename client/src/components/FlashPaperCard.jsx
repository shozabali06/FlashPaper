import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Check, Copy, Lock, Plus } from "lucide-react";
import { Textarea } from "./ui/textarea";

const FlashPaperCard = () => {
  const [secret, setSecret] = useState("");
  const [secretLink, setSecretLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const createSecret = async () => {
    if (!secret.trim()) {
      setError("Secret message cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/secret/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: secret }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Failed to create secret.");
        setLoading(false);
        return;
      }

      const link = `${window.location.origin}/secret/${data.id}`;
      setSecretLink(link);
      setCopied(false);
      setLoading(false);
    } catch (error) {
      console.error("Error creating secret:", error);
      setError("An error occurred while creating the secret.");
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (secretLink) {
      navigator.clipboard.writeText(secretLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const createNew = () => {
    setSecret("");
    setSecretLink(null);
    setError(null);
  };

  return (
    <Card className="w-full max-w-lg border-primary/30 bg-card/80 backdrop/blur">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl glow tracking-wider">
          [FLASHPAPER]
        </CardTitle>
        <CardDescription className="text-muted-foreground font-mono text-sm">
          {"// Self-destructing secrets. One view, then gone."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!secretLink ? (
          <>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                ENTER SECRET MESSAGE:
              </label>
              <Textarea
                value={secret}
                onChange={(e) => {
                  setSecret(e.target.value);
                  setError(null);
                }}
                placeholder="Type your secret here..."
                className="bg-background min-h-32 border-primary/30 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:ring-primary/40 resize-none"
              />
            </div>
            {error && (
              <p className="text-destructive text-sm glow-red">{error}</p>
            )}
            <Button
              onClick={createSecret}
              disabled={loading || !secret.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/80 border border-primary"
            >
              <Lock className="w-4 h-4 mr-2" />{" "}
              {loading ? "ENCRYPTING..." : "CREATE SECRET"}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">
                {">"} SECRET LINK GENERATED:
              </label>
              <div className="p-3 bg-background border border-primary/30 rounded text-sm break-all text-foreground/30">
                {secretLink}
              </div>
              <p className="text-xs text-muted-foreground">
                {"// WARNING: Link expires after one view"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={copyLink}
                variant="outline"
                className="flex-1 border-primary/30 text-foreground hover:bg-primary/20 bg-transparent cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" /> COPIED
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" /> COPY LINK
                  </>
                )}
              </Button>
              <Button
                onClick={createNew}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" /> CREATE NEW SECRET
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlashPaperCard;
