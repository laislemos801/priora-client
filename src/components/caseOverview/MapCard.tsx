import { useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Panel from "./Panel";
import L from "leaflet";

/** Campos de endereço do caso; só cidade e estado são obrigatórios. */
export type CaseLocation = {
  logradouro?: string | null;
  numero?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
};

type MapCardProps = {
  local: CaseLocation;
};

type Coordinates = {
  lat: number;
  lon: number;
};

type Precision = "endereco" | "bairro" | "cidade";

type Found = Coordinates & { precision: Precision; label: string };

const UF_NAMES: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará",
  DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão",
  MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais", PA: "Pará",
  PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte", RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima",
  SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins",
};

const ZOOM: Record<Precision, number> = { endereco: 16, bairro: 14, cidade: 12 };
const PRECISION_NOTE: Record<Precision, string | null> = {
  endereco: null,
  bairro: "Localização aproximada: mostrando o bairro.",
  cidade: "Localização aproximada: mostrando a cidade.",
};

const join = (...parts: (string | null | undefined)[]) =>
  parts.map((p) => (p ?? "").trim()).filter(Boolean).join(", ");

type Query = { q: string; precision: Precision; label: string };

/**
 * Consultas do mais específico ao mais genérico. Endereço digitado à mão nem sempre
 * existe no mapa (ex.: "Represa de Nazaré Paulista"); se a busca completa falhar,
 * tenta o bairro e por fim só a cidade, que sempre aparece.
 */
function buildQueries(l: CaseLocation): Query[] {
  const estado = UF_NAMES[(l.estado ?? "").trim().toUpperCase()] ?? (l.estado ?? "").trim();
  const cidadeUF = join(l.cidade, estado, "Brasil");
  const out: Query[] = [];

  if ((l.logradouro ?? "").trim()) {
    const rua = [l.logradouro, l.numero].map((p) => (p ?? "").trim()).filter(Boolean).join(" ");
    out.push({
      q: join(rua, l.bairro, cidadeUF),
      precision: "endereco",
      label: join(l.logradouro, l.numero, l.bairro, l.cidade, l.estado),
    });
    // sem o número (muitas vezes não existe no mapa)
    if ((l.numero ?? "").trim()) {
      out.push({
        q: join(l.logradouro, l.bairro, cidadeUF),
        precision: "endereco",
        label: join(l.logradouro, l.bairro, l.cidade, l.estado),
      });
    }
  }
  if ((l.bairro ?? "").trim()) {
    out.push({ q: join(l.bairro, cidadeUF), precision: "bairro", label: join(l.bairro, l.cidade, l.estado) });
  }
  if ((l.cidade ?? "").trim()) {
    out.push({ q: cidadeUF, precision: "cidade", label: join(l.cidade, l.estado) });
  }
  return out;
}

async function geocode(q: string): Promise<Coordinates | null> {
  const key = `geo:${q}`;
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) return JSON.parse(cached) as Coordinates | null;
  } catch {
    /* sem cache */
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(q)}`,
  );
  if (!res.ok) throw new Error("geocoding failed");
  const data = await res.json();
  const found = data?.[0] ? { lat: Number(data[0].lat), lon: Number(data[0].lon) } : null;

  try {
    sessionStorage.setItem(key, JSON.stringify(found));
  } catch {
    /* sem cache */
  }
  return found;
}

const customIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapCard({ local }: MapCardProps) {
  const [found, setFound] = useState<Found | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "notfound" | "error">("loading");
  const [expanded, setExpanded] = useState(false);

  const key = JSON.stringify([local.logradouro, local.numero, local.bairro, local.cidade, local.estado]);

  useEffect(() => {
    let cancelled = false;
    const [logradouro, numero, bairro, cidade, estado] = JSON.parse(key) as (string | null)[];
    const queries = buildQueries({ logradouro, numero, bairro, cidade, estado });

    async function run() {
      setStatus("loading");
      try {
        for (const query of queries) {
          const c = await geocode(query.q);
          if (cancelled) return;
          if (c) {
            setFound({ ...c, precision: query.precision, label: query.label });
            setStatus("ok");
            return;
          }
        }
        setFound(null);
        setStatus("notfound");
      } catch {
        if (!cancelled) {
          setFound(null);
          setStatus("error");
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [key]);

  const coords = found;
  const endereco = found?.label ?? "";
  const zoom = found ? ZOOM[found.precision] : 15;
  const note = found ? PRECISION_NOTE[found.precision] : null;

  return (
    <>
      <Panel
        title="Localização Geográfica"
        action={
          <button
            onClick={() => setExpanded(true)}
            className="text-white/65 hover:text-white"
          >
            <Maximize2 size={16} />
          </button>
        }
      >
        <div className="relative min-h-[195px] flex-1 overflow-hidden rounded-md bg-[#303030]">
          <div className="absolute inset-0">
            {coords ? (
              <MapView coords={coords} endereco={endereco} zoom={zoom} />
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/65">
                {status === "loading"
                  ? "Buscando localização..."
                  : status === "error"
                  ? "Não foi possível carregar o mapa. Verifique a conexão com a internet."
                  : "Localização não encontrada. Confira a cidade e o estado do caso."}
              </div>
            )}
          </div>
          {note && (
            <p className="absolute bottom-2 left-2 z-[400] rounded bg-black/70 px-2 py-1 text-[11px] text-white/80">
              {note}
            </p>
          )}
        </div>
      </Panel>

      {expanded && coords && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative h-[80vh] w-full max-w-5xl overflow-hidden rounded-xl border border-[#4a4a4a] bg-[#242424] p-4">
            <button
              onClick={() => setExpanded(false)}
              className="absolute right-5 top-5 z-[9999] rounded-full bg-[#2b2b2b] p-2 text-white/70 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="h-full overflow-hidden rounded-lg">
              <MapView coords={coords} endereco={endereco} zoom={Math.min(zoom + 1, 17)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MapView({
  coords,
  endereco,
  zoom = 15,
}: {
  coords: Coordinates;
  endereco: string;
  zoom?: number;
}) {
  return (
    <MapContainer
      key={`${coords.lat},${coords.lon},${zoom}`}
      center={[coords.lat, coords.lon]}
      zoom={zoom}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; Stadia Maps &copy; OpenMapTiles &copy; OpenStreetMap contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
      />

      <Marker
        position={[coords.lat, coords.lon]}
        icon={customIcon}
      >
        <Popup>{endereco}</Popup>
      </Marker>
    </MapContainer>
  );
}