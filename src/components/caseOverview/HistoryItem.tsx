type HistoryItemProps = {
  children: React.ReactNode;
};

export default function HistoryItem({ children }: HistoryItemProps) {
  return (
    <li className="flex gap-3">
      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
      <span>{children}</span>
    </li>
  );
}