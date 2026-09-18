/**
 * Utility to extract a clean YouTube iframe embed URL from any YouTube link format:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/playlist?list=PLAYLIST_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export const getYouTubeEmbedUrl = (url, fallbackTitle = '') => {
  if (!url) return 'https://www.youtube-nocookie.com/embed/rfscVS0vtbw?autoplay=1&rel=0';

  // 1. Check if it's already an embed URL
  if (url.includes('youtube.com/embed/')) {
    return url.includes('?') ? `${url}&rel=0` : `${url}?autoplay=1&rel=0`;
  }

  // 2. Check for standard watch?v=VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?autoplay=1&rel=0&enablejsapi=1`;
  }

  // 3. Check for playlist?list=PLAYLIST_ID
  const playlistMatch = url.match(/youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/i);
  if (playlistMatch && playlistMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistMatch[1]}&autoplay=1&rel=0`;
  }

  // 4. Channel URL fallback - map to top curated lecture video based on topic / title
  const titleLower = (fallbackTitle || url).toLowerCase();
  if (titleLower.includes('machine learning') || titleLower.includes('karpathy') || titleLower.includes('neural')) {
    return 'https://www.youtube-nocookie.com/embed/i_LwzRVP7bg?autoplay=1&rel=0';
  }
  if (titleLower.includes('data structure') || titleLower.includes('algorithm') || titleLower.includes('dsa') || titleLower.includes('neetcode')) {
    return 'https://www.youtube-nocookie.com/embed/8hly31xKli0?autoplay=1&rel=0';
  }
  if (titleLower.includes('web') || titleLower.includes('react') || titleLower.includes('javascript') || titleLower.includes('fireship')) {
    return 'https://www.youtube-nocookie.com/embed/0sOvCWFmrtA?autoplay=1&rel=0';
  }
  if (titleLower.includes('cloud') || titleLower.includes('aws') || titleLower.includes('devops')) {
    return 'https://www.youtube-nocookie.com/embed/SOTamWNgDKc?autoplay=1&rel=0';
  }

  // Default Python bootcamp embed
  return 'https://www.youtube-nocookie.com/embed/rfscVS0vtbw?autoplay=1&rel=0';
};
