import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getTemplateByTypeAndLocation } from "../components/CheckListItem";
import { PlusIcon } from "@heroicons/react/24/outline";
import ChecklistSection from "../components/CheckListSection";
import ReportModal from "../components/ReportModal";
import { typeService, areaService, reportService } from "../services/api";

interface CheckedItems {
  [key: string]: boolean;
}

interface ChecklistTemplate {
  title: string;
  data: {
    [section: string]: string[];
  };
}

const Checklist = () => {
  const location = useLocation();
  const cleaningData = location.state;

  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [currentChecklist, setCurrentChecklist] = useState<
    ChecklistTemplate | undefined
  >(undefined);
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [selectedPersonInCharge, setSelectedPersonInCharge] =
    useState<string>("追加者なし");
  const [loading, setLoading] = useState<boolean>(false);

  // 作業時間記録用の状態
  const [workStartTime, setWorkStartTime] = useState<Date | null>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      if (cleaningData && cleaningData.type && cleaningData.location) {
        setLoading(true);
        try {
          const template = await getTemplateByTypeAndLocation(
            cleaningData.type,
            cleaningData.location
          );

          // DBから取得したテンプレートを直接セット
          setSelectedTemplate("db-template");
          setCurrentChecklist(template);
        } catch (err) {
          console.error("テンプレート取得エラー:", err);
          // エラー時：巡回清掃として処理
          setSelectedTemplate("junkai");
          setCurrentChecklist({ title: "エラー", data: {} });
        } finally {
          setLoading(false);
        }
      }
    };

    loadTemplate();
  }, [cleaningData]);

  // 作業開始時刻を記録（ページ読み込み時）
  useEffect(() => {
    if (!workStartTime) {
      setWorkStartTime(new Date());
    }
  }, [workStartTime]);


  //submitReport関数
const submitReport = async () => {
  try {
    console.log("🚀 新しいAPIサービスで報告書提出開始");

    // 🔧 実際のデータから取得
    const currentType = cleaningData?.type || "民泊清掃";
    const currentArea = cleaningData?.area || "春吉民泊"; 
    const currentUser = "作業者"; // 後でユーザー選択機能から取得

    // ID取得
    const typeId = await typeService.getTypeIdByName(currentType);
    const areaId = await areaService.getAreaIdByName(currentArea, currentType);
    
    console.log("✅ ID取得完了:", { typeId, areaId });

    // チェック項目を変換
    const reportItems = Object.entries(checkedItems).map(([key, checked]) => ({
      category: "一般",
      item: key,
      completed: checked,
      comment: ""
    }));

    // 報告書データ作成
    const reportData = {
      cleaning_type_id: typeId,
      cleaning_area_id: areaId,
      cleaning_type: currentType,
      cleaning_area: currentArea,
      user_name: currentUser,
      items: reportItems,
      photos: [], // 写真機能は後で実装
      submitted_at: new Date().toISOString()
    };

    // 報告書提出
    const result = await reportService.submitReport(reportData);
    
    if (result.success) {
      console.log("🎉 報告書提出成功:", result.reportId);
      
      // 成功メッセージ
      alert(`✅ 報告書の提出が完了しました！\n\n📋 報告書ID: ${result.reportId}\n🎯 清掃タイプ: ${currentType}\n📍 清掃場所: ${currentArea}\n👤 作業者: ${currentUser}`);
      
      // 🆕 完了画面に遷移
      console.log("🎊 完了画面に移行します");
      navigate('/completed', { 
        state: { 
          reportId: result.reportId,
          type: currentType,
          area: currentArea,
          user: currentUser
        }
      });
      
      // フォームリセット
      setCheckedItems({});
      console.log("🔄 フォームをリセットしました");
    } else {
      throw new Error("提出処理に失敗しました");
    }

  } catch (error) {
    console.error('❌ 報告書提出エラー:', error);
    alert("❌ 報告書の提出中にエラーが発生しました。\n\n📱 再度お試しください。");
  }
};

  const toggleCheck = (section: string, item: string) => {
    const key = `${selectedTemplate}-${section}-${item}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const generateReport = () => {
    setReportModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="チェックリスト・報告書" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-800 mx-auto mb-4"></div>
            <p className="text-gray-600">チェックリストを読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="チェックリスト・報告書" />

      <div className="bg-cyan-800 text-white text-center py-4 sticky top-20 z-30">
        <h2 className="text-lg font-medium">
          {cleaningData?.type === "巡回清掃"
            ? "巡回清掃"
            : currentChecklist?.title || cleaningData?.location}
        </h2>
        <p className="text-sm opacity-90">
          {cleaningData?.type === "巡回清掃" ? "" : "チェックリスト"}
        </p>
        {workStartTime && (
          <p className="text-xs opacity-75 mt-1">
            作業開始: {workStartTime.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="relative flex-1 overflow-y-auto mb-28">
        {selectedTemplate === "junkai" ||
        !currentChecklist ||
        Object.keys(currentChecklist.data).length === 0 ? (
          <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <p className="text-gray-500 text-lg text-center">
              チェックリストはありません
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {currentChecklist &&
              Object.entries(currentChecklist.data).map(([section, items]) => (
                <ChecklistSection
                  key={section}
                  section={section}
                  items={items}
                  checkedItems={checkedItems}
                  selectedTemplate={selectedTemplate}
                  onToggleCheck={toggleCheck}
                />
              ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-8">
        <button
          onClick={generateReport}
          className="w-full h-14 bg-cyan-800 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
        >
          <span>報告書を作成する</span>
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onSubmit={submitReport}
        uploadedPhotos={uploadedPhotos}
        setUploadedPhotos={setUploadedPhotos}
        selectedPersonInCharge={selectedPersonInCharge}
        setSelectedPersonInCharge={setSelectedPersonInCharge}
      />
    </div>
  );
};

export default Checklist;
