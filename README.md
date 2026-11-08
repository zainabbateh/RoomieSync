# RoomieSync 🏠 — Smart Roommate Compatibility System

A web app that helps students find compatible roommates. Each student fills a profile (sleep, cleanliness, budget, smoking, study, cooking, noise, sharing, pets, social level) and the system computes a **Compatibility Score** with a clear explanation (✓ similarities / ⚠ differences).


## Features
- Profile form with 10 lifestyle factors
- Ranked roommate recommendations
- Compare any two students (score + factor-by-factor bars)
- Explainable results, dark/light mode, responsive design, saved profile (localStorage)

## Algorithm (no machine learning)
1. Convert answers to numbers.
2. Similarity per factor = `1 - |A - B| / range`.
3. Weighted sum (weights total 100).
4. Penalties for deal-breakers (smoker vs non-smoker x0.75, pet conflict x0.88).
5. Similarity >= 80% -> ✓, < 50% -> ⚠.
6. Sort candidates by score. Complexity: O(n x f).

## Tech
Python Flask (server), HTML5, CSS3, vanilla JavaScript.

## Run locally
`pip install -r requirements.txt` then `python app.py` and open http://127.0.0.1:5000

## Future work
Real user accounts and database, chat, learning weights from feedback, Arabic/English UI.

## Author
Zainab Bateh — Informatics, final year.
