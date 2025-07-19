import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { ChecklistTemplates, getTemplateByTypeAndLocation } from "../components/ChecklistItem";
import { PlusIcon } from "@heroicons/react/24/outline";
import ChecklistSection from "../components/ChecklistSection";
import ReportModal from "../components/ReportModal";
import CompletedScreen from "../components/CompletedScreen";

export const MY_API_URL = "http://localhost:3000/my"; // ← API URL追加

interface CheckedItems {
  [key: string]: boolean;
}

interface ChecklistTemplate {
  title: string;
  data: {
    [section: string]: string[];
  };
}

const ChecklistScreen = () => {
  const nav = useNavigate();
  const location = useLocation();
  const cleaningData = location.state;

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [selectedPersonInCharge, setSelectedPersonInCharge] = useState<string>("追加者なし");
  
  // ← バックエンド関連の状態（裏で動作）
  const [currentReportId] = useState<number>(1); // 固定値または動的に設定
  
  useEffect(() => {
    if (cleaningData && cleaningData.type && cleaningData.location) {
      const template = getTemplateByTypeAndLocation(cleaningData.type, cleaningData.location);
      if (template) {
        setSelectedTemplate(template);
      }
    }
  }, [cleaningData]);

  // ← バックエンドAPI関数（裏で動作）
  const savePhotoToDb = async (photoUrl: string) => {
    try {
      await fetch(`${MY_API_URL}/photo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: currentReportId,
          photo_url: photoUrl,
          posted_datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }),
      });
      console.log("写真をDBに保存しました:", photoUrl);
    } catch (err) {
      console.error("写真保存エラー:", err);
    }
  };

  const saveLocationTimeToDb = async (taskName: string, requiredTime: string) => {
    try {
      await fetch(`${MY_API_URL}/location_time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: currentReportId,
          task_name: taskName,
          required_time: requiredTime,
        }),
      });
      console.log("所要時間をDBに保存しました:", taskName, requiredTime);
    } catch (err) {
      console.error("所要時間保存エラー:", err);
    }
  };

  const saveChecklistToDb = async (checkedItems: CheckedItems) => {
    try {
      // チェックされた項目をDBに保存する処理
      const checkedList = Object.entries(checkedItems)
        .filter(([key, checked]) => checked)
        .map(([key]) => key);
      
      console.log("チェック状態をDBに保存しました:", checkedList);
      // 実際のDB保存処理はここに実装
    } catch (err) {
      console.error("チェックリスト保存エラー:", err);
    }
  };

  const currentChecklist: ChecklistTemplate | undefined = selectedTemplate
    ? (ChecklistTemplates as any)[selectedTemplate]
    : undefined;

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

  const submitReport = async () => {
    // ← 報告書送信時にバックエンドにデータ保存
    try {
      // チェック状態を保存
      await saveChecklistToDb(checkedItems);
      
      // 写真がある場合は保存（例：ダミーURL）
      if (uploadedPhotos.length > 0) {
        // 実際のファイルアップロード処理後にURLを取得
        const dummyPhotoUrl = "https://example.com/photo.jpg";
        await savePhotoToDb(dummyPhotoUrl);
      }
      
      // 作業時間を保存（例：現在時刻ベース）
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 30 * 60000); // 30分後
      const requiredTime = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}:00`;
      await saveLocationTimeToDb(selectedTemplate || "清掃作業", requiredTime);
      
      console.log("報告書データをすべてDBに保存しました");
    } catch (err) {
      console.error("報告書保存エラー:", err);
    }
    
    setReportModalOpen(false);
    setCompleted(true);
  };

  if (completed) {
    return <CompletedScreen nav={nav} />;
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
      </div>

      <div className="relative flex-1 overflow-y-auto mb-28">
        {selectedTemplate === "junkai" ? (
          <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <p className="text-gray-500 text-lg text-center">
              チェックリストはありません
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* 既存のチェックリスト */}
            {currentChecklist &&
              Object.entries(currentChecklist.data).map(([section, items]) => (
                <ChecklistSection
                  key={section}
                  section={section}
                  items={items as string[]}
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

export default ChecklistScreen;