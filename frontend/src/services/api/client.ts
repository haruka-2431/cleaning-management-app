import { supabase } from '../../lib/supabase';

export class SupabaseClient {
  async get<T>(tableName: string, filters?: Record<string, any>): Promise<T> {
    try {
      console.log(`🔗 Supabase GET: ${tableName}`, filters);
      
      let query = supabase.from(tableName).select('*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`❌ Supabase Error:`, error);
        throw new Error(`Supabase Error: ${error.message}`);
      }
      
      console.log(`✅ Supabase Success:`, data);
      return data as T;
    } catch (error) {
      console.error(`❌ Supabase GET Error [${tableName}]:`, error);
      throw error;
    }
  }

  async post<T>(tableName: string, body: unknown): Promise<T> {
    try {
      console.log(`🔗 Supabase POST: ${tableName}`, body);
      
      const { data, error } = await supabase
        .from(tableName)
        .insert(body)
        .select();
      
      if (error) {
        console.error(`❌ Supabase Error:`, error);
        throw new Error(`Supabase Error: ${error.message}`);
      }
      
      console.log(`✅ Supabase POST Success:`, data);
      return data as T;
    } catch (error) {
      console.error(`❌ Supabase POST Error [${tableName}]:`, error);
      throw error;
    }
  }

  async update<T>(tableName: string, id: number, body: unknown): Promise<T> {
    try {
      console.log(`🔗 Supabase UPDATE: ${tableName}`, { id, body });
      
      const { data, error } = await supabase
        .from(tableName)
        .update(body)
        .eq('id', id)
        .select();
      
      if (error) {
        console.error(`❌ Supabase Error:`, error);
        throw new Error(`Supabase Error: ${error.message}`);
      }
      
      console.log(`✅ Supabase UPDATE Success:`, data);
      return data as T;
    } catch (error) {
      console.error(`❌ Supabase UPDATE Error [${tableName}]:`, error);
      throw error;
    }
  }

  async delete<T>(tableName: string, id: number): Promise<T> {
    try {
      console.log(`🔗 Supabase DELETE: ${tableName}`, { id });
      
      const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
        .select();
      
      if (error) {
        console.error(`❌ Supabase Error:`, error);
        throw new Error(`Supabase Error: ${error.message}`);
      }
      
      console.log(`✅ Supabase DELETE Success:`, data);
      return data as T;
    } catch (error) {
      console.error(`❌ Supabase DELETE Error [${tableName}]:`, error);
      throw error;
    }
  }
}

export const apiClient = new SupabaseClient();
