import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { getTemplateByTypeAndLocation } from "../components/ChecklistItem";
import { PlusIcon } from "@heroicons/react/24/outline";
import ChecklistSection from "../components/ChecklistSection";
import ReportModal from "../components/ReportModal";
import CompletedScreen from "../components/CompletedScreen";

export const MY_API_URL = "http://localhost:3000/another";

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

  // ID取得用のヘルパー関数
  const getTypeIdByName = async (typeName: string): Promise<number> => {
    try {
      const response = await fetch(`${MY_API_URL}/cleaning_type`);
      const data = await response.json();
      const type = data.find((item: any) => item.type_name === typeName);
      return type ? type.id : 1;
    } catch (err) {
      console.error("type_id取得エラー:", err);
      return 1; // デフォルト値
    }
  };

  const getAreaIdByName = async (areaName: string): Promise<number> => {
    try {
      // 特別なケース：巡回清掃・ハウスクリーニング・選択なしの場合
      if (areaName === "選択なし") {
        const currentType = cleaningData?.type;
        if (currentType === "巡回清掃") {
          return 1; // 巡回清掃用のarea_id
        } else if (currentType === "ハウスクリーニング") {
          return 2; // ハウスクリーニング用のarea_id
        } else {
          return 1; // デフォルト
        }
      }
      
      const response = await fetch(`${MY_API_URL}/cleaning_area`);
      const data = await response.json();
      const area = data.find((item: any) => item.area_name === areaName);
      return area ? area.id : 1;
    } catch (err) {
      console.error("area_id取得エラー:", err);
      return 1; // デフォルト値
    }
  };
  
  // テンプレート取得
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
    }
  }, [workStartTime]);

  // 写真保存関数
  const savePhotoToDbWithReportId = async (photoUrl: string, reportId: number) => {
    try {
      const requestData = {
        report_id: reportId,
        photo_url: photoUrl,
        posted_datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      
      const response = await fetch(`${MY_API_URL}/photo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("写真API エラー:", errorText);
        throw new Error(`写真API エラー: ${response.status} - ${errorText}`);
      }
      
    } catch (err) {
      console.error("写真保存エラー:", err);
      throw err;
    }
  };

  const saveLocationTimeToDbWithReportId = async (taskName: string, requiredTime: string, reportId: number) => {
    try {
      const requestData = {
        report_id: reportId,
        task_name: taskName,
        required_time: requiredTime,
      };
      
      const response = await fetch(`${MY_API_URL}/location_time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("作業時間API エラー:", errorText);
        throw new Error(`作業時間API エラー: ${response.status} - ${errorText}`);
      }
      
    } catch (err) {
      console.error("作業時間保存エラー:", err);
      throw err;
    }
  };

  const saveChecklistToDbWithReportId = async (checkedItems: CheckedItems, reportId: number) => {
    try {
      const checkedList = Object.entries(checkedItems)
        .filter(([_, checked]) => checked)
        .map(([key]) => key);
      
      const requestData = {
        report_id: reportId,
        checked_items: checkedList,
        timestamp: new Date().toISOString()
      };
      
      const response = await fetch(`${MY_API_URL}/checklist/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("チェックリストAPI エラー:", errorText);
      }
      
    } catch (err) {
      console.error("チェックリスト保存エラー:", err);
    }
  };

  // メインのsubmitReport関数
  const submitReport = async () => {
    try {
      // 写真のバリデーション
      if (uploadedPhotos.length === 0) {
        throw new Error("写真を1枚以上選択してください");
      }
      
      // STEP 1: cleaning_reportレコードを作成
      const workEndTime = new Date();
      
      // 動的にIDを取得
      const typeId = await getTypeIdByName(cleaningData?.type || "民泊清掃");
      const areaId = await getAreaIdByName(cleaningData?.location || "選択なし");
      
      const reportData = {
        user_id: 1,  // TODO: 実際のユーザーIDに変更（ログイン機能実装後）
        sub_user_id: selectedPersonInCharge !== "追加者なし" ? 2 : null,  // TODO: 実際のサブユーザーIDに変更
        type_id: typeId,
        area_id: areaId,
        start_datetime: workStartTime?.toISOString().slice(0, 19).replace('T', ' ') || new Date().toISOString().slice(0, 19).replace('T', ' '),
        end_datetime: workEndTime.toISOString().slice(0, 19).replace('T', ' '),
        status: false  // 未確認として作成
      };
      
      const reportResponse = await fetch(`${MY_API_URL}/cleaning_report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      });
      
      if (!reportResponse.ok) {
        const errorText = await reportResponse.text();
        console.error("cleaning_reportエラー:", errorText);
        throw new Error(`cleaning_report作成エラー: ${reportResponse.status} - ${errorText}`);
      }
      
      const reportResult = await reportResponse.json();
      const actualReportId = reportResult.insertedId;
      
      // STEP 2: 実際のreport_idを使ってチェックリスト保存
      await saveChecklistToDbWithReportId(checkedItems, actualReportId);
      
      // STEP 3: 実際のreport_idを使って写真保存
      if (uploadedPhotos.length > 0) {
        const dummyPhotoUrl = "https://example.com/photo.jpg";
        await savePhotoToDbWithReportId(dummyPhotoUrl, actualReportId);
      }
      
      // STEP 4: 実際のreport_idを使って作業時間保存
      if (workStartTime) {
        const workDurationMs = workEndTime.getTime() - workStartTime.getTime();
        const workDurationMinutes = Math.floor(workDurationMs / 60000);
        const hours = Math.floor(workDurationMinutes / 60);
        const minutes = workDurationMinutes % 60;
        
        const requiredTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
        
        await saveLocationTimeToDbWithReportId(cleaningData?.location || "清掃作業", requiredTime, actualReportId);
      }
      
      setReportModalOpen(false);
      setCompleted(true);
      
    } catch (err) {
      console.error("報告書提出エラー:", err);
      const errorMessage = err instanceof Error ? err.message : `不明なエラー: ${err}`;
      alert(`エラー: ${errorMessage}`);
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