import { XMarkIcon } from '@heroicons/react/24/outline';

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadedPhotos: File[];
  setUploadedPhotos: React.Dispatch<React.SetStateAction<File[]>>;
}

const PhotoModal = ({ isOpen, onClose, uploadedPhotos, setUploadedPhotos }: PhotoModalProps) => {
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-lg">アップロード済み写真 ({uploadedPhotos.length}枚)</h3>
          <div className="flex items-center space-x-2">
            <button onClick={() => setUploadedPhotos([])} className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
              全削除
            </button>
            <button onClick={onClose} className="p-2 rounded-full transition-colors">
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* 写真グリッド */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedPhotos.map((photo, index) => (
              <div key={index} className="relative group aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                <img src={URL.createObjectURL(photo)} alt={photo.name} className="w-full h-full object-cover" />
                <button onClick={() => removePhoto(index)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {uploadedPhotos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">アップロードされた写真がありません</p>
            </div>
          )}
        </div>
        
        {/* フッター */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            合計: {uploadedPhotos.length}枚 • {(uploadedPhotos.reduce((sum, photo) => sum + photo.size, 0) / 1024 / 1024).toFixed(1)}MB
          </div>
          <label className="bg-cyan-600 text-white px-4 py-2 rounded-lg">
            写真を追加
            <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;