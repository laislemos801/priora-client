import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TextBoxNode from '../../components/evidenceboard/TextBoxNode';
import ImageBoxNode from '../../components/evidenceboard/ImageBoxNode';
import NoteNode from '../../components/evidenceboard/NoteNode';
import BoardToolbar, { type ShapeTool } from '../../components/evidenceboard/BoardToolbar';
import type { BoardNode, BoardEdge } from '../../components/evidenceboard/types';

const nodeTypes = {
  textBox: TextBoxNode,
  imageBox: ImageBoxNode,
  note: NoteNode,
};

function BoardCanvas({
  initialNodes,
  initialEdges,
  onSave,
  isSaving,
}: {
  initialNodes: BoardNode[];
  initialEdges: BoardEdge[];
  onSave: (nodes: BoardNode[], edges: BoardEdge[]) => void;
  isSaving: boolean;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  // quando o fetch do backend terminar e initialNodes/Edges chegarem, sincroniza o canvas
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge({ ...connection, type: 'step', style: { stroke: '#e5e5e5' } }, eds)
      ),
    [setEdges]
  );

  const handleAddShape = useCallback(
    (tool: ShapeTool) => {
      // posiciona o novo node perto do centro do canvas visível
      const bounds = wrapperRef.current?.getBoundingClientRect();
      const center = bounds
        ? screenToFlowPosition({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 })
        : { x: 250, y: 250 };

      const id = crypto.randomUUID();
      let newNode: BoardNode;

      switch (tool) {
        case 'image':
          newNode = {
            id,
            type: 'imageBox',
            position: center,
            data: { imageUrl: '', caption: 'Legenda...' },
          };
          break;

        case 'text':
          // label solto, sem caixa ao redor (ex: "Quem é?")
          newNode = {
            id,
            type: 'note',
            position: center,
            data: { text: 'Texto aqui...' },
          };
          break;

        case 'note':
          // post-it de verdade: papel colorido, sem forma/caixa
          newNode = {
            id,
            type: 'textBox',
            position: center,
            data: { label: 'Texto aqui...', color: '#fde68a', variant: 'postit' },
          };
          break;

        case 'circle':
          newNode = {
            id,
            type: 'textBox',
            position: center,
            data: { label: 'Texto aqui...', color: '#9b6ff0', shape: 'circle' },
          };
          break;

        case 'diamond':
          newNode = {
            id,
            type: 'textBox',
            position: center,
            data: { label: 'Texto aqui...', color: '#9b6ff0', shape: 'diamond' },
          };
          break;

        case 'arrow':
          // não cria node: conexões são feitas arrastando de um handle a outro
          toast('Arraste de um ponto de conexão a outro para criar uma seta.');
          return;

        // 'rectangle'
        default:
          newNode = {
            id,
            type: 'textBox',
            position: center,
            data: { label: 'Texto aqui...', color: '#9b6ff0', shape: 'rectangle' },
          };
      }

      setNodes((nds) => [...nds, newNode]);
    },
    [screenToFlowPosition, setNodes]
  );

  const handleDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected));
    setEdges((eds) => eds.filter((e) => !e.selected));
  }, [setNodes, setEdges]);

  const handleSaveClick = useCallback(() => {
    onSave(nodes as BoardNode[], edges);
  }, [nodes, edges, onSave]);

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <BoardToolbar
        onAddShape={handleAddShape}
        onSave={handleSaveClick}
        onDeleteSelected={handleDeleteSelected}
        isSaving={isSaving}
      />

      <div ref={wrapperRef} className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} color="#3f3f46" gap={22} size={1} />
          <Controls className="bg-zinc-900! border-zinc-700 [&>button]:bg-zinc-900! [&>button]:border-zinc-700! [&>button]:text-zinc-300!" />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function EvidenceBoard() {
  // mesma chave "id" que o TopBar.tsx já usa pra buscar o caso
  const { id } = useParams<{ id: string }>();

  const [nodes, setNodes] = useState<BoardNode[]>([]);
  const [edges, setEdges] = useState<BoardEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function loadBoard() {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/cases/${id}/board`);

        if (response.status === 404) {
          if (!cancelled) {
            setNodes([]);
            setEdges([]);
          }
          return;
        }

        if (!response.ok) throw new Error('Erro ao carregar o quadro investigativo.');

        const data = await response.json();
        if (!cancelled) {
          setNodes(data.nodes ?? []);
          setEdges(data.edges ?? []);
        }
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Erro ao carregar o quadro.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadBoard();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSave = useCallback(
    async (updatedNodes: BoardNode[], updatedEdges: BoardEdge[]) => {
      if (!id) return;
      setIsSaving(true);
      try {
        const response = await fetch(`http://localhost:8000/cases/${id}/board`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes: updatedNodes, edges: updatedEdges }),
        });
        if (!response.ok) throw new Error('Erro ao salvar o quadro investigativo.');
        toast.success('Quadro salvo com sucesso!');
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Erro ao salvar o quadro.');
      } finally {
        setIsSaving(false);
      }
    },
    [id]
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-400 text-sm">
        Carregando quadro investigativo...
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <BoardCanvas
        initialNodes={nodes}
        initialEdges={edges}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </ReactFlowProvider>
  );
}
