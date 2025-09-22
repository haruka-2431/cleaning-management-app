import { apiClient } from './client';

interface User {
  id: number;
  name: string;
  email: string;
  position: string;
  status: number;
}

export class UserService {
  async getActiveUsers(): Promise<string[]> {
    try {
      console.log("👥 アクティブユーザー取得開始");
      
      const users = await apiClient.get<User[]>('users');
      console.log("📋 取得したユーザー:", users);
      
      // 配列の検証
      if (!users || !Array.isArray(users)) {
        console.warn("❌ 不正なユーザーデータ、フォールバックを使用");
        return this.getFallbackUsers();
      }

      // status=1（アクティブ）のユーザーのみ取得
      const activeUsers = users.filter((user: User) => user.status === 1);
      const userNames = activeUsers.map((user: User) => user.name);

      console.log("✅ アクティブユーザー:", userNames);
      
      if (userNames.length === 0) {
        console.warn("⚠️ アクティブユーザーが0人、フォールバックを使用");
        return this.getFallbackUsers();
      }
      
      return userNames;
    } catch (error) {
      console.error('❌ ユーザー取得エラー:', error);
      return this.getFallbackUsers();
    }
  }

  private getFallbackUsers(): string[] {
    console.log("🔄 フォールバックユーザーデータを使用");
    return ["山田太郎", "相沢佳奈", "佐藤佳次", "岡崎かなた"];
  }
}

export const userService = new UserService();