# Excalidraw Clone - Project Documentation

## Overview
This is a lightweight Excalidraw-like sketch drawing web application built with React and Vite.

## Technologies Used
- **React**: UI framework for building components
- **Zustand**: Lightweight state management solution
- **Rough.js**: Hand-drawn style rendering library
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Nano ID**: Unique ID generator
- **FileSaver.js**: Client-side file saving utility

## Project Structure

```
src/
├── components/
│   ├── Canvas/           # Main drawing surface
│   ├── Toolbar/          # Tool selection UI
│   ├── Sidebar/          # Properties panel
│   ├── CanvasManager/    # Canvas management UI
│   ├── UndoRedo/         # History controls
│   └── UI/               # Reusable UI components
├── store/
│   ├── canvasStore.js    # Canvas data management
│   ├── editorStore.js    # Editor state (tools, colors, zoom)
│   └── historyStore.js   # Undo/redo functionality
├── tools/
│   ├── RectangleTool.js  # Rectangle drawing tool
│   ├── EllipseTool.js    # Ellipse drawing tool
│   ├── RhombusTool.js    # Rhombus/diamond drawing tool
│   ├── ArrowTool.js      # Arrow drawing tool
│   ├── DrawTool.js       # Freehand drawing tool
│   ├── TextTool.js       # Text tool
│   ├── ImageTool.js      # Image insertion tool
│   ├── SelectTool.js     # Selection and manipulation tool
│   └── EraserTool.js     # Element erasing tool
├── utils/
│   ├── renderer.js       # Element rendering with Rough.js
│   ├── export.js         # PNG/SVG export functionality
│   └── storage.js        # Local storage management
├── constants/
│   └── index.js          # Application constants
└── types/
    └── index.js          # Type definitions
```

## Key Features and Implementation

### 1. Drawing Tools
Each tool follows a standard pattern:
- `onMouseDown(e, state)`: Start drawing
- `onMouseMove(e, state)`: Update preview
- `onMouseUp(e, state)`: Finalize element
- `render(ctx, state)`: Render preview/overlay

#### Rectangle Tool
- Located in `src/tools/RectangleTool.js`
- Implements click-and-drag rectangle drawing
- Uses Rough.js for hand-drawn style
- Dependencies: `nanoid` for unique IDs

#### Ellipse Tool
- Located in `src/tools/EllipseTool.js`
- Implements click-and-drag ellipse drawing
- Maintains aspect ratio when holding Shift
- Dependencies: `nanoid` for unique IDs

#### Rhombus Tool
- Located in `src/tools/RhombusTool.js`
- Implements diamond shape drawing
- Added as part of feature implementation
- Dependencies: `nanoid` for unique IDs

#### Arrow Tool
- Located in `src/tools/ArrowTool.js`
- Draws lines with arrowheads
- Supports different arrowhead types
- Dependencies: `nanoid` for unique IDs

#### Draw Tool
- Located in `src/tools/DrawTool.js`
- Freehand drawing with smoothing
- Uses quadratic curves for smooth lines
- Dependencies: `nanoid` for unique IDs

#### Text Tool
- Located in `src/tools/TextTool.js`
- Adds editable text elements
- Uses content-editable div for editing
- Dependencies: `nanoid` for unique IDs

#### Image Tool
- Located in `src/tools/ImageTool.js`
- Inserts images from file selection
- Handles aspect ratio preservation
- Dependencies: `nanoid` for unique IDs, browser File API

#### Select Tool
- Located in `src/tools/SelectTool.js`
- Selects, moves, and resizes elements
- Handles multi-selection with Ctrl/Cmd
- Dependencies: None

#### Eraser Tool
- Located in `src/tools/EraserTool.js`
- Removes elements by clicking on them
- Supports erasing multiple elements
- Dependencies: None

### 2. Rendering System
- Located in `src/utils/renderer.js`
- Uses Rough.js for hand-drawn aesthetic
- Modified to use solid fills instead of hachure patterns
- Implements culling for performance optimization
- Dependencies: `roughjs` for rendering

### 3. State Management
#### Canvas Store (`src/store/canvasStore.js`)
- Manages canvas data and elements
- Handles element CRUD operations
- Implements history integration
- Dependencies: `zustand` for state management, `nanoid` for IDs

#### Editor Store (`src/store/editorStore.js`)
- Manages editor state (current tool, colors, zoom)
- Handles UI state (selection, clipboard)
- Provides style getters/setters
- Dependencies: `zustand` for state management

#### History Store (`src/store/historyStore.js`)
- Implements undo/redo functionality
- Tracks canvas state changes
- Manages history stack
- Dependencies: `zustand` for state management

### 4. Export Functionality
- Located in `src/utils/export.js`
- Supports PNG and SVG export
- Handles element bounds calculation
- Maintains element styles and properties
- Dependencies: 
  - `roughjs` for rendering elements
  - `file-saver` for saving files
  - Browser Canvas API for PNG export
  - Browser DOM manipulation for SVG export

### 5. UI Components
#### Canvas (`src/components/Canvas/Canvas.jsx`)
- Main drawing surface
- Handles mouse events and transformations
- Implements rendering loop with dirty flag optimization
- Manages panning and zooming
- Dependencies: 
  - React hooks (`useState`, `useEffect`, `useRef`, `useCallback`)
  - Store hooks (`useCanvasStore`, `useEditorStore`)
  - Renderer utilities
  - Tool system

#### Toolbar (`src/components/Toolbar/Toolbar.jsx`)
- Tool selection interface
- Lock button implementation
- Hand tool removal (as requested)
- Dependencies: 
  - React hooks (`useState`)
  - Store hooks (`useEditorStore`)
  - Lucide React icons
  - ToolButton component

#### Sidebar (`src/components/Sidebar/Sidebar.jsx`)
- Element property controls
- Stroke and fill color pickers
- Stroke width and opacity controls
- Font family selection for text
- Dependencies: 
  - React hooks (`useState`)
  - Store hooks (`useEditorStore`, `useCanvasStore`)
  - Various sidebar sub-components (ColorPicker, StrokeWidthPicker, etc.)

### 6. Additional Features
- Auto-save functionality (`src/hooks/useAutoSave.js`)
- Keyboard shortcuts (`src/hooks/useKeyboardShortcuts.js`)
- Canvas management (create, rename, delete)
- Element alignment tools
- Layer controls

## Data Flow
1. User interacts with UI components (Toolbar, Sidebar)
2. UI updates trigger store actions
3. Stores update state and notify subscribers
4. Canvas component responds to state changes
5. Tools receive state and handle user input
6. Elements are created/updated in canvas store
7. Renderer draws elements on canvas
8. Changes are automatically saved to localStorage

## Customizations Made
1. Changed default element fill from transparent to white
2. Modified renderer to use solid fills instead of hachure patterns
3. Removed hand tool from toolbar
4. Implemented lock button functionality
5. Added rhombus and image tools

## Build and Development
- Development server: `npm run dev`
- Production build: `npm run build`
- Preview build: `npm run preview`

## Package Dependencies
- `react`: Core React library
- `react-dom`: React DOM rendering
- `zustand`: State management
- `roughjs`: Hand-drawn rendering
- `lucide-react`: Icon components
- `nanoid`: Unique ID generation
- `file-saver`: File saving utility
- `vite`: Build tool
- `tailwindcss`: CSS framework
- `autoprefixer`: CSS prefixing
- `postcss`: CSS processing