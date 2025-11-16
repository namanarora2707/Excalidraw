import { create } from 'zustand';
import { createCanvas } from '../types';
import * as storage from '../utils/storage';
import { useHistoryStore } from './historyStore';
import canvasService from '../services/canvasService';

/**
 * Canvas Store - Manages all canvases and current canvas state
 */
export const useCanvasStore = create((set, get) => ({
  // Current active canvas
  currentCanvas: null,
  
  // Map of all canvases (id -> canvas)
  canvases: new Map(),
  
  // Flag to track unsaved changes
  hasUnsavedChanges: false,
  
  // Loading state
  isLoading: false,

  /**
   * Set the current canvas
   */
  setCurrentCanvas: (canvas) => set({ 
    currentCanvas: canvas,
    hasUnsavedChanges: false 
  }),

  /**
   * Create a new canvas
   */
  createNewCanvas: (name = 'Untitled Canvas') => {
    const newCanvas = createCanvas(name);
    const canvases = new Map(get().canvases);
    canvases.set(newCanvas.id, newCanvas);
    
    set({ 
      currentCanvas: newCanvas,
      canvases,
      hasUnsavedChanges: true 
    });
    
    return newCanvas;
  },

  /**
   * Update current canvas
   */
  updateCurrentCanvas: (updates) => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;

    const updatedCanvas = {
      ...currentCanvas,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const canvases = new Map(get().canvases);
    canvases.set(updatedCanvas.id, updatedCanvas);

    set({ 
      currentCanvas: updatedCanvas,
      canvases,
      hasUnsavedChanges: true 
    });
  },

  /**
   * Update canvas name
   */
  updateCanvasName: (canvasId, newName) => {
    const canvases = new Map(get().canvases);
    const canvas = canvases.get(canvasId);
    
    if (canvas) {
      const updatedCanvas = {
        ...canvas,
        name: newName,
        updatedAt: new Date().toISOString(),
      };
      canvases.set(canvasId, updatedCanvas);
      
      set({ 
        canvases,
        currentCanvas: get().currentCanvas?.id === canvasId ? updatedCanvas : get().currentCanvas,
        hasUnsavedChanges: true 
      });
    }
  },

  /**
   * Add element to current canvas
   */
  addElement: (element) => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;

    const updatedCanvas = {
      ...currentCanvas,
      elements: [...currentCanvas.elements, element],
      updatedAt: new Date().toISOString(),
    };

    const canvases = new Map(get().canvases);
    canvases.set(updatedCanvas.id, updatedCanvas);

    set({ 
      currentCanvas: updatedCanvas,
      canvases,
      hasUnsavedChanges: true 
    });
    
    // Send real-time update
    canvasService.sendAddElement(element);
    
    // Note: History commit is handled by tools calling commitChanges()
  },

  /**
   * Update element in current canvas
   */
  updateElement: (elementId, updates) => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;

    const updatedCanvas = {
      ...currentCanvas,
      elements: currentCanvas.elements.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      ),
      updatedAt: new Date().toISOString(),
    };

    const canvases = new Map(get().canvases);
    canvases.set(updatedCanvas.id, updatedCanvas);

    set({ 
      currentCanvas: updatedCanvas,
      canvases,
      hasUnsavedChanges: true 
    });
    
    // Send real-time update
    canvasService.sendUpdateElement(elementId, updates);
    
    // Note: History commit is handled by tools calling commitChanges()
  },

  /**
   * Delete element from current canvas
   */
  deleteElement: (elementId) => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;

    const updatedCanvas = {
      ...currentCanvas,
      elements: currentCanvas.elements.filter(el => el.id !== elementId),
      updatedAt: new Date().toISOString(),
    };

    const canvases = new Map(get().canvases);
    canvases.set(updatedCanvas.id, updatedCanvas);

    set({ 
      currentCanvas: updatedCanvas,
      canvases,
      hasUnsavedChanges: true 
    });
    
    // Send real-time update
    canvasService.sendDeleteElement(elementId);
    
    // Note: History commit is handled by tools calling commitChanges()
  },

  /**
   * Delete multiple elements
   */
  deleteElements: (elementIds) => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;

    const elementIdSet = new Set(elementIds);
    const updatedCanvas = {
      ...currentCanvas,
      elements: currentCanvas.elements.filter(el => !elementIdSet.has(el.id)),
      updatedAt: new Date().toISOString(),
    };

    const canvases = new Map(get().canvases);
    canvases.set(updatedCanvas.id, updatedCanvas);

    set({ 
      currentCanvas: updatedCanvas,
      canvases,
      hasUnsavedChanges: true 
    });
    
    // Send real-time updates for each deleted element
    elementIds.forEach(id => canvasService.sendDeleteElement(id));
  },

  /**
   * Delete a canvas
   */
  deleteCanvas: (canvasId) => {
    const canvases = new Map(get().canvases);
    canvases.delete(canvasId);
    
    const currentCanvas = get().currentCanvas;
    const newCurrentCanvas = currentCanvas?.id === canvasId ? null : currentCanvas;
    
    set({ 
      canvases,
      currentCanvas: newCurrentCanvas,
      hasUnsavedChanges: true 
    });
  },

  /**
   * Duplicate a canvas
   */
  duplicateCanvas: (canvasId) => {
    const canvases = new Map(get().canvases);
    const canvas = canvases.get(canvasId);
    
    if (canvas) {
      const duplicatedCanvas = {
        ...canvas,
        id: `canvas_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${canvas.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      canvases.set(duplicatedCanvas.id, duplicatedCanvas);
      
      set({ 
        canvases,
        hasUnsavedChanges: true 
      });
      
      return duplicatedCanvas;
    }
    
    return null;
  },

  /**
   * Load all canvases (from localStorage)
   */
  loadCanvases: (canvasesMap) => {
    set({ 
      canvases: new Map(canvasesMap),
      isLoading: false 
    });
  },

  /**
   * Set loading state
   */
  setLoading: (isLoading) => set({ isLoading }),

  /**
   * Mark changes as saved
   */
  markAsSaved: () => set({ hasUnsavedChanges: false }),

  /**
   * Clear all canvases (for testing)
   */
  clearAll: () => set({ 
    currentCanvas: null,
    canvases: new Map(),
    hasUnsavedChanges: false 
  }),

  /**
   * Create a new canvas and save to backend
   */
  createCanvas: async (name = 'Untitled Canvas') => {
    set({ isLoading: true });
    
    try {
      const newCanvas = createCanvas(name);
      const response = await canvasService.createCanvas(newCanvas);
      
      if (response.success) {
        const savedCanvas = response.data;
        const canvases = new Map(get().canvases);
        canvases.set(savedCanvas._id, savedCanvas);
        
        // Initialize history with the new canvas
        useHistoryStore.getState().initializeHistory(savedCanvas);
        
        set({ 
          currentCanvas: savedCanvas,
          canvases,
          hasUnsavedChanges: false,
          isLoading: false
        });
        
        // Join the canvas room for real-time collaboration
        canvasService.joinCanvas(savedCanvas._id);
        
        return savedCanvas;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error creating canvas:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  /**
   * Load a canvas by ID from backend
   */
  loadCanvas: async (canvasId) => {
    set({ isLoading: true });
    
    try {
      const response = await canvasService.getCanvas(canvasId);
      
      if (response.success) {
        const canvas = response.data;
        const canvases = new Map(get().canvases);
        canvases.set(canvas._id, canvas);
        
        // Initialize history with the loaded canvas
        useHistoryStore.getState().initializeHistory(canvas);
        
        set({ 
          currentCanvas: canvas,
          canvases,
          hasUnsavedChanges: false,
          isLoading: false
        });
        
        // Join the canvas room for real-time collaboration
        canvasService.joinCanvas(canvas._id);
        
        return true;
      } else {
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('Error loading canvas:', error);
      set({ isLoading: false });
      return false;
    }
  },

  /**
   * Load last opened canvas or initialize from backend
   */
  loadLastCanvas: async () => {
    set({ isLoading: true });
    
    try {
      // Get all canvases from backend
      const response = await canvasService.getAllCanvases();
      
      if (response.success) {
        const canvasesArray = response.data;
        const canvasesMap = new Map();
        
        // Convert array to map
        canvasesArray.forEach(canvas => {
          canvasesMap.set(canvas._id, canvas);
        });
        
        set({ 
          canvases: canvasesMap,
          isLoading: false
        });
        
        // If there are canvases, load the first one
        if (canvasesArray.length > 0) {
          const firstCanvas = canvasesArray[0];
          
          // Initialize history with the loaded canvas
          useHistoryStore.getState().initializeHistory(firstCanvas);
          
          set({ 
            currentCanvas: firstCanvas,
            hasUnsavedChanges: false
          });
          
          // Join the canvas room for real-time collaboration
          canvasService.joinCanvas(firstCanvas._id);
          
          return true;
        }
      }
      
      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error('Error loading canvases:', error);
      set({ isLoading: false });
      return false;
    }
  },

  /**
   * Save current canvas to backend
   */
  saveCanvas: async () => {
    const currentCanvas = get().currentCanvas;
    if (currentCanvas) {
      set({ isLoading: true });
      
      try {
        // Convert canvas to backend format
        const canvasData = {
          name: currentCanvas.name,
          elements: currentCanvas.elements,
          appState: currentCanvas.appState
        };
        
        const response = await canvasService.updateCanvas(currentCanvas._id, canvasData);
        
        if (response.success) {
          set({ 
            hasUnsavedChanges: false,
            isLoading: false
          });
          return true;
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        console.error('Error saving canvas:', error);
        set({ isLoading: false });
        return false;
      }
    }
    return false;
  },

  /**
   * Rename a canvas
   */
  renameCanvas: async (canvasId, newName) => {
    const canvases = new Map(get().canvases);
    const canvas = canvases.get(canvasId);
    
    if (canvas) {
      // Update local state first
      const updatedCanvas = {
        ...canvas,
        name: newName,
        updatedAt: new Date().toISOString(),
      };
      canvases.set(canvasId, updatedCanvas);
      
      set({ 
        canvases,
        currentCanvas: get().currentCanvas?._id === canvasId ? updatedCanvas : get().currentCanvas,
        hasUnsavedChanges: true 
      });
      
      // Save to backend
      try {
        const canvasData = {
          name: newName,
          elements: updatedCanvas.elements,
          appState: updatedCanvas.appState
        };
        
        const response = await canvasService.updateCanvas(canvasId, canvasData);
        
        if (response.success) {
          set({ hasUnsavedChanges: false });
        }
      } catch (error) {
        console.error('Error renaming canvas:', error);
      }
    }
  },

  /**
   * Delete a canvas (with backend sync)
   */
  deleteCanvas: async (canvasId) => {
    set({ isLoading: true });
    
    try {
      const response = await canvasService.deleteCanvas(canvasId);
      
      if (response.success) {
        const canvases = new Map(get().canvases);
        canvases.delete(canvasId);
        
        const currentCanvas = get().currentCanvas;
        const newCurrentCanvas = currentCanvas?._id === canvasId ? null : currentCanvas;
        
        set({ 
          canvases,
          currentCanvas: newCurrentCanvas,
          hasUnsavedChanges: false,
          isLoading: false
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error deleting canvas:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Duplicate a canvas (with backend sync)
   */
  duplicateCanvas: async (canvasId) => {
    set({ isLoading: true });
    
    try {
      const canvases = new Map(get().canvases);
      const canvas = canvases.get(canvasId);
      
      if (canvas) {
        // Create a new canvas with duplicated data
        const duplicatedCanvas = {
          name: `${canvas.name} (Copy)`,
          elements: canvas.elements,
          appState: canvas.appState
        };
        
        const response = await canvasService.createCanvas(duplicatedCanvas);
        
        if (response.success) {
          const savedCanvas = response.data;
          canvases.set(savedCanvas._id, savedCanvas);
          
          set({ 
            canvases,
            hasUnsavedChanges: false,
            isLoading: false
          });
          
          return savedCanvas;
        } else {
          throw new Error(response.error);
        }
      }
    } catch (error) {
      console.error('Error duplicating canvas:', error);
      set({ isLoading: false });
    }
    
    return null;
  },

  /**
   * Get all canvases as array (helper function)
   */
  getAllCanvases: () => {
    return Array.from(get().canvases.values());
  },

  /**
   * Commit current state to history (for undo/redo)
   */
  commitToHistory: () => {
    const currentCanvas = get().currentCanvas;
    if (currentCanvas) {
      useHistoryStore.getState().pushState(currentCanvas);
    }
  },

  /**
   * Undo last action
   */
  undo: () => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;
    
    const { undoStack } = useHistoryStore.getState();
    
    // Need at least 2 states (current + previous) to undo
    if (undoStack.length < 2) {
      return;
    }
    
    const previousState = useHistoryStore.getState().undo(currentCanvas);
    
    if (previousState) {
      // Restore the previous state without triggering history
      const canvases = new Map(get().canvases);
      canvases.set(previousState._id || previousState.id, previousState);
      
      set({
        currentCanvas: previousState,
        canvases,
        hasUnsavedChanges: true
      });
    }
  },

  /**
   * Redo last undone action
   */
  redo: () => {
    const currentCanvas = get().currentCanvas;
    if (!currentCanvas) return;
    
    const nextState = useHistoryStore.getState().redo(currentCanvas);
    
    if (nextState) {
      // Restore the next state without triggering history
      const canvases = new Map(get().canvases);
      canvases.set(nextState._id || nextState.id, nextState);
      
      set({
        currentCanvas: nextState,
        canvases,
        hasUnsavedChanges: true
      });
    }
  },

  /**
   * Check if undo is available
   */
  canUndo: () => {
    return useHistoryStore.getState().canUndo();
  },

  /**
   * Check if redo is available
   */
  canRedo: () => {
    return useHistoryStore.getState().canRedo();
  },
}));