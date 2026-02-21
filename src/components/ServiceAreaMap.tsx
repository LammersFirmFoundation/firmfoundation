import { MapContainer, TileLayer, Marker, Tooltip, Circle } from "react-leaflet";
import L from "leaflet";

const serviceAreas: {
  name: string;
  coords: [number, number];
  tooltipDir: "top" | "bottom" | "left" | "right";
  tooltipOffset: [number, number];
}[] = [
  { name: "Mount Pleasant", coords: [32.7933, -79.8772], tooltipDir: "left", tooltipOffset: [-10, 0] },
  { name: "Isle of Palms", coords: [32.7866, -79.7868], tooltipDir: "right", tooltipOffset: [10, 0] },
  { name: "Sullivan's Island", coords: [32.7658, -79.8375], tooltipDir: "bottom", tooltipOffset: [0, 10] },
  { name: "Dunes West", coords: [32.8971, -79.8122], tooltipDir: "top", tooltipOffset: [0, -10] },
  { name: "Park West", coords: [32.8848, -79.7839], tooltipDir: "right", tooltipOffset: [10, 0] },
];

const markerIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:20px;height:20px;">
      <div style="
        position:absolute;inset:0;
        border-radius:50%;
        background:hsl(210,60%,55%);
        border:2px solid white;
        box-shadow:0 0 10px 2px hsla(210,60%,55%,0.5);
      "></div>
      <div class="map-pulse-ring" style="
        position:absolute;inset:-6px;
        border-radius:50%;
        border:2px solid hsl(210,60%,55%);
      "></div>
    </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const ServiceAreaMap = () => {
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ zIndex: 0 }}>
      {/* Map */}
      <div className="h-[350px] md:h-[500px]">
        <MapContainer
          center={[32.835, -79.805]}
          zoom={11}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}
          className="service-area-map h-full w-full"
          style={{ zIndex: 0, background: "hsl(220,20%,10%)" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <Circle
            center={[32.83, -79.81]}
            radius={11500}
            pathOptions={{
              color: "hsl(210,60%,55%)",
              weight: 2,
              dashArray: "8 6",
              fillColor: "hsl(210,60%,55%)",
              fillOpacity: 0.08,
            }}
          />
          {serviceAreas.map((area) => (
            <Marker key={area.name} position={area.coords} icon={markerIcon}>
              <Tooltip permanent direction={area.tooltipDir} offset={area.tooltipOffset}>
                {area.name}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Gradient edge overlays */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[hsl(220,20%,10%)] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[hsl(220,20%,10%)] to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[hsl(220,20%,10%)] to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[hsl(220,20%,10%)] to-transparent" />
      </div>

    </div>
  );
};

export default ServiceAreaMap;
