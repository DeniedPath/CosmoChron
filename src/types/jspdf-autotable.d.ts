import { jsPDF } from 'jspdf';

declare module 'jspdf-autotable' {
  export interface UserOptions {
    head?: (string | number | null | undefined)[][];
    body?: (string | number | null | undefined)[][];
    foot?: (string | number | null | undefined)[][];
    columns?: Array<string | number | null | undefined> | undefined;
    margin?: Margin;
    startY?: number;
    showHead?: 'everyPage' | 'firstPage' | 'never';
    showFoot?: 'everyPage' | 'lastPage' | 'never';
    theme?: 'striped' | 'grid' | 'plain';
    styles?: Partial<Styles>;
    headStyles?: Partial<Styles>;
    bodyStyles?: Partial<Styles>;
    footStyles?: Partial<Styles>;
    alternateRowStyles?: Partial<Styles>;
    columnStyles?: {
      [key: string]: Partial<Styles>;
    };
    didDrawPage?: (data: { pageNumber: number; pageCount: number; table: TableData; cursor: Position; settings: UserOptions }) => void;
    didDrawCell?: (data: { cell: CellData; pageNumber: number; cursor: Position }) => void;
    willDrawCell?: (data: { cell: CellData; pageNumber: number; cursor: Position }) => void;
    didParseCell?: (data: { cell: ParsedCellData }) => void;
    tableWidth?: 'auto' | 'wrap' | number;
  }

  export interface Margin {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  }

  export interface Styles {
    font?: string;
    fontStyle?: string;
    fontSize?: number;
    lineColor?: string | number[];
    lineWidth?: number;
    cellPadding?: number;
    fillColor?: string | number[];
    textColor?: string | number[];
    halign?: 'left' | 'center' | 'right';
    valign?: 'top' | 'middle' | 'bottom';
    overflow?: 'visible' | 'hidden' | 'ellipsize';
    cellWidth?: 'auto' | 'wrap' | number;
    minCellHeight?: number;
    minCellWidth?: number;
  }

  export interface CellData {
    x: number;
    y: number;
    width: number;
    height: number;
    styles: Styles;
    section: 'head' | 'body' | 'foot';
    row: { index: number; raw: unknown[] };
    column: { index: number; raw: unknown };
  }

  export interface ParsedCellData {
    raw: unknown;
    styles: Styles;
    text: string | string[];
    section: 'head' | 'body' | 'foot';
    row: { index: number; raw: unknown[] };
    column: { index: number; raw: unknown; dataKey: string | number };
  }

  export interface Position {
    x: number;
    y: number;
  }

  export interface TableData {
    startY?: number;
    body: unknown[][];
    foot: unknown[][];
    head: unknown[][];
  }

  export interface AutoTableOutput {
    previous?: AutoTableOutput;
    finalY?: number;
    pageNumber?: number;
    pageCount?: number;
    table: TableData;
    cursor: Position;
  }

  function autoTable(doc: jsPDF, options: UserOptions): AutoTableOutput;
  export default autoTable;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable(options: import('jspdf-autotable').UserOptions): import('jspdf-autotable').AutoTableOutput;
    autoTable(
      head: (string | number | null | undefined)[][],
      body: (string | number | null | undefined)[][],
      options?: Omit<import('jspdf-autotable').UserOptions, 'head' | 'body'>
    ): import('jspdf-autotable').AutoTableOutput;
    autoTable(
      columns: Array<string | number | null | undefined>,
      body: (string | number | null | undefined)[][],
      options?: Omit<import('jspdf-autotable').UserOptions, 'columns' | 'body'>
    ): import('jspdf-autotable').AutoTableOutput;
  }
}
