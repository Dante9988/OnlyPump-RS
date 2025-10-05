'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateToken() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the seamless version
    router.replace('/create-seamless');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">Redirecting to seamless token creation...</p>
      </div>
    </div>
  );
}