import { useEffect } from 'react';

export default function SplashScreen({ onFinish }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      
      <div className="text-center animate-pulse">
        
        {/* YOUR LOGO */}
        <img
          src="/logo.png"
          alt="Logo"
          className="w-32 mx-auto mb-4"
        />

        <h1 className="text-2xl font-bold text-purple-700">
          Identity Physio Care
        </h1>

      </div>

    </div>
  );
}