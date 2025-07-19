import { useState, useCallback, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import ReportTable from "../components/ReportTable";
import ReportDetailModal from "../components/ReportDetailModal";
import NoReportsCard from "../components/NoReportCard";

export const MY_API_URL = "http://localhost:3000/my"; 

// レポートデータの型定義
export interface Report {
  id: number;
  user: string;
  subUser?: string;
  type: string;
  area: string;
  startDatetime: string;
  endDatetime: string;
  status: boolean;
}

// タブの型定義
export type TabType = "unconfirmed" | "confirmed";

const [reportData, setReportData] = useState<Report[]>([]);

useEffect(() => {
  const fetchReports = async () => {
    try {
      const response = await fetch(`${MY_API_URL}/reports`);
      const data = await response.json();
      setReportData(data.reports);
    } catch (err) {
      console.error("レポート取得エラー:", err);
      setReportData([]);
    }
  };
  
  fetchReports();
}, []);


const Reportlist = () => {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("unconfirmed");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // レポートをフィルタリング
  const filteredReports = reportData.filter((report) =>
    activeTab === "unconfirmed" ? !report.status : report.status
  );

  // モーダル開閉のハンドラ
  const openDetailModal = useCallback((report: Report) => {
    setSelectedReport(report);
  }, []);

  const closeDetailModal = useCallback(() => {
    setSelectedReport(null);
  }, []);

  // レポート確認済みのハンドラ
  const handleConfirmReport = useCallback(() => {
    setActiveTab("confirmed");
    closeDetailModal();
    alert("確認済みに変更しました");
    // ここでAPIを呼び出すなどの実際の処理を追加
  }, [closeDetailModal]);

  return (
    <div className="min-h-screen">
      <Header
        title="レポート一覧"
        className="fixed top-0 left-0 right-0 z-50"
      />

      <div className="container mx-auto px-4 py-6 lg:pt-30">
        <div
          role="tablist"
          className="tabs tabs-lift w-full sticky top-20 sm:top-28 lg:top-32 bg-white z-40"
        >
          <button
            role="tab"
            className={`tab tab-lifted flex-1 text-sm  ${
              activeTab === "unconfirmed"
                ? "tab-active text-white hover:text-white [--tab-bg:theme(colors.cyan-800)] [--tab-border-color:theme(colors.cyan-800)]"
                : "hover:text-cyan-600"
            }`}
            onClick={() => setActiveTab("unconfirmed")}
          >
            未確認
          </button>
          <button
            role="tab"
            className={`tab tab-lifted flex-1 text-sm  ${
              activeTab === "confirmed"
                ? "tab-active text-white hover:text-white [--tab-bg:theme(colors.cyan-800)] [--tab-border-color:theme(colors.cyan-800)]"
                : "hover:text-cyan-600"
            }`}
            onClick={() => setActiveTab("confirmed")}
          >
            確認済み
          </button>
        </div>
        
        {filteredReports.length > 0 ? (
          <ReportTable reports={filteredReports} onOpenDetail={openDetailModal} />
        ) : (
          <NoReportsCard activeTab={activeTab} />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 py-8 z-10 bg-white">
        <button className="btn bg-cyan-800 text-white w-full gap-2 shadow-lg h-14"
        onClick={() => nav("/adimn/cleaning-edit")}>
          データの編集
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>
      </div>
      
      <ReportDetailModal
        selectedReport={selectedReport}
        onClose={closeDetailModal}
        onConfirm={handleConfirmReport}
      />
    </div>
  );
};

export default Reportlist;