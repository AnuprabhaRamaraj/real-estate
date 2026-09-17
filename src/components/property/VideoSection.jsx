import React from 'react';
import { Play, Video } from 'lucide-react';

export function VideoSection({ videoUrl, title = 'Property Video Tour' }) {
  if (!videoUrl) return null;

  // Helper to extract YouTube Embed URL
  const getEmbedUrl = (url) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        const v = urlParams.get('v');
        return v ? `https://www.youtube.com/embed/${v}` : null;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1]?.split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (url.includes('youtube.com/shorts/')) {
        const id = url.split('youtube.com/shorts/')[1]?.split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (url.includes('vimeo.com/')) {
        const id = url.split('vimeo.com/')[1]?.split('?')[0];
        return id ? `https://player.vimeo.com/video/${id}` : null;
      }
      // If it's already an embed link or mp4
      return url;
    } catch (e) {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const isDirectMp4 = videoUrl.endsWith('.mp4') || videoUrl.includes('cloudinary');

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 border-l-2 border-gold-500 pl-3">
        <Video className="w-5 h-5 text-gold-400" />
        <h3 className="font-serif text-xl font-bold text-white">{title}</h3>
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-luxury">
        {isDirectMp4 ? (
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
            preload="metadata"
          />
        ) : embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <Play className="w-12 h-12 text-gold-400 mb-2" />
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:underline font-semibold text-sm"
            >
              Click here to watch external property video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
