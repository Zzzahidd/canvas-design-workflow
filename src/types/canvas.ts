export type ToolMode =
  | 'select'
  | 'hand'
  | 'measure'
  | 'draw'
  | 'marquee'
  | 'layers'
  | 'ruler'
  | 'grid'
  | 'device'
  | 'eyedropper'
  | 'camera'
  | 'add'
  | 'settings';

export type ProductConcept = 'thread' | 'workbench' | 'desk';
export type ScreenType = 'chat-home' | 'chat-active' | 'list' | 'detail' | 'create';

export interface BoardConfig {
  id: string;
  concept: ProductConcept;
  type: ScreenType;
  labelNumber: number;
  labelTitle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}
