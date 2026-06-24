import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DonorMap = ({ donors, userLocation }) => {
    const validDonors = donors.filter(
        (donor) => donor.latitude && donor.longitude
    );

    const center = userLocation
        ? [userLocation.latitude, userLocation.longitude]
        : validDonors.length > 0
            ? [validDonors[0].latitude, validDonors[0].longitude]
            : [23.8103, 90.4125];

    return (
        <div className="mt-10 rounded-xl overflow-hidden shadow-lg">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: "450px", width: "100%" }}
            >
                <TileLayer
                    attribution="OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation && (
                    <Marker position={[userLocation.latitude, userLocation.longitude]}>
                        <Popup>
                            <strong>Your Location</strong>
                        </Popup>
                    </Marker>
                )}

                {validDonors.map((donor) => (
                    <Marker key={donor._id} position={[donor.latitude, donor.longitude]}>
                        <Popup>
                            <div>
                                <h3 className="font-bold text-lg">{donor.user?.name}</h3>
                                <p>Blood Group: {donor.bloodGroup}</p>
                                <p>Area: {donor.area}</p>
                                <p>Status: {donor.availability}</p>

                                {donor.distance && <p>Distance: {donor.distance} KM</p>}

                                <a
                                    href={`https://wa.me/88${donor.user?.phone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    WhatsApp Contact
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default DonorMap;