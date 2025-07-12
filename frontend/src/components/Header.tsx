import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string
};

const Header = (props: HeaderProps) => {
  const nav = useNavigate();
  return (
    <header className="h-18 lg:h-25 bg-white flex justify-center items-center sticky top-0">
      <button className="fixed left-5 lg:left-16 text-cyan-800" onClick={() => nav(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 lg:size-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>
      <h1 className="text-2xl font-bold text-cyan-800">{props.title}</h1>
    </header>
  );
};

export default Header;