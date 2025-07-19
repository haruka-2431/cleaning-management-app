import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

type CleaningEditProps = {
  title: string;
  setTitle: (title: string) => void;
}

const CleaningEdit = ({ title, setTitle }: CleaningEditProps) => {
  const nav = useNavigate();

  useEffect(() => {
    setTitle("編集画面");
  }, [setTitle]);

  const handleClick = (type: string) => {
    nav(`/admin/cleaning-edit/${type}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={title}/>
      <div className="pt-20 px-4 bg-white lg:px-auto h-screen ">
        <div className="flex flex-col justify-center gap-15 lg:gap-20 w-full md:w-[400px] mx-auto">
          <button className="py-4.5 lg:py-7 bg-cyan-600 rounded-lg text-center text-white" onClick={() => handleClick("cleaning_type")}>清掃タイプ</button>
          <button className="py-4.5 lg:py-7 bg-cyan-800 rounded-lg text-center text-white" onClick={() => handleClick("cleaning_area")}>清掃場所</button>
          <button className="py-4.5 lg:py-7 bg-teal-600 rounded-lg text-center text-white" onClick={() => handleClick("checklist")}>チェックリスト</button>
          <button className="py-4.5 lg:py-7 bg-teal-800 rounded-lg text-center text-white" onClick={() => handleClick("user")}>個人データ</button>
        </div>
      </div>
    </div>
  );
};

export default CleaningEdit;