declare module 'react-quill' {
  import { Component } from 'react';
  import Quill from 'quill';

  export interface QuillOptions {
    debug?: string | boolean;
    modules?: Record<string, any>;
    placeholder?: string;
    readOnly?: boolean;
    theme?: string;
    formats?: string[];
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
  }

  export interface ReactQuillProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    readOnly?: boolean;
    modules?: Record<string, any>;
    formats?: string[];
    style?: React.CSSProperties;
    className?: string;
    theme?: string;
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    onChange?: (
      value: string,
      delta: any,
      source: string,
      editor: UnprivilegedEditor
    ) => void;
    onChangeSelection?: (
      selection: any,
      source: string,
      editor: UnprivilegedEditor
    ) => void;
    onFocus?: (selection: any, source: string, editor: UnprivilegedEditor) => void;
    onBlur?: (
      previousSelection: any,
      source: string,
      editor: UnprivilegedEditor
    ) => void;
    onKeyPress?: React.EventHandler<any>;
    onKeyDown?: React.EventHandler<any>;
    onKeyUp?: React.EventHandler<any>;
    tabIndex?: number;
    preserveWhitespace?: boolean;
  }

  export interface UnprivilegedEditor {
    getLength(): number;
    getText(index?: number, length?: number): string;
    getHTML(): string;
    getBounds(index: number, length?: number): any;
    getSelection(focus?: boolean): any;
    getContents(index?: number, length?: number): any;
  }

  export default class ReactQuill extends Component<ReactQuillProps> {
    editor?: Quill;
    getEditor(): Quill;
    focus(): void;
    blur(): void;
  }
}
