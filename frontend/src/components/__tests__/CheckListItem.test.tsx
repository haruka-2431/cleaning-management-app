import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAreaIdByName, getTemplateByTypeAndLocation } from '../CheckListItem'

// API Mock設定
const mockFetch = vi.fn()
globalThis.fetch = mockFetch as any

describe('CheckListItem - 清掃管理システム', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('getAreaIdByName が正常に動作する', async () => {
    // エリアデータをモック
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, type_name: '民泊清掃', area_name: '天神民泊' },
        { id: 2, type_name: '施設清掃', area_name: 'オフィスビル' }
      ]
    })

    const areaId = await getAreaIdByName('民泊清掃', '天神民泊')
    
    expect(mockFetch).toHaveBeenCalledWith('/api/another/cleaning_area')
    expect(areaId).toBe(1)
  })

  it('getTemplateByTypeAndLocation が静的テンプレートを返す', async () => {
    // DB取得失敗をシミュレート（静的テンプレート使用）
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [] // 空のデータでエリアIDがnullになる
    })

    const template = await getTemplateByTypeAndLocation('民泊清掃', '天神民泊')
    
    expect(template.title).toBe('民泊清掃 - 天神 -')
    expect(template.data['リビング']).toBeDefined()
    expect(template.data['お風呂']).toBeDefined()
  })
})