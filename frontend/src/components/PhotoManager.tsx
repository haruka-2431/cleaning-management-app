import { useState, useEffect } from "react";

export const MY_API_URL = "http://localhost:3000/api/another";

interface Photo {
  id: number;
  report_id: number;
  photo_url: string;
  posted_datetime: string;
}

interface PhotoManagerProps {
  reportId: number;
}

const PhotoManager: React.FC<PhotoManagerProps> = ({ reportId }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const fetchPhotos = async () => {
    try {
      const res = await fetch(
        `${MY_API_URL}/photo/select_by_report/${reportId}`
      );
      if (res.ok) {
        const data = await res.json();
        setPhotos(data);
      }
    } catch (err) {
      console.error("写真取得エラー:", err);
    }
  };

  const savePhoto = async (photoUrl: string) => {
    try {
      await fetch(`${MY_API_URL}/photo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_id: reportId,
          photo_url: photoUrl,
          posted_datetime: new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
        }),
      });
      await fetchPhotos();
    } catch (err) {
      console.error("写真保存エラー:", err);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [reportId]);

  return (
    <div className="mb-4">
      {/* 保存済み写真表示 */}
      {photos.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">保存済み写真 ({photos.length}枚)</h4>
          <div className="grid grid-cols-3 gap-2">
            {photos.slice(0, 3).map((photo) => (
              <img
                key={photo.id}
                src={photo.photo_url}
                alt="保存済み写真"
                className="w-full h-20 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/100x80?text=No+Image";
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 写真追加フォーム */}
      <div className="p-3 bg-green-50 rounded">
        <h4 className="font-medium mb-2">写真追加</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const photoUrl = formData.get("photo_url") as string;
            if (photoUrl) {
              savePhoto(photoUrl);
              (e.target as HTMLFormElement).reset();
            }
          }}
        >
          <div className="flex gap-2">
            <input
              name="photo_url"
              type="url"
              placeholder="写真URL"
              className="border p-1 rounded text-sm flex-1"
              required
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-2 py-1 text-sm rounded"
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoManager;
