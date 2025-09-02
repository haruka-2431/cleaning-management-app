import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// 簡単なテスト用コンポーネント
function TestComponent() {
  return <div>Hello, Testing World!</div>
}

describe('テスト環境確認', () => {
  it('React コンポーネントがレンダリングできる', () => {
    render(<TestComponent />)
    expect(screen.getByText('Hello, Testing World!')).toBeInTheDocument()
  })

  it('基本的なアサーションが動作する', () => {
    expect(1 + 1).toBe(2)
    expect('テスト').toContain('テ')
  })
})