
export const formatDateTime = (isoString: string): string => {
  if (!isoString) return "";
  
  try {
    const date = new Date(isoString);
    
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
