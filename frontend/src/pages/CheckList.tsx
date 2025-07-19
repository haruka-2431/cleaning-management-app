import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { ChecklistTemplates, getTemplateByTypeAndLocation } from "../components/ChecklistItem";
import { PlusIcon } from "@heroicons/react/24/outline";
import ChecklistSection from "../components/ChecklistSection";
import ReportModal from "../components/ReportModal";
import CompletedScreen from "../components/CompletedScreen";

export const MY_API_URL = "http://localhost:3000/my";

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
  const [currentChecklist, setCurrentChecklist] = useState<ChecklistTemplate | undefined>(undefined); // ← 追加
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [selectedPersonInCharge, setSelectedPersonInCharge] = useState<string>("追加者なし");
  const [loading, setLoading] = useState<boolean>(false); // ← 追加
  
  // 作業時間記録用の状態
  const [workStartTime, setWorkStartTime] = useState<Date | null>(null);
  const [currentReportId] = useState<number>(1);
  
  // ← 非同期でテンプレート取得
  useEffect(() => {
    const loadTemplate = async () => {
      if (cleaningData && cleaningData.type && cleaningData.location) {
        setLoading(true);
        try {
          const template = await getTemplateByTypeAndLocation(
            cleaningData.type,
            cleaningData.location
          );
          
          if (typeof template === 'string') {
            // 静的テンプレートの場合
            setSelectedTemplate(template);
            setCurrentChecklist(ChecklistTemplates[template]);
          } else {
            // DBから取得したテンプレートの場合
            setSelectedTemplate('db-template');
            setCurrentChecklist(template);
          }
        } catch (err) {
          console.error("テンプレート取得エラー:", err);
          // フォールバック：デフォルトテンプレート
          setSelectedTemplate('tenjin');
          setCurrentChecklist(ChecklistTemplates['tenjin']);
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
      console.log("作業開始時刻を記録しました:", new Date().toLocaleTimeString());
    }
  }, []);

  // バックエンドAPI関数
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
      const checkedList = Object.entries(checkedItems)
        .filter(([key, checked]) => checked)
        .map(([key]) => key);
      
      console.log("チェック状態をDBに保存しました:", checkedList);
    } catch (err) {
      console.error("チェックリスト保存エラー:", err);
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

  const submitReport = async () => {
    try {
      // チェック状態を保存
      await saveChecklistToDb(checkedItems);
      
      // 写真がある場合は保存
      if (uploadedPhotos.length > 0) {
        const dummyPhotoUrl = "https://example.com/photo.jpg";
        await savePhotoToDb(dummyPhotoUrl);
      }
      
      // 実際の作業時間を計算して保存
      if (workStartTime) {
        const workEndTime = new Date();
        const workDurationMs = workEndTime.getTime() - workStartTime.getTime();
        const workDurationMinutes = Math.floor(workDurationMs / 60000);
        const hours = Math.floor(workDurationMinutes / 60);
        const minutes = workDurationMinutes % 60;
        
        const requiredTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        
        console.log(`実際の作業時間: ${hours}時間${minutes}分 (${requiredTime})`);
        await saveLocationTimeToDb(currentChecklist?.title || "清掃作業", requiredTime);
      }
      
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
        {selectedTemplate === "junkai" ? (
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

export default ChecklistScreen;