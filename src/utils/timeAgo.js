export function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 86400 * 7) return `${Math.floor(diffInSeconds / 86400)}일 전`;
    if (diffInSeconds < 86400 * 30) return `${Math.floor(diffInSeconds / (86400 * 7))}주 전`;
    if (diffInSeconds < 86400 * 365) return `${Math.floor(diffInSeconds / (86400 * 30))}달 전`;
    return `${Math.floor(diffInSeconds / (86400 * 365))}년 전`;
}
