function generateCode() {
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
}

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = _deg2rad(lat2 - lat1);
  const dLon = _deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(_deg2rad(lat1)) * Math.cos(_deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

function _deg2rad(deg) {
  return deg * (Math.PI/180);
}

export { generateCode, calculateHaversineDistance };