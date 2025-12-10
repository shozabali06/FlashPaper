import React from "react";
import FlashPaperCard from "../components/FlashPaperCard";

const Home = () => {
  return (
    <div className="min-h-svh flex items-center justify-center p-4 relative">
      <FlashPaperCard />
      <span className="absolute bottom-2 right-2 text-sm text-muted-foreground">
        Made with ❤️ by{" "}
        <a
          href="https://github.com/shozabali06"
          target="_blank"
          className="underline"
        >
          Shozab
        </a>
      </span>
    </div>
  );
};

export default Home;
