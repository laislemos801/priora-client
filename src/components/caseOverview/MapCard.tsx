import { useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Panel from "./Panel";
import L from "leaflet";

type MapCardProps = {
  endereco: string;
};

type Coordinates = {
  lat: number;
  lon: number;
};

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

export default function MapCard({ endereco }: MapCardProps) {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchCoordinates() {
      if (!endereco) return;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          endereco
        )}`
      );

      const data = await response.json();

      if (data?.[0]) {
        setCoords({
          lat: Number(data[0].lat),
          lon: Number(data[0].lon),
        });
      }
    }

    fetchCoordinates();
  }, [endereco]);

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
        <div className="h-[195px] overflow-hidden rounded-md bg-[#303030]">
          {coords ? (
            <MapView coords={coords} endereco={endereco} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/65">
              Localização não encontrada
            </div>
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
              <MapView coords={coords} endereco={endereco} zoom={16} />
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