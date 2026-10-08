import os
import httpx

WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHER_API_KEY")

    async def get_current_conditions(self, lat: float, lon: float) -> dict:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                WEATHER_URL,
                params={"lat": lat, "lon": lon, "appid": self.api_key, "units": "metric"},
            )
            resp.raise_for_status()
            data = resp.json()

        rain = data.get("rain", {})
        rainfall_mm = rain.get("1h", rain.get("3h", 0.0))

        return {
            "rainfall_mm": rainfall_mm,
            "avg_temp_c": data["main"]["temp"],
            "humidity_pct": data["main"]["humidity"],
        }