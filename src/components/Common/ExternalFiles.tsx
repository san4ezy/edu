import React from 'react';
import { ExternalFile } from '../../types/Lesson';
import YouTubePlayer from './YouTubePlayer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faVideo, 
  faFileAlt, 
  faVolumeUp, 
  faExternalLinkAlt 
} from '@fortawesome/free-solid-svg-icons';

interface ExternalFilesProps {
  files: ExternalFile[];
  className?: string;
}

/**
 * ExternalFiles component renders different types of external files
 * Currently supports YouTube videos with plans for other media types
 */
const ExternalFiles: React.FC<ExternalFilesProps> = ({ 
  files, 
  className = '' 
}) => {
  
  if (!files || files.length === 0) {
    return null;
  }

  const renderExternalFile = (file: ExternalFile, index: number) => {
    const baseKey = `external-file-${index}`;
    
    switch (file.type) {
      case 'YOUTUBE':
        return (
          <div key={baseKey} className="space-y-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faVideo} className="text-red-500 h-5 w-5" />
              <h4 className="text-lg font-semibold">{file.name}</h4>
            </div>
            <YouTubePlayer 
              url={file.url} 
              title={file.name}
              className="w-full"
              showControls={true}       // Show controls (progress bar, volume, etc.)
              showRelated={false}
              showInfo={false}
              showFullscreen={true}     // Allow fullscreen
              autoplay={false}
              mute={false}
            />
          </div>
        );
      
      case 'VIDEO':
        return (
          <div key={baseKey} className="space-y-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faVideo} className="text-blue-500 h-5 w-5" />
              <h4 className="text-lg font-semibold">{file.name}</h4>
            </div>
            <video 
              controls 
              className="w-full rounded-lg shadow-lg"
              preload="metadata"
              controlsList="nodownload nofullscreen noremoteplayback" // Restrict some controls
              disablePictureInPicture // Disable picture-in-picture
              onContextMenu={(e) => e.preventDefault()} // Disable right-click
            >
              <source src={file.url} type="video/mp4" />
              <p>Your browser does not support the video tag.</p>
            </video>
          </div>
        );
      
      case 'AUDIO':
        return (
          <div key={baseKey} className="space-y-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faVolumeUp} className="text-green-500 h-5 w-5" />
              <h4 className="text-lg font-semibold">{file.name}</h4>
            </div>
            <audio 
              controls 
              className="w-full"
              preload="metadata"
            >
              <source src={file.url} type="audio/mpeg" />
              <p>Your browser does not support the audio tag.</p>
            </audio>
          </div>
        );
      
      case 'DOCUMENT':
      default:
        return (
          <div key={baseKey} className="space-y-3">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFileAlt} className="text-gray-500 h-5 w-5" />
              <h4 className="text-lg font-semibold">{file.name}</h4>
            </div>
            <a 
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn btn-outline btn-sm"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="h-4 w-4" />
              Open Document
            </a>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-xl font-bold">Additional Resources</h3>
      <div className="space-y-6">
        {files.map(renderExternalFile)}
      </div>
    </div>
  );
};

export default ExternalFiles;
