import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import "../css/style.css";
import CleanSelect from "./CleanSelect";
import CheckList from "./CheckList";
import ReportList from "./ReportList";
import ManagerSelect from "./ManagerSelect";
import OpeningAnimation from "./Opening";

// 型定義
type UserRole = 'admin' | 'worker' | '';

interface CleaningData {
  type: string;
  location: string;
}

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isNavigatingRef = useRef(false); 

  // アプリの初期化状態
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  
  // 現在の画面管理
  const [currentScreen, setCurrentScreen] = useState('ManagerSelect');
  const [userRole, setUserRole] = useState<UserRole>(''); 
  const [cleaningData, setCleaningData] = useState<CleaningData>({
    type: '',
    location: ''
  });

  // オープニングアニメーション完了時の処理
  const handleOpeningComplete = () => {
    setIsAppInitialized(true);
  };

  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/manager-select') {
      setCurrentScreen('ManagerSelect');
    } else if (path === '/worker' || path === '/cleanSelect') {
      setCurrentScreen('cleanSelect');
    } else if (path === '/worker/checklist' || path === '/checklist') {
      setCurrentScreen('checklist');
    } else if (path === '/admin/reports' || path === '/reports') {
      setCurrentScreen('reportList');
    }
  }, [location.pathname]);

 
  useEffect(() => {
    if (isNavigatingRef.current) return;
    
    const currentPath = location.pathname;
    let targetPath = '';

    switch (currentScreen) {
      case 'ManagerSelect':
        targetPath = '/manager-select';
        break;
      case 'cleanSelect':
        targetPath = userRole === 'worker' ? '/worker' : '/cleanSelect';
        break;
      case 'checklist':
        targetPath = userRole === 'worker' ? '/worker/checklist' : '/checklist';
        break;
      case 'reportList':
        targetPath = userRole === 'admin' ? '/admin/reports' : '/reports';
        break;
      default:
        targetPath = '/manager-select';
    }

    if (currentPath !== targetPath) {
      isNavigatingRef.current = true; // ナビゲーション開始
      navigate(targetPath, { replace: true });
      
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 100);
    }
  }, [currentScreen, userRole, navigate, location.pathname]); 

  // 役割選択時に呼ばれる関数
  const handleManagerSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === 'admin') {
      setCurrentScreen('reportList');
    } else if (role === 'worker') {
      setCurrentScreen('cleanSelect');
    }
  };

  // 作業開始時に呼ばれる関数
  const handleStartWork = (type: string, location: string) => {
    setCleaningData({ type, location });
    setCurrentScreen('checklist');
  };

  //  選択画面に戻る関数
  const handleBackToSelect = () => {
    setCurrentScreen('cleanSelect');
    setCleaningData({ type: '', location: '' });
  };

  // レポート一覧画面に遷移する関数
  const handleGoToReportList = () => {
    setCurrentScreen('reportList');
  };

  // 最初の役割選択画面に戻る関数
  const handleBackToManagerSelect = () => {
    setCurrentScreen('ManagerSelect');
    setUserRole('');
    setCleaningData({ type: '', location: '' });
  };


  // オープニングアニメーションの表示
  if (!isAppInitialized) {
    return <OpeningAnimation onComplete={handleOpeningComplete} />;
  }

  // 役割選択画面の表示
  if (currentScreen === 'ManagerSelect') {
    return (
      <ManagerSelect 
        onSelectRole={handleManagerSelect}
      />
    );
  }

  // 選択画面の表示
  if (currentScreen === 'cleanSelect') {
    return (
      <>
        <div className="select-container">
          <CleanSelect 
            onStartWork={handleStartWork} 
            onBackToSelect={handleBackToManagerSelect}
            onGoToReportList={handleGoToReportList}
            userRole={userRole}
          />
        </div>
      </>
    );
  }

  // チェックリスト画面の表示
  if (currentScreen === 'checklist') {
    return (
      <CheckList 
        cleaningData={cleaningData}
        onBackToSelect={handleBackToSelect}
      />
    );
  }

  // レポート一覧画面の表示
  if (currentScreen === 'reportList') {
    return (
      <ReportList 
        onBackClick={handleBackToManagerSelect}
        userRole={userRole}
      />
    );
  }

  return (
    <ManagerSelect onSelectRole={handleManagerSelect} />
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* すべてのルートでAppContentを表示 */}
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;