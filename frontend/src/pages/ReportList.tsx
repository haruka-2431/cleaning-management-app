import { useState, useCallback, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import ReportTable from "../components/ReportTable";
import ReportDetailModal from "../components/ReportDetailModal";
import NoReportsCard from "../components/NoReportCard";

export const MY_API_URL = "http://localhost:3000/another";

// レポートデータ型定義
export interface Report {
  id: number;
  user: string;
  subUser?: string;
  type: string;
  area: string;
  startDatetime: string;
  endDatetime: string;
  status: boolean;
  // API更新用の生データ
  user_id?: number;
  sub_user_id?: number | null;
  type_id?: number;
  area_id?: number;
  raw_start_datetime?: string;
  raw_end_datetime?: string;
}

// タブの型定義
export type TabType = "unconfirmed" | "confirmed";

const Reportlist = () => {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("unconfirmed");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportData, setReportData] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // DBからレポートデータ取得
  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${MY_API_URL}/cleaning_report`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        if (data.length === 0) {
          setReportData(getStaticReportData());
        } else {
          // データ形式を変換
          const formattedReports = data.map((item) => {
            const formatted = {
              id: item.id || Math.random(),
              user: item.user_name || item.user || "不明",
              subUser: item.sub_user_name || item.subUser || undefined,
              type: item.cleaning_type || item.type || "不明",
              area: item.cleaning_area || item.area || "不明",
              startDatetime: item.start_datetime || item.startDatetime || "不明",
              endDatetime: item.end_datetime || item.endDatetime || "不明",
              status: Boolean(
                item.status === 1 || 
                item.status === true || 
                item.status === "1" || 
                item.is_confirmed === 1 || 
                item.is_confirmed === true || 
                item.is_confirmed === "1"
              ),
              // API更新用の生データを保持
              user_id: item.user_id,
              sub_user_id: item.sub_user_id,
              type_id: item.type_id,
              area_id: item.area_id,
              raw_start_datetime: item.raw_start_datetime,
              raw_end_datetime: item.raw_end_datetime,
            };
            
            return formatted;
          });
          
          setReportData(formattedReports);
        }
      } else {
        console.error("データが配列ではありません");
        setReportData(getStaticReportData());
      }
      
    } catch (err) {
      console.error("レポート取得エラー:", err);
      setReportData(getStaticReportData());
    } finally {
      setLoading(false);
    }
  };

  // フォールバック用の静的データ
  const getStaticReportData = (): Report[] => {
    return [
      {
        id: 1,
        user: "山田太郎",
        subUser: "相沢佳奈",
        type: "民泊清掃",
        area: "天神民泊",
        startDatetime: "2024-01-15 09:00",
        endDatetime: "2024-01-15 12:30",
        status: false,
      },
      {
        id: 2,
        user: "佐藤佳次",
        subUser: undefined,
        type: "施設清掃",
        area: "サンホームさくら本館",
        startDatetime: "2024-01-15 14:00",
        endDatetime: "2024-01-15 17:00",
        status: false,
      },
      {
        id: 3,
        user: "岡崎かなた",
        subUser: "山田太郎",
        type: "ハウスクリーニング",
        area: "選択なし",
        startDatetime: "2024-01-14 10:00",
        endDatetime: "2024-01-14 15:30",
        status: true,
      },
      {
        id: 4,
        user: "相沢佳奈",
        subUser: undefined,
        type: "巡回清掃",
        area: "選択なし",
        startDatetime: "2024-01-14 08:00",
        endDatetime: "2024-01-14 10:00",
        status: true,
      },
    ];
  };

  // 初回読み込み時にデータ取得
  useEffect(() => {
    fetchReports();
  }, []);

  // レポートをフィルタリング
  const filteredReports = reportData?.filter((report) => {
    const isConfirmed = report.status;
    const shouldShow = activeTab === "unconfirmed" ? !isConfirmed : isConfirmed;
    return shouldShow;
  }) || [];

  // モーダル開閉のハンドラ
  const openDetailModal = useCallback((report: Report) => {
    setSelectedReport(report);
  }, []);

  const closeDetailModal = useCallback(() => {
    setSelectedReport(null);
  }, []);

  // 確認済み処理
  const handleConfirmReport = async () => {
    if (!selectedReport) {
      return;
    }
    
    // 必須フィールドチェック
    const missingFields = [];
    if (!selectedReport.user_id) missingFields.push("user_id");
    if (!selectedReport.type_id) missingFields.push("type_id");
    if (!selectedReport.area_id) missingFields.push("area_id");
    if (!selectedReport.raw_start_datetime) missingFields.push("raw_start_datetime");
    if (!selectedReport.raw_end_datetime) missingFields.push("raw_end_datetime");
    
    if (missingFields.length > 0) {
      console.error("必要なデータが不足しています:", missingFields.join(", "));
      alert(`データ不足: ${missingFields.join(", ")}`);
      return;
    }
    
    try {
      const formatDateTimeForMySQL = (isoString: string | null | undefined): string | null => {
        if (!isoString) return null;
        return isoString.slice(0, 19).replace('T', ' ');
      };
      
      const updateData = {
        user_id: selectedReport.user_id,
        sub_user_id: selectedReport.sub_user_id || null,
        type_id: selectedReport.type_id,
        area_id: selectedReport.area_id,
        start_datetime: formatDateTimeForMySQL(selectedReport.raw_start_datetime),
        end_datetime: formatDateTimeForMySQL(selectedReport.raw_end_datetime),
        status: 1
      };
      
      const response = await fetch(`${MY_API_URL}/cleaning_report/${selectedReport.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API更新エラー:", errorText);
        throw new Error(`API更新失敗: ${response.status} - ${errorText}`);
      }
      
      // 成功処理
      closeDetailModal();
      await fetchReports();
      setActiveTab("confirmed");
      alert("確認済みに変更しました！");
      
    } catch (error) {
      console.error("確認済み処理エラー:", error);
      alert(`エラー: ${error}`);
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="レポート一覧"
        className="fixed top-0 left-0 right-0 z-50"
      />

      <div className="container mx-auto px-4 py-6 lg:mt-3">
        <div
          role="tablist"
          className="tabs tabs-lift w-full sticky top-28 sm:top-28 lg:top-32 bg-white z-40"
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
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-800 mx-auto mb-4"></div>
              <p className="text-gray-600">レポートを読み込み中...</p>
            </div>
          </div>
        ) : filteredReports.length > 0 ? (
          <ReportTable reports={filteredReports} onOpenDetail={openDetailModal} />
        ) : (
          <NoReportsCard activeTab={activeTab} />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 py-8 z-10 bg-white">
        <button 
          className="btn bg-cyan-800 text-white w-full gap-2 shadow-lg h-14"
          onClick={() => nav("/admin/cleaning-edit")}
        >
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