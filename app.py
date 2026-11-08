from flask import Flask, jsonify, render_template, request

from data import FACTORS, STUDENTS
from matching import clean_profile, compare

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.get("/api/config")
def config():
    """Factors (with labels) and sample students for the interface."""
    return jsonify(factors=FACTORS, students=STUDENTS)


@app.post("/api/rank")
def rank():
    """Rank every sample student against the profile sent by the user."""
    try:
        me = clean_profile((request.get_json(silent=True) or {}).get("profile"))
    except (KeyError, ValueError, TypeError):
        return jsonify(error="Invalid profile"), 400
    results = [{"id": s["id"], **compare(me, s["profile"])} for s in STUDENTS]
    results.sort(key=lambda r: r["score"], reverse=True)
    return jsonify(results=results)


@app.post("/api/compare")
def compare_two():
    """Compare two profiles."""
    data = request.get_json(silent=True) or {}
    try:
        a, b = clean_profile(data.get("a")), clean_profile(data.get("b"))
    except (KeyError, ValueError, TypeError):
        return jsonify(error="Invalid profile"), 400
    return jsonify(compare(a, b))


if __name__ == "__main__":
    app.run(debug=True)
