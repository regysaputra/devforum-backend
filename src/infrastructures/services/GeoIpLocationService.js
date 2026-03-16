import LocationService from "../../applications/interfaces/LocationService.js";
import geoip from "geoip-lite";

class GeoIpLocationService extends LocationService {
  constructor() {
    super();
  }

  async lookup(ip) {
    if (ip === '127.0.0.1' || ip === '::1') {
      return {
        latitude: null,
        longitude: null,
        city: null,
        country: null,
      };
    }

    const geo = geoip.lookup(ip);
    console.log("GEO :", geo);
    if (!geo) {
      return null;
    }

    return {
      latitude: geo.ll[0],
      longitude: geo.ll[1],
      city: geo.city,
      country: geo.country,
    };
  }
}

export default GeoIpLocationService;