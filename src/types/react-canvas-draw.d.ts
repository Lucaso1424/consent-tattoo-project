declare module "react-canvas-draw" {
  import * as React from "react";

  export interface CanvasDrawProps {
    brushColor?: string;
    brushRadius?: number;
    canvasWidth?: number | string;
    canvasHeight?: number | string;
    lazyRadius?: number;
    hideGrid?: boolean;
    disabled?: boolean;
    imgSrc?: string;
    immediateLoading?: boolean;
    loadTimeOffset?: number;
    saveData?: string;
    onChange?: (canvas: CanvasDraw) => void;
    style?: React.CSSProperties;
    className?: string;
  }

  export default class CanvasDraw extends React.Component<CanvasDrawProps> {
    clear(): void;
    undo(): void;
    getSaveData(): string;
    loadSaveData(saveData: string, immediate?: boolean): void;
    getDataURL(fileType?: string, quality?: number): string;
    canvas: {
      drawing: HTMLCanvasElement;
      grid: HTMLCanvasElement;
    };
  }
}