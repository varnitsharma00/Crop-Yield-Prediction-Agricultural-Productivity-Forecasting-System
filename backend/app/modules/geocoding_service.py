import os
import httpx

_CACHE: dict[str, tuple[float, float]] = {}

GEOCODE_URL = "http://api.openweathermap.org/geo/1.0/direct"

async def get_coordinates(region: str, country_code: str = "IN") -> tuple[float, float]:
    """
    Resolves a 'District, State' string to (lat, lon) using OpenWeatherMap Geocoding.
    Raises ValueError if the location can't be found.
    """
    if region in _CACHE:
        return _CACHE[region]

    api_key = os.getenv("OPENWEATHER_API_KEY")
    query = f"{region},{country_code}"

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            GEOCODE_URL,
            params={"q": query, "limit": 1, "appid": api_key},
        )
        resp.raise_for_status()
        results = resp.json()

    if not results:
        raise ValueError(f"Could not find coordinates for region: '{region}'")

    lat, lon = results[0]["lat"], results[0]["lon"]
    _CACHE[region] = (lat, lon)
    return (lat, lon)