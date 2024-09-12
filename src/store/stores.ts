import { create } from "zustand";

interface FileState {
  file: File | null;
  setFile: (newFile: File | null) => void
}

export type OperationType = 'colorPicker' | 'eraser' | '';

interface OperationState {
  operation: OperationType,
  setOperation: (operation: OperationType) => void
}


export const useFileState = create<FileState>((set) => ({
  file: null,
  setFile: (newFile) => set(() => {
    return {
      file: newFile,
    };
  }),
}));

export const useOperationState = create<OperationState>((set) => ({
  operation: '',
  setOperation: (operation) => set(() => {
    return {
      operation,
    };
  })
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