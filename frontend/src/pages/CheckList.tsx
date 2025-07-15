import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Header from '../components/Header';
import { checklistTemplates, getTemplateByTypeAndLocation } from '../components/CheckListItem';
import {  
  PlusIcon, 
  CheckIcon, 
  ChevronDownIcon, 
  XMarkIcon, 
  ArrowUpTrayIcon 
} from '@heroicons/react/24/outline';

// チェック状態の型定義
interface CheckedItems {
  [key: string]: boolean;
}

// チェックリストテンプレートの型定義
interface ChecklistTemplate {
  title: string;
  data: {
    [section: string]: string[];
  };
}

const CheckList = () => {
  const nav = useNavigate();
  const location = useLocation();
  const cleaningData = location.state;

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [checkedItems, setCheckedItems] = useState<CheckedItems>({});
  const [ReportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [selectedPersonInCharge, setSelectedPersonInCharge] = useState<string>('追加者なし');
  const [isPersonDropdownOpen, PersonDropdownOpen] = useState<boolean>(false);
  const [completed, setcompleted] = useState<boolean>(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);

  // cleaningDataが変更されたときのテンプレート設定
  useEffect(() => {
    if (cleaningData && cleaningData.type && cleaningData.location) {
      const template = getTemplateByTypeAndLocation(cleaningData.type, cleaningData.location);
      if (template) {
        setSelectedTemplate(template);
      }
    }
  }, [cleaningData]);

  const currentChecklist: ChecklistTemplate | undefined = selectedTemplate ? 
    (checklistTemplates as any)[selectedTemplate] : undefined;

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

  const closeReportModal = () => {
    setReportModalOpen(false);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const submitReport = () => {
    setReportModalOpen(false);
    setcompleted(true);
  };

  // 登録ユーザーのリスト（実際の実装では、propsから取得）
  const registeredUsers: string[] = [
    '田中太郎',
    '佐藤花子',
    '山田次郎',
    '鈴木美咲',
    '高橋健太'
  ];

  const personOptions: string[] = [
    '追加者なし',
    ...registeredUsers
  ];

  const resetToLogin = () => {
    setcompleted(false);
    setCheckedItems({});
    setSelectedTemplate('');
    setSelectedPersonInCharge('追加者なし');
    setUploadedPhotos([]);
    setShowPhotoModal(false);
    nav("/manager-select"); // 親コンポーネントの関数を呼び出し
  };

  // 完了画面の表示
  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-8">
          {/* チェックアイコン */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <CheckIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* 完了メッセージ */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">報告完了しました</h1>
            <p className="text-lg text-gray-700">お疲れ様でした！！</p>
          </div>
          
          {/* ログイン画面に戻るボタン */}
          <button
            onClick={resetToLogin}
            className="mt-6 bg-cyan-800 text-white font-medium py-4 px-20 rounded-lg"
          >
            ログイン画面に戻る
          </button>
        </div>
      </div>
    );
  }

  // チェックリスト画面の表示
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="チェックリスト・報告書" />
      {/* 固定題目 */}
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

      {/* スクロール可能なコンテンツ */}
      <div className="relative flex-1 overflow-y-auto mb-28">
        {selectedTemplate === 'junkai' ? (
          // 巡回清掃の場合：「チェックリストはありません」を中央に表示
          <div className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <p className="text-gray-500 text-lg text-center">チェックリストはありません</p>
          </div>
        ) : (
          // その他の清掃タイプ：通常のチェックリスト表示
          <div className="p-4 space-y-6">
            {currentChecklist && Object.entries(currentChecklist.data).map(([section, items]) => (
              <div key={section} className="bg-white rounded-lg shadow-sm">
                <div className="bg-gray-200 px-4 py-3 rounded-t-lg">
                  <h3 className="font-medium text-gray-800">{section}</h3>
                </div>
                
                <div className="p-4 space-y-3">
                  {(items as string[]).map((item: string, index: number) => {
                    const key = `${selectedTemplate}-${section}-${item}`;
                    const isChecked = checkedItems[key] || false;
                    
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <button
                          onClick={() => toggleCheck(section, item)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            isChecked 
                              ? 'bg-teal-600 border-teal-600 text-white' 
                              : 'border-gray-300'
                          }`}
                        >
                          {isChecked && <CheckIcon className="w-3 h-3" />}
                        </button>
                        
                        <label 
                          className={`text-sm cursor-pointer flex-1 ${
                            isChecked ? 'text-gray-500 line-through' : 'text-gray-700'
                          }`}
                          onClick={() => toggleCheck(section, item)}
                        >
                          {item}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 固定左下のアイコン - 巡回清掃以外のみ表示 */}
      {selectedTemplate !== 'junkai' && (
        <div className="fixed bottom-32 right-4 z-20">
          <div className="w-15 h-15 bg-white border border-neutral-300 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-800">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
            </svg>
          </div>
        </div>
      )}

      {/* 写真確認モーダル */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* 写真モーダルヘッダー */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">アップロード済み写真 ({uploadedPhotos.length}枚)</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setUploadedPhotos([])}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
                >
                  全削除
                </button>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="p-2 rounded-full transition-colors"
                >
                </button>
              </div>
            </div>
            
            {/* 写真グリッド */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {uploadedPhotos.map((photo, index) => {
                  console.log(`Photo ${index}:`, photo);
                  console.log(`Photo ${index} type:`, photo.type);
                  console.log(`Photo ${index} size:`, photo.size);
                  
                  return (
                    <div key={index} className="relative group">
                      <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={photo.name}
                          className="w-full h-full object-cover"
                          onLoad={() => {
                            console.log(`✅ Image ${index} loaded successfully`);
                          }}
                          onError={(e) => {
                            console.error(`❌ Image ${index} failed to load:`, e);
                          }}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            display: 'block'
                          }}
                        />
                      </div>
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-end opacity-0 group-hover:opacity-100">
                        <div className="w-full p-2 text-white">
                          <p className="text-xs truncate font-medium">{photo.name}</p>
                          <p className="text-xs text-gray-300">{(photo.size / 1024).toFixed(0)}KB</p>
                        </div>
                      </div>
                      
                      {/* 削除ボタン */}
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
              
              {uploadedPhotos.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">アップロードされた写真がありません</p>
                </div>
              )}
            </div>
            
            {/* 写真モーダルフッター */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                合計: {uploadedPhotos.length}枚 • {(uploadedPhotos.reduce((sum, photo) => sum + photo.size, 0) / 1024 / 1024).toFixed(1)}MB
              </div>
              <div className="flex space-x-2">
                <label className="bg-cyan-600 text-white px-4 py-2 rounded-lg">
                  写真を追加
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => {
                    setShowPhotoModal(false);
                    setReportModalOpen(true);
                  }}
                  className="bg-cyan-800 text-white px-4 py-2 rounded-lg"
                >
                  報告書に戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 固定下部ボタン - 全ての清掃タイプで表示 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-8">
        <button
          onClick={generateReport}
          className="w-full h-14 bg-cyan-800 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
        >
          <span>報告書を作成する</span>
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 報告書モーダル */}
      {ReportModalOpen && !showPhotoModal && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <div className="bg-white rounded-lg w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            {/* モーダルヘッダー */}
            <div className="flex items-center justify-between p-6">
              <div className='w-5'></div>
              <h3 className="font-bold">報告書</h3>
              <button
                onClick={closeReportModal}
                className="p-1 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* 報告書モーダル コンテンツ */}
            <div className="p-6 space-y-6">
              {/* 写真アップロード/確認ボタン */}
              <div className="flex flex-col items-center">
                {uploadedPhotos.length === 0 ? (
                  // 写真がない場合：アップロードボタン
                  <label className="w-full h-14 bg-cyan-800 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 cursor-pointer">
                    <span>写真をアップロード</span>
                    <ArrowUpTrayIcon className="w-9 h-6" />
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  // 写真がある場合：確認ボタンと追加ボタン
                  <div className="w-full space-y-3">
                    <button 
                      onClick={() => setShowPhotoModal(true)}
                      className="w-full h-14 bg-teal-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
                    >
                      <span>写真を確認する ({uploadedPhotos.length}枚)</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    
                    <label className="w-full h-12 bg-teal-100 text-teal-800 border border-teal-300 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 cursor-pointer">
                      <span>写真を追加</span>
                      <PlusIcon className="w-4 h-4" />
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
                
                {/* 写真統計情報 */}
                {uploadedPhotos.length > 0 && (
                  <div className="mt-3 w-full bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-xs text-center">
                      <div className="bg-white p-2 rounded">
                        <div className="font-medium text-gray-900">{uploadedPhotos.length}</div>
                        <div className="text-gray-500">枚数</div>
                      </div>
                      <div className="bg-white p-2 rounded">
                        <div className="font-medium text-gray-900">{(uploadedPhotos.reduce((sum, photo) => sum + photo.size, 0) / 1024 / 1024).toFixed(1)}MB</div>
                        <div className="text-gray-500">サイズ</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 担当者選択ボタン */}
              <div className="relative">
                <button
                  onClick={() => PersonDropdownOpen(!isPersonDropdownOpen)}
                  className="w-full h-14 border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between"
                >
                  <span className="text-gray-700">{selectedPersonInCharge}</span>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isPersonDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isPersonDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {personOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedPersonInCharge(option);
                          PersonDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 first:rounded-t-lg last:rounded-b-lg ${
                          selectedPersonInCharge === option ? 'bg-cyan-50 text-cyan-800' : 'text-gray-700'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 送信ボタン */}
              <div className="w-full">
                <button
                  onClick={submitReport}
                  disabled={uploadedPhotos.length === 0}
                  className={`w-full h-14 font-medium py-3 px-4 rounded-lg transition-colors ${
                    uploadedPhotos.length === 0 
                      ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed' 
                      : 'bg-cyan-800 text-white'
                  }`}
                >
                  作業を完了する！
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckList;