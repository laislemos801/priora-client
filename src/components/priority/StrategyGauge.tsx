import ArcGauge from "@/components/ui/ArcGauge";

type Props = {
  importancia: number;
};

export default function StrategyGauge({ importancia }: Props) {
  return <ArcGauge value={importancia} label="Importância" />;
}
