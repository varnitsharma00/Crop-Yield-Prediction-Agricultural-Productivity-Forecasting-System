CROP_SOIL_PROFILES = {
    "wheat":  {"ph_range": (6.0, 7.5), "n_ideal": 120, "p_ideal": 60, "k_ideal": 40},
    "rice":   {"ph_range": (5.5, 6.5), "n_ideal": 100, "p_ideal": 50, "k_ideal": 50},
    "maize":  {"ph_range": (5.8, 7.0), "n_ideal": 150, "p_ideal": 70, "k_ideal": 60},
}

def suitability_score(crop: str, ph: float, n: float, p: float, k: float) -> float:
    profile = CROP_SOIL_PROFILES.get(crop)
    if not profile:
        return 0.5  # unknown crop — neutral score, don't fabricate confidence

    ph_low, ph_high = profile["ph_range"]
    ph_score = 1.0 if ph_low <= ph <= ph_high else max(0, 1 - abs(ph - (ph_low + ph_high) / 2) / 3)

    def nutrient_score(value, ideal):
        return max(0, 1 - abs(value - ideal) / ideal)

    n_score = nutrient_score(n, profile["n_ideal"])
    p_score = nutrient_score(p, profile["p_ideal"])
    k_score = nutrient_score(k, profile["k_ideal"])
    return round((ph_score + n_score + p_score + k_score) / 4, 3)