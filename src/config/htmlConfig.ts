// Configuration for allowed HTML tags and attributes in descriptions
export interface HtmlConfig {
  allowedTags: string[];
  allowedAttributes: { [tag: string]: string[] };
  allowedClasses: { [tag: string]: string[] };
}

// Default configuration for allowed HTML tags
export const defaultHtmlConfig: HtmlConfig = {
  // Basic formatting tags
  allowedTags: [
    'p',        // Paragraphs
    'br',       // Line breaks
    'strong',   // Bold text
    'b',        // Bold text (alternative)
    'em',       // Italic text
    'i',        // Italic text (alternative)
    'u',        // Underlined text
    'h1',       // Headings
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'ul',       // Unordered lists
    'ol',       // Ordered lists
    'li',       // List items
    'a',        // Links
    'blockquote', // Quotes
    'pre',      // Preformatted text
    'code',     // Code spans
    'span',     // Generic inline container
    'div',      // Generic block container
    'img',      // Images
    'hr',       // Horizontal rules
    'sub',      // Subscript
    'sup',      // Superscript
    'mark',     // Highlighted text
    'del',      // Deleted text
    'ins',      // Inserted text
    'small',    // Small text
    'cite',     // Citations
    'abbr',     // Abbreviations
    'time',     // Time elements
    'kbd',      // Keyboard input
    'var',      // Variables
    'samp',     // Sample output
  ],
  
  // Allowed attributes for each tag
  allowedAttributes: {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'blockquote': ['cite'],
    'time': ['datetime'],
    'abbr': ['title'],
    'cite': ['title'],
    'pre': ['class'],
    'code': ['class'],
    'span': ['class'],
    'div': ['class'],
    'p': ['class'],
    'h1': ['class'],
    'h2': ['class'],
    'h3': ['class'],
    'h4': ['class'],
    'h5': ['class'],
    'h6': ['class'],
    'ul': ['class'],
    'ol': ['class', 'type', 'start'],
    'li': ['class'],
  },
  
  // Allowed CSS classes for styling (using Tailwind CSS classes)
  allowedClasses: {
    'p': ['text-left', 'text-center', 'text-right', 'text-justify'],
    'span': ['text-primary', 'text-secondary', 'text-accent', 'text-success', 'text-warning', 'text-error'],
    'div': ['alert', 'alert-info', 'alert-success', 'alert-warning', 'alert-error'],
    'code': ['bg-base-200', 'text-primary'],
    'pre': ['bg-base-200', 'p-4', 'rounded'],
    'blockquote': ['border-l-4', 'border-primary', 'pl-4', 'italic'],
    'h1': ['text-4xl', 'text-3xl', 'text-2xl', 'font-bold'],
    'h2': ['text-3xl', 'text-2xl', 'text-xl', 'font-bold'],
    'h3': ['text-2xl', 'text-xl', 'text-lg', 'font-bold'],
    'h4': ['text-xl', 'text-lg', 'font-bold'],
    'h5': ['text-lg', 'font-bold'],
    'h6': ['text-base', 'font-bold'],
    'ul': ['list-disc', 'list-inside', 'space-y-1'],
    'ol': ['list-decimal', 'list-inside', 'space-y-1'],
    'li': ['ml-4'],
  }
};

// Function to get current HTML configuration (can be extended to use user preferences)
export const getHtmlConfig = (): HtmlConfig => {
  // In the future, this could load configuration from user settings/database
  return defaultHtmlConfig;
};

// Function to check if a tag is allowed
export const isTagAllowed = (tag: string): boolean => {
  const config = getHtmlConfig();
  return config.allowedTags.includes(tag.toLowerCase());
};

// Function to check if an attribute is allowed for a tag
export const isAttributeAllowed = (tag: string, attribute: string): boolean => {
  const config = getHtmlConfig();
  const allowedAttrs = config.allowedAttributes[tag.toLowerCase()];
  return allowedAttrs ? allowedAttrs.includes(attribute.toLowerCase()) : false;
};

// Function to check if a CSS class is allowed for a tag
export const isClassAllowed = (tag: string, className: string): boolean => {
  const config = getHtmlConfig();
  const allowedClasses = config.allowedClasses[tag.toLowerCase()];
  return allowedClasses ? allowedClasses.includes(className) : false;
};
