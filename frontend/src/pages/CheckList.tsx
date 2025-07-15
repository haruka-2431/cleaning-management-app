// src/components/CheckListScreen.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { checklistTemplates, getTemplateByTypeAndLocation } from '../components/CheckListItem';
import { PlusIcon } from '@heroicons/react/24/outline';
import ChecklistSection from '../components/CheckListSection'; 
import ReportModal from '../components/ReportModal';       
import CompletedScreen from '../components/CompletedScreen';   

interface CheckedItems {
  [key: string]: boolean;
}

interface ChecklistTemplate {
  title: string;
  data: {
    [section: string]: string[];
  };
}

const CheckListScreen = () => {
  const nav = useNavigate();
  const location = useLocation();
  const cleaningData = location.state;

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [completed, setCompleted] = useState<boolean>(false);
  const [selectedPersonInCharge, setSelectedPersonInCharge] = useState<string>('追加者なし');

  useEffect(() => {
    if (cleaningData && cleaningData.type && cleaningData.location) {
      const template = getTemplateByTypeAndLocation(cleaningData.type, cleaningData.location);
      if (template) {
        setSelectedTemplate(template);
      }
    }
  }, [cleaningData]);

  const currentChecklist: ChecklistTemplate | undefined = selectedTemplate
    ? (checklistTemplates as any)[selectedTemplate]
    : undefined;

  const toggleCheck = (section: string, item: string) => {
    const key = `${selectedTemplate}-${section}-${item}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const generateReport = () => {
    setReportModalOpen(true);
  };

  const submitReport = () => {
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
          {cleaningData?.type === '巡回清掃' 
            ? '巡回清掃' 
            : (currentChecklist?.title || cleaningData?.location)
          }
        </h2>
        <p className="text-sm opacity-90">
          {cleaningData?.type === '巡回清掃' ? '' : 'チェックリスト'}
        </p>
      </div>

      <div className="relative flex-1 overflow-y-auto mb-28">
        {selectedTemplate === 'junkai' ? (
          <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <p className="text-gray-500 text-lg text-center">チェックリストはありません</p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {currentChecklist && Object.entries(currentChecklist.data).map(([section, items]) => (
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

      {selectedTemplate !== 'junkai' && (
        <div className="fixed bottom-32 right-4 z-20">
        </div>
      )}

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

export default CheckListScreen;