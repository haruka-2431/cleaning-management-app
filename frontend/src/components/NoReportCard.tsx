import { TabType } from "../pages/Reportlist";

interface NoReportsCardProps {
  activeTab: TabType;
}

const NoReportsCard = ({ activeTab }: NoReportsCardProps) => {
  return (
    <div className="card bg-white shadow-md mt-6">
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
  );
};

export default NoReportsCard;
