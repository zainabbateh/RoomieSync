"""Static data for RoomieSync: lifestyle factors (with weights) and sample students."""

# k = key, w = weight (all weights sum to 100), range = max possible difference,
# good / bad = messages used in the explanation.
FACTORS = [
    {"k": "sleep", "n": "Sleep schedule", "w": 15, "min": 1, "max": 5, "range": 4, "lo": "Early bird", "hi": "Night owl", "good": "Similar sleep schedule", "bad": "Different sleep schedules"},
    {"k": "clean", "n": "Cleanliness", "w": 15, "min": 1, "max": 5, "range": 4, "lo": "Relaxed", "hi": "Spotless", "good": "Similar cleanliness preference", "bad": "Different cleanliness standards"},
    {"k": "budget", "n": "Monthly budget", "w": 12, "min": 100, "max": 600, "step": 25, "range": 500, "good": "Similar budget", "bad": "Budgets are far apart"},
    {"k": "smoke", "n": "Smoking", "w": 12, "min": 0, "max": 2, "range": 2, "o": ["Non-smoker", "Outside only", "Smoker"], "good": "Same smoking habits", "bad": "Different smoking habits"},
    {"k": "study", "n": "Studying at home", "w": 8, "min": 1, "max": 5, "range": 4, "lo": "Rarely", "hi": "A lot", "good": "Compatible study habits", "bad": "Different study routines"},
    {"k": "cook", "n": "Cooking", "w": 6, "min": 1, "max": 5, "range": 4, "lo": "Never", "hi": "Daily", "good": "Similar cooking preferences", "bad": "Different cooking preferences"},
    {"k": "noise", "n": "Noise level", "w": 10, "min": 1, "max": 5, "range": 4, "lo": "Needs silence", "hi": "Loves music", "good": "Similar noise tolerance", "bad": "Different noise tolerance"},
    {"k": "share", "n": "Sharing items", "w": 6, "min": 1, "max": 5, "range": 4, "lo": "Mine is mine", "hi": "Share everything", "good": "Same attitude to sharing things", "bad": "Different views on sharing items"},
    {"k": "pets", "n": "Pets", "w": 6, "min": 0, "max": 2, "range": 2, "o": ["No pets", "Fine with pets", "Has / wants pets"], "good": "Aligned on pets", "bad": "Different views on pets"},
    {"k": "social", "n": "Social level", "w": 10, "min": 1, "max": 5, "range": 4, "lo": "Introvert", "hi": "Social butterfly", "good": "Similar social energy", "bad": "Different social energy"},
]

_RAW = [
    ("Lina", "👩", dict(sleep=2, clean=5, budget=300, smoke=0, study=5, cook=3, noise=1, share=3, pets=1, social=2)),
    ("Omar", "👨", dict(sleep=4, clean=2, budget=450, smoke=2, study=2, cook=5, noise=5, share=5, pets=2, social=5)),
    ("Sara", "👩", dict(sleep=2, clean=4, budget=320, smoke=0, study=4, cook=2, noise=2, share=3, pets=0, social=3)),
    ("Yazan", "🧑", dict(sleep=5, clean=3, budget=250, smoke=1, study=3, cook=4, noise=4, share=4, pets=1, social=4)),
    ("Maya", "👩", dict(sleep=3, clean=5, budget=400, smoke=0, study=4, cook=4, noise=2, share=2, pets=2, social=3)),
    ("Khaled", "👨", dict(sleep=1, clean=4, budget=350, smoke=0, study=5, cook=2, noise=1, share=2, pets=0, social=1)),
    ("Noor", "👩", dict(sleep=4, clean=3, budget=280, smoke=1, study=2, cook=5, noise=4, share=5, pets=1, social=5)),
    ("Tariq", "🧔", dict(sleep=3, clean=3, budget=500, smoke=2, study=3, cook=3, noise=3, share=3, pets=1, social=4)),
]
STUDENTS = [{"id": i, "name": n, "avatar": a, "profile": p} for i, (n, a, p) in enumerate(_RAW)]
