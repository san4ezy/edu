import React from 'react';

interface YouTubePlayerProps {
  url: string;
  title?: string;
  className?: string;
  // Control visibility options
  showControls?: boolean;
  showRelated?: boolean;
  showInfo?: boolean;
  showFullscreen?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  mute?: boolean;
  startTime?: number;
  endTime?: number;
}

/**
 * YouTubePlayer component renders a responsive YouTube iframe player
 * Supports various YouTube URL formats and allows customization of player controls
 */
const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ 
  url, 
  title = 'YouTube video player',
  className = '',
  showControls = true,
  showRelated = false,
  showInfo = false,
  showFullscreen = true,
  autoplay = false,
  loop = false,
  mute = false,
  startTime,
  endTime
}) => {
  
  // Extract YouTube video ID from various URL formats
  const extractVideoId = (youtubeUrl: string): string | null => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]+)/
    ];
    
    for (const pattern of patterns) {
      const match = youtubeUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const videoId = extractVideoId(url);
  
  if (!videoId) {
    return (
      <div className={`alert alert-warning ${className}`}>
        <span>Invalid YouTube URL</span>
      </div>
    );
  }

  // Build YouTube embed URL with parameters
  const buildEmbedUrl = (id: string) => {
    const baseUrl = `https://www.youtube-nocookie.com/embed/${id}`;
    const params = new URLSearchParams();

    // Control visibility parameters
    params.set('controls', showControls ? '1' : '0');
    params.set('rel', showRelated ? '1' : '0');
    params.set('showinfo', showInfo ? '1' : '0');
    params.set('fs', showFullscreen ? '1' : '0');
    
    // Playback parameters
    if (autoplay) params.set('autoplay', '1');
    if (loop) {
      params.set('loop', '1');
      params.set('playlist', id); // Required for loop to work
    }
    if (mute) params.set('mute', '1');
    
    // Time parameters
    if (startTime) params.set('start', startTime.toString());
    if (endTime) params.set('end', endTime.toString());

    // Additional privacy and UX improvements
    params.set('modestbranding', '1'); // Reduce YouTube branding (but can't remove completely)
    params.set('iv_load_policy', '3'); // Hide video annotations
    params.set('cc_load_policy', '0'); // Hide closed captions by default
    params.set('disablekb', showControls ? '0' : '1'); // Disable keyboard if no controls
    params.set('playsinline', '1'); // Play inline on mobile devices
    params.set('widget_referrer', window.location.origin); // Set referrer for analytics

    return `${baseUrl}?${params.toString()}`;
  };

  const embedUrl = buildEmbedUrl(videoId);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen={showFullscreen}
        />
      </div>
    </div>
  );
};

export default YouTubePlayer;
