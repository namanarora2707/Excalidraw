import { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import CanvasManager from './components/CanvasManager/CanvasManager';
import CanvasList from './components/CanvasManager/CanvasList';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import FloatingActions from './components/FloatingActions';
import UndoRedo from './components/UndoRedo';
import ConfirmDialog from './components/UI/ConfirmDialog';
import { useCanvasStore, useEditorStore } from './store';
import { useToolShortcuts, useUndoRedoShortcuts, useSelectAllShortcut } from './hooks';
import { migrateAllCanvases } from './utils/migration';
import { Plus } from 'lucide-react';
import { useAuth } from './context/AuthContext';

const Dashboard = ({ navigate, logout }) => {
  const [isCanvasManagerOpen, setIsCanvasManagerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const {
    currentCanvas,
    loadLastCanvas,
    createCanvas,
    undo,
    redo,
    getAllCanvases,
    loadCanvas,
    renameCanvas,
    deleteCanvas,
    duplicateCanvas,
  } = useCanvasStore();
  const { setCurrentTool, setSelectedElements } = useEditorStore();
  const { isAuthenticated, loading } = useAuth();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Enable keyboard shortcuts for tools
  useToolShortcuts(setCurrentTool);
  
  // Enable keyboard shortcuts for undo/redo
  useUndoRedoShortcuts(undo, redo);
  
  // Handle select all (Ctrl+A)
  const handleSelectAll = useCallback(() => {
    // Switch to select tool
    setCurrentTool('select');
    
    // Select all elements on the canvas
    if (currentCanvas && currentCanvas.elements.length > 0) {
      const allElementIds = currentCanvas.elements.map(el => el.id);
      setSelectedElements(allElementIds);
    }
  }, [currentCanvas, setCurrentTool, setSelectedElements]);
  
  // Enable keyboard shortcut for select all
  useSelectAllShortcut(handleSelectAll);

  // Initialize app - load last canvas or show canvas manager
  useEffect(() => {
    // Run data migrations first
    migrateAllCanvases();
    
    // Then load the last canvas
    const initialized = loadLastCanvas();
    
    // If no canvas was loaded, we'll show all canvases in the dashboard
    if (!initialized) {
      // Don't automatically create a canvas, let user choose from existing ones or create new
    }
  }, [loadLastCanvas]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Get all canvases for display when no canvas is loaded
  const allCanvases = getAllCanvases();

  // Handle opening a canvas from the list
  const handleOpenCanvas = (canvasId) => {
    loadCanvas(canvasId);
    // Navigate to the canvas view
    navigate('/canvas');
  };

  // Handle creating a new canvas
  const handleCreateCanvas = () => {
    const newCanvas = createCanvas('Untitled Canvas');
    if (newCanvas) {
      loadCanvas(newCanvas.id);
      // Navigate to the canvas view
      navigate('/canvas');
    }
  };

  // Handle deleting a canvas with confirmation
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, canvasId: null, canvasName: '' });
  
  const handleDeleteCanvas = (canvasId) => {
    // Get canvas name for confirmation dialog
    const canvas = allCanvases.find(c => c.id === canvasId);
    setDeleteConfirm({
      show: true,
      canvasId: canvasId,
      canvasName: canvas?.name || 'this canvas'
    });
  };
  
  const confirmDelete = () => {
    if (deleteConfirm.canvasId) {
      deleteCanvas(deleteConfirm.canvasId);
    }
    setDeleteConfirm({ show: false, canvasId: null, canvasName: '' });
  };
  
  const cancelDelete = () => {
    setDeleteConfirm({ show: false, canvasId: null, canvasName: '' });
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 overflow-hidden dashboard-responsive">
      {/* Toolbar at Top (replaces navbar) */}
      {currentCanvas && <Toolbar />}
         
      {/* Main Canvas Area */}
      <main className="flex-1 flex min-h-0 overflow-hidden relative main-responsive">
        {/* App Title - Fixed Position */}
        <div className="fixed top-3 left-16 z-40 pointer-events-none flex items-center h-12">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-none px-1" 
              style={{ fontFamily: "'Pacifico', 'Brush Script MT', cursive" }}>
            DesignPro
          </h1>
        </div>

        {/* Hamburger Toggle Button - Always Fixed in Same Position */}
        {currentCanvas && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed top-3 left-3 z-50 p-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors touch-device-button"
            title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu size={20} className="text-gray-700" />
          </button>
        )}

        {/* Canvas Container - Full width always */}
        <div className="absolute inset-0 canvas-area-responsive">
          {currentCanvas ? (
            <Canvas />
          ) : (
            // Show all canvases when no canvas is loaded
            <div className="h-full flex flex-col">
              {/* Header with title and new canvas button */}
              <div className="pt-4 px-6 pb-4 header-responsive">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Canvases</h2>
                    <p className="text-gray-600 mt-1">
                      Select a canvas to start working or create a new one
                    </p>
                  </div>
                  <button
                    onClick={handleCreateCanvas}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm btn-responsive touch-device-button"
                  >
                    <Plus size={18} />
                    New Canvas
                  </button>
                </div>
              </div>
              
              {/* Canvas List */}
              <div className="flex-1 overflow-y-auto px-6 pb-6 canvas-list-responsive">
                <CanvasList
                  canvases={allCanvases}
                  currentCanvasId={null}
                  onOpenCanvas={handleOpenCanvas}
                  onRenameCanvas={renameCanvas}
                  onDeleteCanvas={handleDeleteCanvas}
                  onDuplicateCanvas={duplicateCanvas}
                />
              </div>
            </div>
          )}
        </div>

        {/* Left Sidebar - Overlay on top of canvas */}
        {currentCanvas && isSidebarOpen && (
          <Sidebar 
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        )}
      </main>

      {/* Floating Action Buttons - Top Right */}
      {currentCanvas && (
        <FloatingActions 
          onOpenCanvasManager={() => setIsCanvasManagerOpen(true)}
          onLogout={logout}
          className="floating-actions-responsive"
        />
      )}

      {/* Undo/Redo Controls - Bottom Left */}
      {currentCanvas && <UndoRedo className="undo-redo-responsive" />}

      {/* Canvas Manager Modal */}
      <CanvasManager
        isOpen={isCanvasManagerOpen}
        onClose={() => setIsCanvasManagerOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        title="Delete Canvas?"
        message={`Are you sure you want to delete "${deleteConfirm.canvasName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default Dashboard;