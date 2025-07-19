
// propsの型定義
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

interface ReportTableProps {
  reports: Report[];
  onOpenDetail: (report: Report) => void;
}

const ReportTable = ({ reports, onOpenDetail }: ReportTableProps) => {
  return (
    <div className="border-gray-200 rounded-lg">
      <div className="bg-white border-b border-gray-200 py-4 sm:py-6 px-4 text-2xs lg:text-[16px] font-bold text-gray-400 sticky top-[120px] sm:top-[150px] lg:top-[165px] z-30 grid grid-cols-[1fr_1fr_2fr_80px] lg:grid-cols-[1fr_1fr_1fr_1fr_2fr_2fr_80px] gap-4">
        <div>担当者</div>
        <div className="hidden lg:block">追加担当者</div>
        <div>清掃タイプ</div>
        <div className="hidden lg:block">清掃場所</div>
        <div>作業開始日時</div>
        <div className="hidden lg:block">作業終了日時</div>
        <div className="text-center">詳細</div>
      </div>

      <div className="overflow-y-auto mt-14 sm:mt-22 lg:mt-1">
        {reports.map((report) => (
          <div
            key={report.id}
            className="py-3 px-4 border-b border-gray-200 hover:bg-gray-50 grid grid-cols-[1fr_1fr_2fr_80px] lg:grid-cols-[1fr_1fr_1fr_1fr_2fr_2fr_80px] gap-4 items-center"
          >
            <div className="text-xs lg:text-[16px]">{report.user}</div>
            <div className="hidden lg:block lg:text-[16px]">
              {report.subUser || "-"}
            </div>
            <div className="text-xs lg:text-[16px]">{report.type}</div>
            <div className="hidden lg:block lg:text-[16px]">{report.area}</div>
            <div className="text-xs lg:text-sm font-mono">{report.startDatetime}</div>
            <div className="hidden lg:block text-xs lg:text-sm font-mono">
              {report.endDatetime}
            </div>
            <div className="flex justify-center">
              <button
                className="btn btn-circle btn-ghost w-[30px] h-[30px] lg:w-[40px] lg:h-[40px] bg-teal-600 text-white"
                onClick={() => onOpenDetail(report)}
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
  );
};

export default ReportTable;