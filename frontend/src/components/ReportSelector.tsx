interface ReportSelectorProps {
  currentReportId: number;
  setCurrentReportId: (id: number) => void;
}

const ReportSelector: React.FC<ReportSelectorProps> = ({
  currentReportId,
  setCurrentReportId
}) => {
  return (
    <div className="mb-4 p-3 bg-gray-50 rounded">
      <label className="block text-sm font-medium mb-2">レポートID:</label>
      <select
        value={currentReportId}
        onChange={(e) => setCurrentReportId(Number(e.target.value))}
        className="border p-2 rounded"
      >
        <option value={1}>レポート 1</option>
        <option value={2}>レポート 2</option>
        <option value={3}>レポート 3</option>
      </select>
    </div>
  );
};

export default ReportSelector;