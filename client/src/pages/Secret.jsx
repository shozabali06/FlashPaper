import RevealCard from '@/components/RevealCard';
import React from 'react'

const Secret = () => {
  const id = window.location.pathname.split("/secret/")[1];
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <RevealCard id={id} />
    </div>
  )
}

export default Secret
