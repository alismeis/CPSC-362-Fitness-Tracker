from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# In-memory list to store workouts
workout_log = []

@app.route("/")
def home():
    # Render the home.html from templates folder
    return render_template("home.html")

@app.route("/workout_log")
def workout_log():
    return render_template("index.html")

@app.route("/add_workout", methods=["POST"])
def add_workout():
    data = request.json
    date = data["date"]
    workout = data["workout"]
    workout_log.append({"date": date, "workout": workout})
    return jsonify({"message": "Workout added successfully"}), 201

@app.route("/get_workouts", methods=["GET"])
def get_workouts():
    return jsonify(workout_log)

@app.route("/edit_workout", methods=["POST"])
def edit_workout():
    data = request.json
    index = data["index"]
    updated_text = data["updatedText"]

    if 0 <= index < len(workout_log):
        # Overwrite the 'workout' field with the new text
        workout_log[index]["workout"] = updated_text
        return jsonify({"message": "Workout updated successfully"}), 200
    else:
        return jsonify({"error": "Invalid index"}), 400

@app.route("/delete_workout", methods=["POST"])
def delete_workout():
    data = request.json
    index = data["index"]

    if 0 <= index < len(workout_log):
        workout_log.pop(index)
        return jsonify({"message": "Workout deleted successfully"}), 200
    else:
        return jsonify({"error": "Invalid index"}), 400

if __name__ == "__main__":
    app.run(debug=True)