import { 
  UserGroupIcon, 
  Cog6ToothIcon,
  PowerIcon
} from '@heroicons/react/24/outline';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// マネージャーロール選択型定義
interface ManagerSelectProps {
  onLogout?: (() => void) | null; 
  userName?: string | null; 
  userPermissions?: string[] | null;
}

const ManagerSelect = ({
  onLogout = null, 
  userName = null, 
  userPermissions: _userPermissions = [] 
}: ManagerSelectProps) => {
  const nav = useNavigate();

  //ユーザのロールを取得
  const { setUserRole } = useAuth();

  const handleClick = (role: UserRole) => {
  // AuthContextでロール設定
  setUserRole(role);
  
  // LocalStorageに保存
  const userSelection = {
    userType: role,
    timestamp: Date.now(),
    selectedAt: new Date().toISOString()
  };
  localStorage.setItem('cleaning-manager-user', JSON.stringify(userSelection));
  
  // 画面遷移
  nav(`/${role}`);
}

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto space-y-4">
        
        {/* バックエンド実装時のログアウトボタン（現在は非表示） */}
        {onLogout && (
          <div className="absolute top-4 right-4">
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <PowerIcon className="w-4 h-4" />
              <span>ログアウト</span>
            </button>
          </div>
        )}

        {/* バックエンド実装時のユーザー情報（現在は非表示） */}
        {userName && (
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Cog6ToothIcon className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-600 text-sm">認証済みユーザー</p>
            <p className="text-cyan-600 font-medium">{userName}</p>
          </div>
        )}

        {/* 作業者ボタン */}
        <button
          onClick={() => handleClick('worker')}
          className="w-full bg-cyan-600 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
        >
          <UserGroupIcon className="w-6 h-6" />
          <span className="text-lg">作業者として使用</span>
        </button>

        {/* 管理者ボタン */}
        <button
          onClick={() => handleClick('admin')}
          className="w-full h- bg-cyan-800 text-white font-medium py-4 px-6 mt-14 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
        >
          <Cog6ToothIcon className="w-6 h-6" />
          <span className="text-lg">管理者として使用</span>
        </button>

        {/* フッター情報 */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          {!userName && <p className="text-xs mt-1">※ 開発中 - 認証なしで利用可能</p>}
        </div>
      </div>
    </div>
  );
};

export default ManagerSelect;