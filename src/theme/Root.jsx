import React, { Suspense, lazy, useEffect, useState } from 'react';

const RAGChatbot = lazy(() => import('../components/RAGChatbot'));

export default function Root({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {children}
      {isClient && (
        <Suspense fallback={null}>
          <RAGChatbot />
        </Suspense>
      )}
    </>
  );
}