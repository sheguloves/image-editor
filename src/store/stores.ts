import { create } from "zustand";

interface FileState {
  file: File | null;
  setFile: (newFile: File | null) => void
}

export type OperationType = 'colorPicker' | 'eraser' | 'fill' | 'move' | 'align' | 'transition-x' | 'transition-y';

interface OperationState {
  operation: OperationType,
  setOperation: (operation: OperationType) => void
}

export const useOperationState = create<OperationState>((set) => ({
  operation: 'move',
  setOperation: (operation) => set(() => {
    return {
      operation: operation,
    };
  })
}));


export const useFileState = create<FileState>((set) => ({
  file: null,
  setFile: (newFile) => set(() => {
    return {
      file: newFile,
    };
  }),
}));

interface PickerColorState {
  color: string;
  setColor: (color: string) => void
}

export const usePickedColorState = create<PickerColorState>((set) => {
  return {
    color: 'white',
    setColor: color => set(() => {
      return {
        color,
      }
    })
  };
})

interface ScaleState {
  scale: number;
  setScale: (scale: number | ((scale: number) => number)) => void;
}

export const useScaleState = create<ScaleState>((set) => {
  return {
    scale: 1,
    setScale: value => set((state) => {
      if (typeof value === 'number') {
        return {
          scale: value,
        }
      } else if (typeof value === 'function'){
        return {
          scale: value(state.scale),
        }
      }
      return {
        scale: state.scale,
      }
    })
  };
})