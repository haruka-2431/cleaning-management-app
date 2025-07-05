// headerの型定義
interface HeaderProps {
  title: string;
  onBackClick: () => void;
  className?: string;
}

const Header = ({ title, onBackClick, className = "" }: HeaderProps) => {
  const defaultClasses = "h-20 lg:h-32 w-full flex items-center px-4 lg:px-14 bg-white z-40";
  const positionClass = className.includes('fixed') ? '' : 'sticky top-0';

  return (
    <header className={`${defaultClasses} ${positionClass} ${className}`}>
      <button onClick={onBackClick} className="flex-shrink-0 z-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6 text-cyan-800"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
      </button>
      <h1 className="absolute left-1/2 -translate-x-1/2 w-full text-center font-bold text-cyan-800 text-lg lg:text-2xl">
        {title}
      </h1>
      <div className="flex-shrink-0 w-6"></div>
    </header>
  );
};

export default Header;