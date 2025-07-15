import { useState } from "react";
import Header from "../components/Header";
import {
  ArrowDownTrayIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";


// レポートデータの型定義
interface Report {
  id: number;
  user: string;
  subUser?: string;
  type: string;
  area: string;
  startDatetime: string;
  endDatetime: string;
  status: boolean;
}

// タブの型定義
type TabType = "unconfirmed" | "confirmed";

const ReportList = () => {
   const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("unconfirmed");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // サンプルレポートデータ
  const reportData: Report[] = [
    {
      id: 1,
      user: "田中太郎",
      subUser: "佐藤花子",
      type: "民泊清掃",
      area: "天神民泊",
      startDatetime: "2024-01-15 09:00",
      endDatetime: "2024-01-15 12:30",
      status: false,
    },
    {
      id: 2,
      user: "山田次郎",
      subUser: "-",
      type: "施設清掃",
      area: "",
      startDatetime: "2024-01-15 14:00",
      endDatetime: "2024-01-15 17:00",
      status: false,
    },
    {
      id: 3,
      user: "鈴木美咲",
      subUser: "高橋健太",
      type: "ハウスクリーニング",
      area: "-",
      startDatetime: "2024-01-14 10:00",
      endDatetime: "2024-01-14 15:30",
      status: true,
    },
    {
      id: 4,
      user: "佐藤花子",
      subUser: "-",
      type: "巡回清掃",
      area: "ゆうはな",
      startDatetime: "2024-01-14 08:00",
      endDatetime: "2024-01-14 10:00",
      status: true,
    },
    {
      id: 5,
      user: "高橋健太",
      subUser: "田中太郎",
      type: "民泊清掃",
      area: "春吉民泊",
      startDatetime: "2024-01-13 11:00",
      endDatetime: "2024-01-13 14:30",
      status: false,
    },
    {
      id: 6,
      user: "田中太郎",
      subUser: "-",
      type: "施設清掃",
      area: "ゆうはな",
      startDatetime: "2024-01-13 15:00",
      endDatetime: "2024-01-13 18:00",
      status: true,
    },
    {
      id: 7,
      user: "田中太郎",
      subUser: "-",
      type: "施設清掃",
      area: "ゆうはな",
      startDatetime: "2024-01-13 15:00",
      endDatetime: "2024-01-13 18:00",
      status: true,
    },
    {
      id: 8,
      user: "田中太郎",
      subUser: "-",
      type: "施設清掃",
      area: "ゆうはな",
      startDatetime: "2024-01-13 15:00",
      endDatetime: "2024-01-13 18:00",
      status: true,
    },
    {
      id: 9,
      user: "田中太郎",
      subUser: "-",
      type: "施設清掃",
      area: "ゆうはな",
      startDatetime: "2024-01-13 15:00",
      endDatetime: "2024-01-13 18:00",
      status: true,
    },
    {
      id: 10,
      user: "田中太郎",
      subUser: "-",
      type: "施設清掃",
      area: "",
      startDatetime: "2024-01-13 15:00",
      endDatetime: "2024-01-13 18:00",
      status: true,
    },
    {
      id: 11,
      user: "田中太郎",
      subUser: "-",
      type: "施設清掃",
      area: "ゆうはな",
      startDatetime: "2024-01-13 15:00",
      endDatetime: "2024-01-13 18:00",
      status: true,
    },
    {
      id: 12,
      user: "田中太郎",
      subUser: "-",
      type: "施設清掃",
      area: "ゆうはな",
      startDatetime: "2024-01-13 15:00",
      endDatetime: "2024-01-13 18:00",
      status: true,
    },
    {
      id: 13,
      user: "田中太郎",
      subUser: "-",
      type: "施設清掃",
      area: "ゆうはな",
      startDatetime: "2024-01-13 15:00",
      endDatetime: "2024-01-13 18:00",
      status: true,
    },
    {
      id: 14,
      user: "田中太郎",
      subUser: "-",
      type: "施設清掃",
      area: "ゆうはな",
      startDatetime: "2024-01-13 15:00",
      endDatetime: "2024-01-13 18:00",
      status: true,
    },
  ];

  const filteredReports = reportData.filter((report) =>
    activeTab === "unconfirmed" ? !report.status : report.status
  );

  const openDetailModal = (report: Report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedReport(null);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="レポート一覧"
        className="fixed top-0 left-0 right-0 z-50"
      />

      {/* メインコンテンツ */}
      <div className="container mx-auto px-4 py-6 lg:pt-30">
        <div
          role="tablist"
          className="tabs tabs-lift w-full sticky top-20 sm:top-28 lg:top-32 bg-white z-40"
        >
          <button
            role="tab"
            className={`tab tab-lifted flex-1 text-sm  ${
              activeTab === "unconfirmed"
                ? "tab-active text-white hover:text-white [--tab-bg:theme(colors.cyan-800)] [--tab-border-color:theme(colors.cyan-800)]"
                : "hover:text-cyan-600"
            }`}
            onClick={() => setActiveTab("unconfirmed")}
          >
            未確認
          </button>
          <button
            role="tab"
            className={`tab tab-lifted flex-1 text-sm  ${
              activeTab === "confirmed"
                ? "tab-active text-white hover:text-white [--tab-bg:theme(colors.cyan-800)] [--tab-border-color:theme(colors.cyan-800)]"
                : "hover:text-cyan-600"
            }`}
            onClick={() => setActiveTab("confirmed")}
          >
            確認済み
          </button>
        </div>

        {/* 統一テーブル (PC・スマホ共通) */}
        <div>
          <div className="border-gray-200 rounded-lg">
            {/* 固定項目 */}
            <div className="bg-white border-b border-gray-200 py-4 sm:py-6 px-4 text-2xs lg:text-[16px] font-bold text-gray-400 sticky top-[120px] sm:top-[150px] lg:top-[165px] z-30 grid grid-cols-[1fr_1fr_2fr_80px] lg:grid-cols-[1fr_1fr_1fr_1fr_2fr_2fr_80px] gap-4">
              <div>担当者</div>
              <div className="hidden lg:block">追加担当者</div>
              <div>清掃タイプ</div>
              <div className="hidden lg:block">清掃場所</div>
              <div>作業開始日時</div>
              <div className="hidden lg:block">作業終了日時</div>
              <div className="text-center">詳細</div>
            </div>

            {/* リスト部分 */}
            <div className="overflow-y-auto mt-14 sm:mt-22 lg:mt-1">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="py-3 px-4 border-b border-gray-200 hover:bg-gray-50 grid grid-cols-[1fr_1fr_2fr_80px] lg:grid-cols-[1fr_1fr_1fr_1fr_2fr_2fr_80px] gap-4 items-center"
                >
                  <div className="text-xs lg:text-[16px]">{report.user}</div>
                  <div className="hidden lg:block lg:text-[16px]">
                    {report.subUser || "-"}
                  </div>
                  <div className="text-xs lg:text-[16px]">
                    {report.type}
                  </div>
                  <div className="hidden lg:block lg:text-[16px]">
                    {report.area}
                  </div>
                  <div className="text-xs lg:text-sm font-mono">
                    {report.startDatetime}
                  </div>
                  <div className="hidden lg:block text-xs lg:text-sm font-mono">
                    {report.endDatetime}
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="btn btn-circle btn-ghost w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] bg-teal-600 text-white"
                      onClick={() => openDetailModal(report)}
                    >
                      <svg
                        className="w-5 h-5 lg:w-6 lg:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* データがない場合 */}
        {filteredReports.length === 0 && (
          <div className="card bg-white shadow-md">
            <div className="card-body text-center py-12">
              <div className="text-base-content/50 text-lg mb-2">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-base-content/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {activeTab === "unconfirmed" ? "未確認" : "確認済み"}
                のレポートはありません
              </div>
              <p className="text-sm text-base-content/40">
                作業完了後にレポートがここに表示されます
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 詳細モーダル */}
      {showDetailModal && selectedReport && (
        <div
          className="modal modal-open bg-black"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
          <div className="modal-box max-w-md lg:max-w-2xl mx-auto h-[90vh] flex flex-col p-0">
            {/* 報告書ヘッダー */}
            <div className="relative flex items-center justify-center p-6 lg:p-8 border-gray-200 bg-white">
              <h3 className="font-bold text-lg lg:text-xl">報告書詳細</h3>
              <button
                onClick={closeDetailModal}
                className="absolute right-4 p-1 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5 lg:w-6 lg:h-6 text-gray-500" />
              </button>
            </div>

            {/* スクロール可能部分のコンテンツ */}
            <div className="flex-1 overflow-y-auto bg-white">
              {/* データテーブル */}
              <div className="p-4 text-center">
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="bg-gray-100 p-2 lg:p-3 font-medium text-xs lg:text-sm border-r border-gray-300 w-1/4">
                        担当者
                      </td>
                      <td className="p-2 lg:p-3 text-xs lg:text-sm border-r border-gray-300 w-1/4">
                        {selectedReport.user}
                      </td>
                      <td className="hide-on-mobile bg-gray-100 p-2 lg:p-3 font-medium text-xs lg:text-sm border-r border-gray-300 w-1/4">
                        清掃場所
                      </td>
                      <td className="hide-on-mobile p-2 lg:p-3 text-xs lg:text-sm w-1/4">
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
                      <td className="hide-on-mobile bg-gray-100 p-2 lg:p-3 font-medium text-xs lg:text-sm border-r border-gray-300">
                        作業開始日時
                      </td>
                      <td className="hide-on-mobile p-2 lg:p-3 text-xs lg:text-sm font-mono">
                        {selectedReport.startDatetime}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-gray-100 p-2 lg:p-3 font-medium text-xs lg:text-sm border-r border-gray-300">
                        清掃タイプ
                      </td>
                      <td className="p-2 lg:p-3 text-xs lg:text-sm border-r border-gray-300">
                        {selectedReport.type}
                      </td>
                      <td className="hide-on-mobile bg-gray-100 p-2 lg:p-3 font-medium text-xs lg:text-sm border-r border-gray-300">
                        作業終了日時
                      </td>
                      <td className="hide-on-mobile p-2 lg:p-3 text-xs lg:text-sm font-mono">
                        {selectedReport.endDatetime}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* スマホで非表示にした項目を縦に表示 */}
                <table className="show-on-mobile w-full border-collapse border border-gray-300 border-t-0">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="bg-gray-100 p-2 font-medium text-xs border-r border-gray-300 w-1/2">
                        清掃場所
                      </td>
                      <td className="p-2 text-xs w-1/2">
                        {selectedReport.area}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="bg-gray-100 p-2 font-medium text-xs border-r border-gray-300">
                        作業開始日時
                      </td>
                      <td className="p-2 text-xs font-mono">
                        {selectedReport.startDatetime}
                      </td>
                    </tr>
                    <tr>
                      <td className="bg-gray-100 p-2 font-medium text-xs border-r border-gray-300">
                        作業終了日時
                      </td>
                      <td className="p-2 text-xs font-mono">
                        {selectedReport.endDatetime}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 写真一覧 */}
              <div className="px-4 lg:px-6 pb-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
                  {/* サンプル写真 */}
                  {[
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                  ].map((photoId) => (
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
                  // 確認済みの場合：ステータス表示
                  <div className="flex items-center justify-center gap-2 py-3 lg:py-4 bg-teal-50 border border-teal-200 rounded-lg">
                    <CheckIcon className="w-5 h-5 lg:w-6 lg:h-6 text-teal-600" />
                    <span className="text-teal-600 font-medium text-sm lg:text-base">
                      確認済み
                    </span>
                  </div>
                ) : (
                  // 未確認の場合：確認ボタン
                  <button
                    className="btn bg-cyan-800 hover:bg-cyan-700 text-white w-full gap-2 h-12 lg:h-14 text-sm lg:text-base"
                    onClick={() => {
                      setActiveTab("confirmed");
                      closeDetailModal();
                      alert("確認済みに変更しました");
                    }}
                  >
                    確認済みにする
                    <CheckIcon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <form
            method="dialog"
            className="modal-backdrop"
            onClick={closeDetailModal}
          >
            <button type="button">close</button>
          </form>
        </div>
      )}

      {/* 固定編集ボタン */}
        <div className="fixed bottom-0 left-0 right-0 px-4 py-8 z-10 bg-white">
          <button className="btn bg-cyan-800 text-white w-full gap-2 shadow-lg h-14"
          onClick={() => nav("/adimn/cleaning-edit")}>
            データの編集
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>
      </div>

    </div>
  );
};

export default ReportList;



// レポート送ったら送った通知を画面に表示