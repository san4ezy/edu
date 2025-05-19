import React, { useMemo } from 'react';
import { getHtmlConfig } from '../../config/htmlConfig';
import './SafeHtmlRenderer.css';

interface SafeHtmlRendererProps {
  html: string;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * SafeHtmlRenderer component safely renders HTML content
 * by sanitizing it according to the configured allowed tags and attributes
 * 
 * Note: This is a basic implementation. For production, consider adding DOMPurify
 */
const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({ 
  html, 
  className = '', 
  fallback = null 
}) => {
  const sanitizedHtml = useMemo(() => {
    if (!html) return '';

    const config = getHtmlConfig();
    
    // Basic sanitization - remove script tags and dangerous attributes
    let sanitized = html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:/gi, '');
    
    // Process CSS classes to only allow configured ones
    if (sanitized) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sanitized;
      
      // Process all elements with classes
      const elementsWithClasses = tempDiv.querySelectorAll('[class]');
      elementsWithClasses.forEach((element) => {
        const tagName = element.tagName.toLowerCase();
        const classes = element.className.split(' ');
        const allowedClasses = config.allowedClasses[tagName] || [];
        
        // Filter classes to only include allowed ones
        const filteredClasses = classes.filter(cls => 
          cls && allowedClasses.includes(cls.trim())
        );
        
        if (filteredClasses.length > 0) {
          element.className = filteredClasses.join(' ');
        } else {
          element.removeAttribute('class');
        }
      });
      
      // Remove disallowed tags (keep content)
      config.allowedTags.forEach(allowedTag => {
        const disallowedElements = tempDiv.querySelectorAll(`*:not(${config.allowedTags.join(', ')})`);
        disallowedElements.forEach(element => {
          if (element.parentNode) {
            // Replace the element with its content
            while (element.firstChild) {
              element.parentNode.insertBefore(element.firstChild, element);
            }
            element.parentNode.removeChild(element);
          }
        });
      });
      
      sanitized = tempDiv.innerHTML;
    }
    
    return sanitized;
  }, [html]);

  // If no HTML content, show fallback or nothing
  if (!html || html.trim() === '') {
    return fallback ? <>{fallback}</> : null;
  }

  // If sanitization resulted in empty content, show fallback
  if (!sanitizedHtml || sanitizedHtml.trim() === '') {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <div 
      className={`safe-html-content prose max-w-none ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

export default SafeHtmlRenderer;
