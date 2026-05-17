type MetricCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

export default function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <div className="flex min-h-[112px] justify-between rounded-lg border border-[#3d3d3d] bg-[#252525] p-4">
      <div className="flex flex-col justify-between">
        <p className="text-xs font-medium text-white">{title}</p>
        <p className="text-4xl font-light leading-none text-white">{value}</p>
      </div>

      <div className="flex items-end text-emerald-900">{icon}</div>
    </div>
  );
}