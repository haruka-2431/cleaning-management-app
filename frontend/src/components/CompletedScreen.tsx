import { CheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const CompletedScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <CheckIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">報告完了しました</h1>
          <p className="text-lg text-gray-700">お疲れ様でした！！</p>
        </div>
        <button
          onClick={() => navigate("/manager-select")}
          className="mt-6 bg-cyan-800 text-white font-medium py-4 px-20 rounded-lg"
        >
          ログイン画面に戻る
        </button>
      </div>
    </div>
  );
};

export default CompletedScreen;