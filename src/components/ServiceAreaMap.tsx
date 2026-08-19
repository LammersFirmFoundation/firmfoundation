import { MapContainer, TileLayer, Marker, Tooltip, Circle } from "react-leaflet";
import L from "leaflet";
import { serviceAreas } from "@/data/business";


const markerIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:20px;height:20px;">
      <div style="
        position:absolute;inset:0;
        border-radius:50%;
        background:hsl(45,96%,59%);
        border:2px solid white;
        box-shadow:0 0 10px 2px hsla(45,96%,59%,0.55);
      "></div>
      <div class="map-pulse-ring" style="
        position:absolute;inset:-6px;
        border-radius:50%;
        border:2px solid hsl(45,96%,59%);
      "></div>
    </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const ServiceAreaMap = () => {
  return (
    <div className="relative rounded-lg overflow-hidden" style={{ zIndex: 0 }}>
      {/* Map */}
      <div className="h-[300px] md:h-[400px]">
        <MapContainer
          center={[32.77, -79.90]}
          zoom={10}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}
          className="service-area-map h-full w-full"
          style={{ zIndex: 0, background: "hsl(216,17%,12%)" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <Circle
            center={[32.77, -79.90]}
            radius={18000}
            pathOptions={{
              color: "hsl(45,96%,59%)",
              weight: 2,
              dashArray: "8 6",
              fillColor: "hsl(45,96%,59%)",
              fillOpacity: 0.08,
            }}
          />
          {serviceAreas.map((area) => (
            // Non-interactive: the permanent tooltip already exposes the name
            // as text, so a focusable, unnamed marker button adds only noise.
            <Marker
              key={area.name}
              position={area.coords}
              icon={markerIcon}
              interactive={false}
              keyboard={false}
            >
              <Tooltip permanent direction={area.tooltipDir} offset={area.tooltipOffset}>
                {area.name}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Gradient edge overlays */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
      </div>

    </div>
  );
};

export default ServiceAreaMap;
