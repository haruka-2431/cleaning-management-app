import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { getTemplateByTypeAndLocation } from "../components/ChecklistItem";
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

const Checklist = () => {
  const nav = useNavigate();
  const location = useLocation();
  const cleaningData = location.state;

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [currentChecklist, setCurrentChecklist] = useState<ChecklistTemplate | undefined>(undefined);
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [selectedPersonInCharge, setSelectedPersonInCharge] = useState<string>("追加者なし");
  const [loading, setLoading] = useState<boolean>(false);
  
  // 作業時間記録用の状態
  const [workStartTime, setWorkStartTime] = useState<Date | null>(null);
  const [currentReportId] = useState<number>(1);
  
  // ← 非同期でテンプレート取得（修正版）
  useEffect(() => {
    const loadTemplate = async () => {
      if (cleaningData && cleaningData.type && cleaningData.location) {
        setLoading(true);
        try {
          console.log("テンプレート読み込み開始:", cleaningData.type, cleaningData.location);
          
          const template = await getTemplateByTypeAndLocation(
            cleaningData.type,
            cleaningData.location
          );
          
          console.log("取得したテンプレート:", template);
          
          // DBから取得したテンプレートを直接セット
          setSelectedTemplate('db-template');
          setCurrentChecklist(template);
          
        } catch (err) {
          console.error("テンプレート取得エラー:", err);
          // エラー時：巡回清掃として処理
          setSelectedTemplate('junkai');
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
      console.log("作業開始時刻を記録しました:", new Date().toLocaleTimeString());
    }
  }, []);

  // バックエンドAPI関数
  const savePhotoToDb = async (photoUrl: string) => {
    try {
      const requestData = {
        report_id: currentReportId,
        photo_url: photoUrl,
        posted_datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      
      console.log("写真保存開始:");
      console.log("送信URL:", `${MY_API_URL}/photo`);
      console.log("送信データ:", requestData);
      
      const response = await fetch(`${MY_API_URL}/photo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      
      console.log("写真API レスポンス状態:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("写真API サーバーエラーレスポンス:", errorText);
        throw new Error(`写真API エラー: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log("写真をDBに保存しました:", photoUrl);
      console.log("写真API レスポンス:", result);
      
    } catch (err) {
      console.error("写真保存エラー:", err);
      // ← エラーでも処理を続行
      console.log("写真の保存に失敗しましたが、処理を続行します");
    }
  };

  const saveLocationTimeToDb = async (taskName: string, requiredTime: string) => {
    try {
      const requestData = {
        report_id: currentReportId,
        task_name: taskName,
        required_time: requiredTime,
      };
      
      console.log("作業時間保存開始:");
      console.log("送信URL:", `${MY_API_URL}/location_time`);
      console.log("送信データ:", requestData);
      
      const response = await fetch(`${MY_API_URL}/location_time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      
      console.log("レスポンス状態:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("サーバーエラーレスポンス:", errorText);
        throw new Error(`サーバーエラー: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log("所要時間をDBに保存しました:", taskName, requiredTime);
      console.log("サーバーレスポンス:", result);
      
    } catch (err) {
      console.error("所要時間保存エラー:", err);
      // ← エラーでも処理を続行（必須ではない機能として扱う）
      console.log("作業時間の保存に失敗しましたが、処理を続行します");
    }
  };

  const saveChecklistToDb = async (checkedItems: CheckedItems) => {
    try {
      const checkedList = Object.entries(checkedItems)
        .filter(([_, checked]) => checked)
        .map(([key]) => key);
      
      const requestData = {
        report_id: currentReportId,
        checked_items: checkedList,
        timestamp: new Date().toISOString()
      };
      
      console.log("チェックリスト保存開始:");
      console.log("送信URL:", `${MY_API_URL}/checklist/save`);
      console.log("送信データ:", requestData);
      
      // ← 実際のAPIエンドポイントが存在するか確認
      const response = await fetch(`${MY_API_URL}/checklist/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      
      console.log("チェックリストAPI レスポンス状態:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("チェックリストAPI サーバーエラーレスポンス:", errorText);
        throw new Error(`チェックリストAPI エラー: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log("チェック状態をDBに保存しました:", checkedList);
      console.log("チェックリストAPI レスポンス:", result);
      
    } catch (err) {
      console.error("チェックリスト保存エラー:", err);
      // ← エラーでも処理を続行
      console.log("チェックリストの保存に失敗しましたが、処理を続行します");
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
      console.log("=== 報告書提出開始 ===");
      console.log("写真数:", uploadedPhotos.length);
      console.log("選択ユーザー:", selectedPersonInCharge);
      console.log("チェック項目:", checkedItems);
      console.log("作業開始時刻:", workStartTime);
      
      // 写真のバリデーション
      if (uploadedPhotos.length === 0) {
        console.error("バリデーションエラー: 写真なし");
        throw new Error("写真を1枚以上選択してください");
      }
      
      console.log("バリデーション通過");
      
      // チェック状態を保存
      console.log("チェックリスト保存開始");
      await saveChecklistToDb(checkedItems);
      console.log("チェックリスト保存完了");
      
      // 写真がある場合は保存
      if (uploadedPhotos.length > 0) {
        console.log("写真保存開始");
        const dummyPhotoUrl = "https://example.com/photo.jpg";
        await savePhotoToDb(dummyPhotoUrl);
        console.log("写真保存完了");
      }
      
      // 実際の作業時間を計算して保存
      if (workStartTime) {
        console.log("作業時間計算開始");
        const workEndTime = new Date();
        const workDurationMs = workEndTime.getTime() - workStartTime.getTime();
        const workDurationMinutes = Math.floor(workDurationMs / 60000);
        const hours = Math.floor(workDurationMinutes / 60);
        const minutes = workDurationMinutes % 60;
        
        const requiredTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        
        console.log(`実際の作業時間: ${hours}時間${minutes}分 (${requiredTime})`);
        await saveLocationTimeToDb(currentChecklist?.title || "清掃作業", requiredTime);
        console.log("作業時間保存完了");
      }
      
      console.log("=== 報告書提出成功 ===");
      setReportModalOpen(false);
      setCompleted(true);
      
    } catch (err) {
      console.error("=== 報告書提出エラー詳細 ===");
      console.error("エラーオブジェクト:", err);
      console.error("エラータイプ:", typeof err);
      console.error("エラーメッセージ:", err instanceof Error ? err.message : err);
      console.error("スタックトレース:", err instanceof Error ? err.stack : "スタック情報なし");
      
      const errorMessage = err instanceof Error ? err.message : `不明なエラー: ${err}`;
      alert(`エラー: ${errorMessage}`);
    }
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
        {selectedTemplate === "junkai" || !currentChecklist || Object.keys(currentChecklist.data).length === 0 ? (
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