import { useEffect, useState } from 'react';

// Props型定義
interface OpeningProps {
  onComplete: () => void;
}

const Opening = ({ onComplete }: OpeningProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // アニメーション開始
    const startTimer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // ローディング完了
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    // アニメーション完了後に次の画面へ
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(loadingTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col items-center justify-center relative overflow-hidden">
      {/* 背景アニメーション */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-1/3 w-16 h-16 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* メインロゴ */}
      <div className={`transition-all duration-1000 transform ${
        isVisible 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-75 translate-y-8'
      }`}>
        <div className="relative">
          {/* ロゴ画像 */}
          <img 
            src="/img/ZEN-logo.png" 
            alt="ZENInc. CLEAN the FUTURE" 
            className="h-40 w-auto mx-auto drop-shadow-2xl"
          />
          
          {/* 光る効果 */}
          <div className="absolute inset-0 bg-white opacity-20 rounded-full blur-xl animate-ping"></div>
        </div>
      </div>

      {/* ローディングインジケーター */}
      {isLoading && (
        <div className={`mt-12 transition-all duration-1000 transform ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`} style={{transitionDelay: '0.7s'}}>
          {/* スピナー */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-teal-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          
          {/* ローディングバー */}
          <div className="mt-6 w-64 bg-teal-600 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-2000 ease-in-out"
              style={{
                width: isVisible ? '100%' : '0%',
                transitionDelay: '0.5s'
              }}
            ></div>
          </div>
          
          <p className="text-center mt-4 text-sm text-cyan-800">
            システムを起動しています...
          </p>
        </div>
      )}

      {/* 完了メッセージ */}
      {!isLoading && (
        <div className="mt-12 animate-fade-in">
          <div className="flex items-center justify-center text-white">
            <svg className="w-6 h-6 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-lg font-medium">起動完了</span>
          </div>
        </div>
      )}

      {/* カスタムCSS */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Opening;