import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const userIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149060.png",
    iconSize: [34, 34],
});

const donorIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [36, 36],
});

const DonorMap = ({ donors, userLocation }) => {
    const donorsWithLocation = donors.filter(
        (donor) => donor.latitude && donor.longitude
    );

    const center = userLocation
        ? [userLocation.latitude, userLocation.longitude]
        : donorsWithLocation.length > 0
            ? [donorsWithLocation[0].latitude, donorsWithLocation[0].longitude]
            : [23.8103, 90.4125];

    return (
        <div className="h-[420px] w-full rounded-2xl overflow-hidden shadow-lg border mt-6">
            <MapContainer center={center} zoom={14} className="h-full w-full z-0">
                <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation && (
                    <Marker
                        position={[userLocation.latitude, userLocation.longitude]}
                        icon={userIcon}
                    >
                        <Popup>
                            <strong>📍 You are here</strong>
                            <br />
                            Your current location
                        </Popup>
                    </Marker>
                )}

                {donorsWithLocation.map((donor) => (
                    <Marker
                        key={donor._id}
                        position={[donor.latitude, donor.longitude]}
                        icon={donorIcon}
                    >
                        <Popup>
                            <div>
                                <h3 className="font-bold text-red-600">
                                    {donor.user?.name}
                                </h3>
                                <p>🩸 {donor.bloodGroup}</p>
                                <p>📍 {donor.area}</p>
                                <p>✅ {donor.availability}</p>

                                {donor.distance !== null && donor.distance !== undefined && (
                                    <p>📏 {donor.distance} KM away</p>
                                )}

                                <div className="flex gap-2 mt-2">
                                    <a
                                        href={`tel:${donor.user?.phone}`}
                                        className="bg-gray-900 text-white px-3 py-1 rounded text-xs"
                                    >
                                        Call
                                    </a>

                                    <a
                                        href={`https://wa.me/88${donor.user?.phone}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                                    >
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default DonorMap;