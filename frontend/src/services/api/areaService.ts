import { apiClient } from './client';

interface CleaningAreaResponse {
  id: number;
  type_name: string;
  area_name: string;
}

export class AreaService {
  // 🆕 全エリア取得メソッド
  async getAreas(): Promise<CleaningAreaResponse[]> {
    try {
      console.log("🏢 全エリア取得開始");
      
      const areas = await apiClient.get<CleaningAreaResponse[]>('/cleaning_area');
      console.log("📋 取得した全エリア:", areas);
      
      if (!areas || !Array.isArray(areas)) {
        console.error("❌ 不正なエリアデータ:", areas);
        return [];
      }
      
      return areas;
    } catch (error) {
      console.error('❌ 全エリア取得エラー:', error);
      return [];
    }
  }

  // 既存のエリアID取得メソッド
  async getAreaIdByName(areaName: string, currentType?: string): Promise<number> {
    try {
      console.log("🏢 Area ID取得開始:", areaName, currentType);
      
      // 特別なケース処理
      if (areaName === "選択なし") {
        if (currentType === "巡回清掃") {
          console.log("🔄 巡回清掃用のArea ID: 1");
          return 1;
        }
        if (currentType === "ハウスクリーニング") {
          console.log("🏠 ハウスクリーニング用のArea ID: 2");
          return 2;
        }
        console.log("🔗 デフォルトArea ID: 1");
        return 1;
      }

      const areas = await this.getAreas(); // 新しいgetAreasメソッドを使用
      const area = areas.find((item: CleaningAreaResponse) => item.area_name === areaName);
      
      if (!area) {
        console.warn(`⚠️ Area not found: ${areaName}, using default ID: 1`);
        return 1;
      }
      
      console.log("✅ 見つかったArea:", area);
      return area.id;
    } catch (error) {
      console.error('❌ Area ID取得エラー:', error);
      return 1;
    }
  }
}

export const areaService = new AreaService();