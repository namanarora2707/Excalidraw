import { nanoid } from 'nanoid';

/**
 * Image Tool
 * Click to insert an image element
 */
class ImageTool {
  constructor() {
    this.name = 'image';
    this.cursor = 'crosshair';
    this.isSelectingFile = false;
  }

  onMouseDown(e, state) {
    const { x, y } = this.getCanvasCoordinates(e, state);
    
    // Open file dialog to select image
    this.insertImage(x, y, state);
  }

  onMouseMove(e, state) {
    // Image tool doesn't need mouse move handling
  }

  onMouseUp(e, state) {
    // Image tool doesn't need mouse up handling
  }

  onKeyDown(e, state) {
    // Handle escape to cancel
    if (e.key === 'Escape' && this.isSelectingFile) {
      e.preventDefault();
      this.isSelectingFile = false;
    }
  }

  /**
   * Insert an image at the given position
   */
  insertImage(x, y, state) {
    if (this.isSelectingFile) return;
    
    this.isSelectingFile = true;
    
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    // Handle file selection
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const imageData = e.target.result;
          
          // Create image element
          const newElement = {
            id: nanoid(),
            type: 'image',
            x,
            y,
            width: 200, // Default width
            height: 150, // Default height (will be updated after image loads)
            src: imageData,
            stroke: 'transparent',
            fill: 'transparent',
            strokeWidth: 0,
            opacity: 100,
          };
          
          state.addElement(newElement);
          state.commitChanges();
          
          // Switch back to select tool
          if (state.setCurrentTool) {
            state.setCurrentTool('select');
          }
          
          // Update element dimensions after image loads
          const img = new Image();
          img.onload = () => {
            // Calculate aspect ratio
            const aspectRatio = img.width / img.height;
            
            // Set appropriate dimensions (max 400px width or 300px height)
            let width = 200;
            let height = 200 / aspectRatio;
            
            if (width > 400) {
              width = 400;
              height = 400 / aspectRatio;
            }
            
            if (height > 300) {
              height = 300;
              width = 300 * aspectRatio;
            }
            
            state.updateElement(newElement.id, {
              width,
              height
            });
          };
          img.src = imageData;
        };
        
        reader.readAsDataURL(file);
      }
      
      this.isSelectingFile = false;
    };
    
    // Handle cancel
    fileInput.oncancel = () => {
      this.isSelectingFile = false;
    };
    
    // Trigger file selection
    fileInput.click();
  }

  render(ctx, state) {
    // Image tool doesn't render anything itself
    // Image elements are rendered by the renderer
  }

  reset() {
    this.isSelectingFile = false;
  }

  // Helper methods
  getCanvasCoordinates(e, state) {
    const rect = e.target.getBoundingClientRect();
    const x = (e.clientX - rect.left - state.scrollX) / state.zoom;
    const y = (e.clientY - rect.top - state.scrollY) / state.zoom;
    return { x, y };
  }
}

export default ImageTool;