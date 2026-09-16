import type { BoardNode, BoardEdge } from './types';

export const initialNodes: BoardNode[] = [
  {
    id: 'n1',
    type: 'textBox',
    position: { x: 80, y: 80 },
    data: { label: 'Tiro disparado de cima do mesanino', color: 'green' },
  },
  {
    id: 'n2',
    type: 'imageBox',
    position: { x: 340, y: 60 },
    data: {
      imageUrl: '', // troque pela URL real da evidência vinda do backend
      caption: '',
    },
  },
  {
    id: 'n2-label',
    type: 'note',
    position: { x: 340, y: 40 },
    data: { text: 'Quem é?' },
  },
  {
    id: 'n3',
    type: 'textBox',
    position: { x: 380, y: 260 },
    data: { label: 'Texto aqui...', color: 'purple' },
  },
  {
    id: 'n4',
    type: 'imageBox',
    position: { x: 120, y: 340 },
    data: {
      imageUrl: '',
      caption: 'Vítima é arremessada pela escada',
    },
  },
  {
    id: 'n5',
    type: 'imageBox',
    position: { x: 560, y: 340 },
    data: {
      imageUrl: '',
      caption: 'Passaporte russo encontrado no apartamento do suspeito',
    },
  },
];

export const initialEdges: BoardEdge[] = [
  { id: 'e1', source: 'n1', target: 'n4', style: { stroke: '#e05252' }, type: 'step' },
  { id: 'e2', source: 'n2', target: 'n3', type: 'step', label: 'Texto aqui...' },
  { id: 'e3', source: 'n2', target: 'n5', type: 'step', label: 'Alguma conexão?' },
];
