'use client'; // Ensure the page is client-side or keeps the component client-side

import dynamic from 'next/dynamic';

// 1. Change the import to use 'dynamic' with ssr: false
const SmsTester = dynamic(() => import('@/components/admin/SmsTester'), {
  ssr: false,
  loading: () => <p>Loading Tester...</p>, // Optional loading state
});

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Tidy House Admin</h1>
      
      <div className="mt-8">
        {/* Now this component will only render in the browser, preventing the error */}
        <SmsTester />
      </div>
    </div>
  );
}