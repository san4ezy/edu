import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBold, 
  faItalic, 
  faListUl, 
  faListOl, 
  faHeading, 
  faLink,
  faQuoteLeft,
  faCode,
  faRemoveFormat,
  faUndo,
  faRedo
} from '@fortawesome/free-solid-svg-icons';
import './SimpleEditor.css';

interface SimpleEditorProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  placeholder?: string;
  className?: string;
  height?: string;
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({ 
  value, 
  onChange, 
  name, 
  placeholder = '', 
  className = '', 
  height = 'h-80' 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [initialRender, setInitialRender] = useState(true);

  // Initialize editor content on first render
  useEffect(() => {
    if (initialRender && editorRef.current) {
      editorRef.current.innerHTML = value;
      setInitialRender(false);
    }
  }, [value, initialRender]);

  // Update hidden textarea when editor content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only handle shortcuts with Ctrl/Cmd key
    if (!(e.ctrlKey || e.metaKey)) return;
    
    switch (e.key.toLowerCase()) {
      case 'b': // Bold
        e.preventDefault();
        execCommand('bold');
        break;
      case 'i': // Italic
        e.preventDefault();
        execCommand('italic');
        break;
      case 'u': // Underline
        e.preventDefault();
        execCommand('underline');
        break;
      case 'z': // Undo
        e.preventDefault();
        execCommand('undo');
        break;
      case 'y': // Redo
      case 'shift+z':
        if (e.shiftKey && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          execCommand('redo');
        } else if (e.key.toLowerCase() === 'y') {
          e.preventDefault();
          execCommand('redo');
        }
        break;
    }
  };

  // Handle pasting to strip formatting from pasted content
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    
    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain');
    
    // Insert text at cursor position
    document.execCommand('insertText', false, text);
    handleContentChange();
  };

  // Formatting commands
  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleContentChange();
    }
  };

  // Handle inserting links
  const insertLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  // Default style classes
  const buttonClass = 'btn btn-sm btn-ghost px-2';

  return (
    <div className={`simple-editor ${className}`}>
      <div className="toolbar flex flex-wrap gap-1 p-2 bg-base-200 rounded-t-lg border border-base-300">
        <button 
          type="button" 
          className={buttonClass} 
          onClick={() => execCommand('bold')}
          title="Bold"
        >
          <FontAwesomeIcon icon={faBold} />
        </button>
        <button 
          type="button" 
          className={buttonClass} 
          onClick={() => execCommand('italic')}
          title="Italic"
        >
          <FontAwesomeIcon icon={faItalic} />
        </button>
        <button 
          type="button" 
          className={buttonClass} 
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet List"
        >
          <FontAwesomeIcon icon={faListUl} />
        </button>
        <button 
          type="button" 
          className={buttonClass} 
          onClick={() => execCommand('insertOrderedList')}
          title="Numbered List"
        >
          <FontAwesomeIcon icon={faListOl} />
        </button>
        <button 
          type="button" 
          className={buttonClass} 
          onClick={() => execCommand('formatBlock', '<h2>')}
          title="Heading"
        >
          <FontAwesomeIcon icon={faHeading} />
        </button>
        <button 
          type="button" 
          className={buttonClass} 
          onClick={insertLink}
          title="Insert Link"
        >
          <FontAwesomeIcon icon={faLink} />
        </button>
        <button 
          type="button" 
          className={buttonClass} 
          onClick={() => execCommand('formatBlock', '<blockquote>')}
          title="Quote"
        >
          <FontAwesomeIcon icon={faQuoteLeft} />
        </button>
        <button 
          type="button" 
          className={buttonClass} 
          onClick={() => execCommand('formatBlock', '<pre>')}
          title="Code Block"
        >
          <FontAwesomeIcon icon={faCode} />
        </button>
        <button 
          type="button" 
          className={buttonClass} 
          onClick={() => execCommand('removeFormat')}
          title="Remove Formatting"
        >
          <FontAwesomeIcon icon={faRemoveFormat} />
        </button>
        <div className="ml-auto flex gap-1">
          <button 
            type="button" 
            className={buttonClass} 
            onClick={() => execCommand('undo')}
            title="Undo"
          >
            <FontAwesomeIcon icon={faUndo} />
          </button>
          <button 
            type="button" 
            className={buttonClass} 
            onClick={() => execCommand('redo')}
            title="Redo"
          >
            <FontAwesomeIcon icon={faRedo} />
          </button>
        </div>
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        className={`${height} w-full p-4 overflow-y-auto border border-base-300 focus:outline-none focus:border-primary rounded-b-lg`}
        onInput={handleContentChange}
        onBlur={handleContentChange}
        onPaste={handlePaste}
        data-placeholder={placeholder}
      ></div>
      
      {/* Hidden textarea to maintain form compatibility */}
      <textarea 
        name={name}
        value={value}
        onChange={() => {}}
        className="hidden"
      />
    </div>
  );
};

export default SimpleEditor;