import { apiClient } from './client';

interface CleaningTypeResponse {
  id: number;
  type_name: string;
}

export class TypeService {
  async getTypeIdByName(typeName: string): Promise<number> {
    try {
      console.log("🏷️ Type ID取得開始:", typeName);
      
      const types = await apiClient.get<CleaningTypeResponse[]>('/cleaning_type');
      console.log("📋 取得したTypes:", types);
      
      if (!types || !Array.isArray(types)) {
        console.error("❌ 不正なタイプデータ:", types);
        return 1;
      }
      
      const type = types.find((item: CleaningTypeResponse) => item.type_name === typeName);
      
      if (!type) {
        console.warn(`⚠️ Type not found: ${typeName}, using default ID: 1`);
        return 1;
      }
      
      console.log("✅ 見つかったType:", type);
      return type.id;
    } catch (error) {
      console.error('❌ Type ID取得エラー:', error);
      return 1;
    }
  }
}

export const typeService = new TypeService();