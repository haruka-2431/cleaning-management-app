import { useState } from "react";
import {
  XMarkIcon,
  ArrowUpTrayIcon,
  PlusIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import PhotoModal from "./PhotoModal";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  uploadedPhotos: File[];
  setUploadedPhotos: React.Dispatch<React.SetStateAction<File[]>>;
  selectedPersonInCharge: string;
  setSelectedPersonInCharge: React.Dispatch<React.SetStateAction<string>>;
}

const registeredUsers: string[] = [
  "田中太郎",
  "佐藤花子",
  "山田次郎",
  "鈴木美咲",
  "高橋健太",
];
const personOptions: string[] = ["追加者なし", ...registeredUsers];

const ReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  uploadedPhotos,
  setUploadedPhotos,
  selectedPersonInCharge,
  setSelectedPersonInCharge,
}: ReportModalProps) => {
  const [isPersonDropdownOpen, setPersonDropdownOpen] =
    useState<boolean>(false);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedPhotos((prev) => [...prev, ...files]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <div className="bg-white rounded-lg w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6">
          <div className="w-5"></div>
          <h3 className="font-bold">報告書</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center">
            {uploadedPhotos.length === 0 ? (
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
              <div className="w-full space-y-3">
                <button
                  onClick={() => setShowPhotoModal(true)}
                  className="w-full h-14 bg-teal-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
                >
                  <span>写真を確認する ({uploadedPhotos.length}枚)</span>
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

            {uploadedPhotos.length > 0 && (
              <div className="mt-3 w-full bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-xs text-center">
                  <div className="bg-white p-2 rounded">
                    <div className="font-medium text-gray-900">
                      {uploadedPhotos.length}
                    </div>
                    <div className="text-gray-500">枚数</div>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <div className="font-medium text-gray-900">
                      {(
                        uploadedPhotos.reduce(
                          (sum, photo) => sum + photo.size,
                          0
                        ) /
                        1024 /
                        1024
                      ).toFixed(1)}
                      MB
                    </div>
                    <div className="text-gray-500">サイズ</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setPersonDropdownOpen(!isPersonDropdownOpen)}
              className="w-full h-14 border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between"
            >
              <span className="text-gray-700">{selectedPersonInCharge}</span>
              <ChevronDownIcon
                className={`w-4 h-4 text-gray-500 transition-transform ${isPersonDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isPersonDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {personOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedPersonInCharge(option);
                      setPersonDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 first:rounded-t-lg last:rounded-b-lg ${
                      selectedPersonInCharge === option
                        ? "bg-cyan-50 text-cyan-800"
                        : "text-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full">
            <button
              onClick={onSubmit}
              disabled={uploadedPhotos.length === 0}
              className={`w-full h-14 font-medium py-3 px-4 rounded-lg transition-colors ${
                uploadedPhotos.length === 0
                  ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                  : "bg-cyan-800 text-white"
              }`}
            >
              作業を完了する！
            </button>
          </div>
        </div>
      </div>
      <PhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        uploadedPhotos={uploadedPhotos}
        setUploadedPhotos={setUploadedPhotos}
      />
    </div>
  );
};

export default ReportModal;
