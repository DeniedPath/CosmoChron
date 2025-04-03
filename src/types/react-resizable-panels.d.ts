declare module 'react-resizable-panels' {
  import * as React from 'react';

  export interface PanelProps {
    children?: React.ReactNode;
    className?: string;
    collapsible?: boolean;
    defaultSize?: number;
    id?: string;
    maxSize?: number;
    minSize?: number;
    order?: number;
    style?: React.CSSProperties;
    onCollapse?: (collapsed: boolean) => void;
    onExpand?: (expanded: boolean) => void;
    onResize?: (size: number) => void;
  }

  export interface PanelGroupProps {
    autoSaveId?: string;
    children?: React.ReactNode;
    className?: string;
    direction?: 'horizontal' | 'vertical';
    id?: string;
    storage?: Storage;
    style?: React.CSSProperties;
    onLayout?: (sizes: number[]) => void;
  }

  export interface PanelResizeHandleProps {
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    id?: string;
    style?: React.CSSProperties;
  }

  export const Panel: React.FC<PanelProps>;
  export const PanelGroup: React.FC<PanelGroupProps>;
  export const PanelResizeHandle: React.FC<PanelResizeHandleProps>;
}
