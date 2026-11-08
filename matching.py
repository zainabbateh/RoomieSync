"""RoomieSync matching algorithm (no machine learning).

1. similarity per factor = 1 - |A - B| / range      (0 = opposite, 1 = identical)
2. score = weighted sum of similarities (weights total 100)
3. penalties for deal-breakers (smoker vs non-smoker, pet conflict)
4. explanation: similarity >= 0.8 -> good, < 0.5 -> bad, otherwise mixed
"""
from data import FACTORS


def similarity(factor, a, b):
    return max(0.0, 1 - abs(a - b) / factor["range"])


def clean_profile(raw):
    """Validate a profile coming from the browser and clamp every value to its range."""
    if not isinstance(raw, dict):
        raise ValueError("profile must be an object")
    profile = {}
    for f in FACTORS:
        value = float(raw[f["k"]])
        profile[f["k"]] = min(f["max"], max(f["min"], value))
    return profile


def compare(a, b):
    total, good, mid, bad, deals, factors = 0.0, [], [], [], [], []
    for f in FACTORS:
        s = similarity(f, a[f["k"]], b[f["k"]])
        total += s * f["w"]
        factors.append({"k": f["k"], "sim": round(s * 100)})
        if f["k"] == "noise" and a["noise"] <= 2 and b["noise"] <= 2:
            good.append("Both prefer a quiet environment")
        elif s >= 0.8:
            good.append(f["good"])
        elif s < 0.5:
            bad.append(f["bad"])
        else:
            mid.append("Somewhat different: " + f["n"].lower())
    if abs(a["smoke"] - b["smoke"]) == 2:
        total *= 0.75
        deals.append("Deal-breaker risk: smoker vs non-smoker")
    if abs(a["pets"] - b["pets"]) == 2:
        total *= 0.88
        deals.append("Pet conflict: one has pets, the other prefers none")
    return {"score": round(total), "good": good, "mid": mid, "bad": bad, "deals": deals, "factors": factors}
