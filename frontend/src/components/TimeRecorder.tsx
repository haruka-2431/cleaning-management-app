import { useState, useEffect } from "react";

export const MY_API_URL = "http://localhost:3000/api/another";

interface LocationTime {
  id: number;
  report_id: number;
  task_name: string;
  required_time: string;
}

interface TimeRecorderProps {
  reportId: number;
}

const TimeRecorder: React.FC<TimeRecorderProps> = ({ reportId }) => {
  const [locationTimes, setLocationTimes] = useState<LocationTime[]>([]);

  const fetchLocationTimes = async () => {
    try {
      const res = await fetch(
        `${MY_API_URL}/location_time/select_by_report/${reportId}`
      );
      if (res.ok) {
        const data = await res.json();
        setLocationTimes(data);
      }
    } catch (err) {
      console.error("所要時間取得エラー:", err);
    }
  };

  const saveLocationTime = async (taskName: string, requiredTime: string) => {
    try {
      await fetch(`${MY_API_URL}/location_time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: reportId,
          task_name: taskName,
          required_time: requiredTime,
        }),
      });
      await fetchLocationTimes();
    } catch (err) {
      console.error("所要時間保存エラー:", err);
    }
  };

  useEffect(() => {
    fetchLocationTimes();
  }, [reportId]);

  return (
    <div className="p-3 bg-yellow-50 rounded">
      <h4 className="font-medium mb-2">所要時間記録</h4>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const taskName = formData.get("task_name") as string;
          const requiredTime = formData.get("required_time") as string;
          if (taskName && requiredTime) {
            saveLocationTime(taskName, requiredTime);
            (e.target as HTMLFormElement).reset();
          }
        }}
      >
        <div className="flex gap-2 mb-2">
          <input
            name="task_name"
            type="text"
            placeholder="作業内容"
            className="border p-1 rounded text-sm flex-1"
            required
          />
          <input
            name="required_time"
            type="time"
            step="60"
            className="border p-1 rounded text-sm"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-2 py-1 text-sm rounded"
          >
            記録
          </button>
        </div>
      </form>

      {locationTimes.length > 0 && (
        <div className="text-xs space-y-1">
          {locationTimes.map((time) => (
            <div key={time.id} className="flex justify-between">
              <span>{time.task_name}</span>
              <span>{time.required_time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeRecorder;
