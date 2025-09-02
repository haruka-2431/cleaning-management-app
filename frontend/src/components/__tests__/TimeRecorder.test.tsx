import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TimeRecorder from '../TimeRecorder'

// API Mock設定
const mockFetch = vi.fn()
globalThis.fetch = mockFetch as any

describe('TimeRecorder', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('初期状態で必要な要素が表示される', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })

    render(<TimeRecorder reportId={123} />)
    
    expect(screen.getByPlaceholderText('作業内容')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '記録' })).toBeInTheDocument()
  })

  it('フォーム入力と送信が正常に動作する', async () => {
    const user = userEvent.setup()
    
    // GET API のモック
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })
    
    // POST API のモック
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })
    
    // 再取得用のGET API モック
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{
        id: 1,
        report_id: 123,
        task_name: 'リビング清掃',
        required_time: '00:30'
      }]
    })

    render(<TimeRecorder reportId={123} />)
    
    // フォーム入力
    await user.type(screen.getByPlaceholderText('作業内容'), 'リビング清掃')
    const timeInput = screen.getByDisplayValue('')
    await user.type(timeInput, '00:30')
    
    // 送信
    await user.click(screen.getByText('記録'))
    
    // API呼び出しの確認
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/another/location_time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_id: 123,
          task_name: 'リビング清掃',
          required_time: '00:30'
        })
      })
    })
  })
})