import RevealCard from '@/components/RevealCard';
import React from 'react'

const Secret = () => {
  const id = window.location.pathname.split("/secret/")[1];
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <RevealCard id={id} />
      <span className="absolute bottom-2 right-2 text-sm text-muted-foreground">
        Made with ❤️ by{" "}
        <a href="https://github.com/shozabali06" target='_blank' className="underline">
          Shozab
        </a>
      </span>
    </div>
  )
}

export default Secret
