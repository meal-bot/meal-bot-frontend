export function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now - past) / 1000); // 초 단위

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}일 전`;
    if (diff < 86400 * 30) return `${Math.floor(diff / (86400 * 7))}주 전`;
    if (diff < 86400 * 365) return `${Math.floor(diff / (86400 * 30))}달 전`;
    return `${Math.floor(diff / (86400 * 365))}년 전`;
}
