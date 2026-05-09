// Fetch nearby shelters, hospitals, fire stations using Overpass API (OpenStreetMap)
export async function fetchNearbyShelters(lat, lon, radiusKm = 10) {
  const radiusM = radiusKm * 1000;
  const query = `
    [out:json][timeout:15];
    (
      node["amenity"="shelter"](around:${radiusM},${lat},${lon});
      node["amenity"="hospital"](around:${radiusM},${lat},${lon});
      node["emergency"="assembly_point"](around:${radiusM},${lat},${lon});
      node["amenity"="fire_station"](around:${radiusM},${lat},${lon});
      node["amenity"="police"](around:${radiusM},${lat},${lon});
      way["amenity"="hospital"](around:${radiusM},${lat},${lon});
      way["amenity"="shelter"](around:${radiusM},${lat},${lon});
    );
    out center body;
  `.trim();

  try {
    const resp = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    if (!resp.ok) throw new Error('Overpass API error');
    const data = await resp.json();

    return data.elements.map((el) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLon = el.lon ?? el.center?.lon;
      const dist = haversine(lat, lon, elLat, elLon);
      let type = 'shelter';
      if (el.tags?.amenity === 'hospital') type = 'hospital';
      else if (el.tags?.amenity === 'fire_station') type = 'fire_station';
      else if (el.tags?.amenity === 'police') type = 'police';
      return {
        name: el.tags?.name || el.tags?.['name:en'] || null,
        lat: elLat,
        lon: elLon,
        type,
        distance: dist,
        address: el.tags?.['addr:street'] || null,
        phone: el.tags?.phone || null,
      };
    }).filter(s => s.lat && s.lon).sort((a, b) => a.distance - b.distance);
  } catch (err) {
    console.error('Error fetching shelters:', err);
    return [];
  }
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


