import {
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Report } from "../pages/ReportList";
import { formatDateTime } from "../configs/formatDateTime"; 

interface ReportDetailModalProps {
  selectedReport: Report | null;
  onClose: () => void;
  onConfirm: () => void;
}

const ReportDetailModal = ({
  selectedReport,
  onClose,
  onConfirm,
}: ReportDetailModalProps) => {
  if (!selectedReport) {
    return null;
  }

  // サンプル写真のダミーデータ
  const photos = Array.from({ length: 17 }, (_, i) => i + 1);

  return (
    <div
      className="modal modal-open bg-black"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
    >
      <div className="modal-box max-w-md lg:max-w-2xl mx-auto h-[90vh] flex flex-col p-0">
        {/* 報告書ヘッダー */}
        <div className="relative flex items-center justify-center p-6 lg:p-8 border-gray-200 bg-white">
          <h3 className="font-bold text-lg lg:text-xl">報告書詳細</h3>
          <button
            onClick={onClose}
            className="absolute right-4 p-1 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
          </button>
        </div>

        {/* スクロール可能部分のコンテンツ */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* データテーブル */}
          <div className="p-4 text-center">
            {/* PC版テーブル */}
            <table className="w-full border-collapse border border-gray-300 hidden lg:table">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-100 p-2 lg:p-3 font-medium text-xs lg:text-sm border-r border-gray-300 w-1/4">
                    担当者
                  </td>
                  <td className="p-2 lg:p-3 text-xs lg:text-sm border-r border-gray-300 w-1/4">
                    {selectedReport.user}
                  </td>
                  <td className="bg-gray-100 p-2 lg:p-3 font-medium text-xs lg:text-sm border-r border-gray-300 w-1/4">
                    清掃場所
                  </td>
                  <td className="p-2 lg:p-3 text-xs lg:text-sm w-1/4">
                    {selectedReport.area}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-100 p-2 lg:p-3 font-medium text-xs lg:text-sm border-r border-gray-300">
                    追加担当者
                  </td>
                  <td className="p-2 lg:p-3 text-xs lg:text-sm border-r border-gray-300">
                    {selectedReport.subUser || "-"}
                  </td>
                  <td className="bg-gray-100 p-2 lg:p-3 font-medium text-xs lg:text-sm border-r border-gray-300">
                    作業開始日時
                  </td>
                  <td className="p-2 lg:p-3 text-xs lg:text-sm font-mono">
                    {formatDateTime(selectedReport.startDatetime)}
                  </td>
                </tr>
                <tr>
                  <td className="bg-gray-100 p-2 lg:p-3 font-medium text-xs lg:text-sm border-r border-gray-300">
                    清掃タイプ
                  </td>
                  <td className="p-2 lg:p-3 text-xs lg:text-sm border-r border-gray-300">
                    {selectedReport.type}
                  </td>
                  <td className="bg-gray-100 p-2 lg:p-3 font-medium text-xs lg:text-sm border-r border-gray-300">
                    作業終了日時
                  </td>
                  <td className="p-2 lg:p-3 text-xs lg:text-sm font-mono">
                    {formatDateTime(selectedReport.endDatetime)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* スマホ版テーブル */}
            <table className="w-full border-collapse border border-gray-300 lg:hidden">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-100 p-2 font-medium text-xs border-r border-gray-300 w-1/2">
                    担当者
                  </td>
                  <td className="p-2 text-xs w-1/2">{selectedReport.user}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-100 p-2 font-medium text-xs border-r border-gray-300 w-1/2">
                    追加担当者
                  </td>
                  <td className="p-2 text-xs w-1/2">
                    {selectedReport.subUser || "-"}
                  </td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-100 p-2 font-medium text-xs border-r border-gray-300 w-1/2">
                    清掃タイプ
                  </td>
                  <td className="p-2 text-xs w-1/2">{selectedReport.type}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-100 p-2 font-medium text-xs border-r border-gray-300 w-1/2">
                    清掃場所
                  </td>
                  <td className="p-2 text-xs w-1/2">{selectedReport.area}</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-100 p-2 font-medium text-xs border-r border-gray-300 w-1/2">
                    作業開始日時
                  </td>
                  <td className="p-2 text-xs w-1/2 font-mono">
                    {formatDateTime(selectedReport.startDatetime)}
                  </td>
                </tr>
                <tr>
                  <td className="bg-gray-100 p-2 font-medium text-xs border-r border-gray-300 w-1/2">
                    作業終了日時
                  </td>
                  <td className="p-2 text-xs w-1/2 font-mono">
                    {formatDateTime(selectedReport.endDatetime)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 写真一覧 */}
          <div className="px-4 lg:px-6 pb-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
              {photos.map((photoId) => (
                <div
                  key={photoId}
                  className="aspect-[4/3] bg-gray-200 overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <img
                    src={`/img/work-${photoId}.jpg`}
                    alt={`作業写真${photoId}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* アクションボタン */}
          <div className="p-4 lg:p-6 space-y-3">
            <button className="btn bg-cyan-800 text-white w-full gap-2 h-12 lg:h-14 text-sm lg:text-base">
              写真を全て保存する
              <ArrowDownTrayIcon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </button>

            {selectedReport.status ? (
              <div className="flex items-center justify-center gap-2 py-3 lg:py-4 bg-teal-50 border border-teal-200 rounded-lg">
                <CheckIcon className="w-5 h-5 lg:w-6 lg:h-6 text-teal-600" />
                <span className="text-teal-600 font-medium text-sm lg:text-base">
                  確認済み
                </span>
              </div>
            ) : (
              <button
                className="btn bg-cyan-800 hover:bg-cyan-700 text-white w-full gap-2 h-12 lg:h-14 text-sm lg:text-base"
                onClick={onConfirm}
              >
                確認済みにする
                <CheckIcon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button type="button">close</button>
      </form>
    </div>
  );
};

export default ReportDetailModal;