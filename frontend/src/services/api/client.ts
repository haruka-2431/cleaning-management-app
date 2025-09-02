export class ApiClient {
  private baseUrl = "/api/another";

  async get<T>(endpoint: string): Promise<T> {
    try {
      console.log(`🔗 API GET: ${this.baseUrl}${endpoint}`);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Success:`, data);
      return data;
    } catch (error) {
      console.error(`❌ API GET Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    try {
      console.log(`🔗 API POST: ${this.baseUrl}${endpoint}`, body);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API Error ${response.status}:`, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ API POST Success:`, data);
      return data;
    } catch (error) {
      console.error(`❌ API POST Error [${endpoint}]:`, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
