import type { Node, Edge } from '@xyflow/react';

export type BoardNodeShape = 'rectangle' | 'circle' | 'diamond';
export type BoardNodeVariant = 'box' | 'postit';

export interface TextBoxData extends Record<string, unknown> {
  label: string;
  color: string; // hex livre, ex: '#9751F2' — escolhido via color picker nativo
  shape?: BoardNodeShape; // ignorado quando variant === 'postit'
  variant?: BoardNodeVariant; // default: 'box'
}

export interface ImageBoxData extends Record<string, unknown> {
  imageUrl: string;
  caption: string;
  caseId: string;
}

export interface NoteData extends Record<string, unknown> {
  text: string;
}

export type TextBoxNodeType = Node<TextBoxData, 'textBox'>;
export type ImageBoxNodeType = Node<ImageBoxData, 'imageBox'>;
export type NoteNodeType = Node<NoteData, 'note'>;

export type BoardNode = TextBoxNodeType | ImageBoxNodeType | NoteNodeType;
export type BoardEdge = Edge;

// Formato que deve ir/vir do backend FastAPI
export interface BoardPayload {
  nodes: BoardNode[];
  edges: BoardEdge[];
}
