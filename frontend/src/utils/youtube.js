/**
 * Utility to extract a clean YouTube iframe embed URL from any YouTube link format:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/playlist?list=PLAYLIST_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export const getYouTubeEmbedUrl = (url, fallbackTitle = '') => {
  if (!url) return 'https://www.youtube.com/embed/rfscVS0vtbw?rel=0';

  // 1. Check if it's already an embed URL
  if (url.includes('youtube.com/embed/')) {
    return url.includes('?') ? `${url}&rel=0` : `${url}?rel=0`;
  }

  // 2. Check for standard watch?v=VIDEO_ID or short youtu.be/VIDEO_ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0`;
  }

  // 3. Check for playlist?list=PLAYLIST_ID
  const playlistMatch = url.match(/youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/i);
  if (playlistMatch && playlistMatch[1]) {
    return `https://www.youtube.com/embed/videoseries?list=${playlistMatch[1]}&rel=0`;
  }

  // 4. Topic based mapping for fallback
  const titleLower = (fallbackTitle || url).toLowerCase();
  if (titleLower.includes('devops') || titleLower.includes('docker') || titleLower.includes('kubernetes')) {
    return 'https://www.youtube.com/embed/Wf2eSG3owoA?rel=0';
  }
  if (titleLower.includes('linux') || titleLower.includes('bash')) {
    return 'https://www.youtube.com/embed/sWbGOq4stl8?rel=0';
  }
  if (titleLower.includes('c++') || titleLower.includes('cpp')) {
    return 'https://www.youtube.com/embed/vLnPwxZdW4Y?rel=0';
  }
  if (titleLower.includes('java')) {
    return 'https://www.youtube.com/embed/A74TOX803D0?rel=0';
  }
  if (titleLower.includes('rust')) {
    return 'https://www.youtube.com/embed/BpPEoQ4j55s?rel=0';
  }
  if (titleLower.includes('go ') || titleLower.includes('golang')) {
    return 'https://www.youtube.com/embed/YS4e4q9oBaU?rel=0';
  }
  if (titleLower.includes('machine learning') || titleLower.includes('karpathy') || titleLower.includes('neural')) {
    return 'https://www.youtube.com/embed/i_LwzRVP7bg?rel=0';
  }
  if (titleLower.includes('data structure') || titleLower.includes('algorithm') || titleLower.includes('dsa')) {
    return 'https://www.youtube.com/embed/8hly31xKli0?rel=0';
  }
  if (titleLower.includes('sql') || titleLower.includes('database')) {
    return 'https://www.youtube.com/embed/HXV3zeRR3h4?rel=0';
  }
  if (titleLower.includes('web') || titleLower.includes('react') || titleLower.includes('javascript')) {
    return 'https://www.youtube.com/embed/bMknfKXIFA8?rel=0';
  }
  if (titleLower.includes('cyber') || titleLower.includes('security')) {
    return 'https://www.youtube.com/embed/U_P23dqepQ4?rel=0';
  }

  // Default Python bootcamp embed
  return 'https://www.youtube.com/embed/rfscVS0vtbw?rel=0';
};
