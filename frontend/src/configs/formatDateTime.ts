/**
 * ISO 8601形式の日時を読みやすい形式に変換
 * @param isoString - ISO形式の日時文字列（例: 2025-09-23T19:46:10.111）
 * @returns 日本語形式の日時（例: 2025年9月23日 19:46）
 */
export const formatDateTime = (isoString: string): string => {
  if (!isoString) return "";
  
  try {
    const date = new Date(isoString);
    
    // 無効な日付チェック
    if (isNaN(date.getTime())) return isoString;
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  } catch (error) {
    console.error('日時フォーマットエラー:', error);
    return isoString;
  }
};
