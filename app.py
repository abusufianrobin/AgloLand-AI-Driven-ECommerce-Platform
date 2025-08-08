from flask import Flask, request, jsonify, render_template
from flask_cors import CORS # Import CORS to allow requests from your React frontend
from chat import get_response # Import the chatbot logic

# Initialize Flask app
app = Flask(__name__)
# Enable CORS for all origins. IMPORTANT: In production, restrict this to your frontend's domain.
CORS(app)

# Route for the chatbot API endpoint
@app.route("/predict", methods=["POST"])
def predict():
    """
    Handles POST requests to the /predict endpoint.
    Expects a JSON payload with a 'message' key.
    Returns a JSON response with the chatbot's 'answer'.
    """
    # Ensure the request body is JSON
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    text = request.get_json().get("message")

    # Basic input validation
    if not text:
        return jsonify({"error": "No message provided"}), 400

    # Get response from the chatbot logic
    response = get_response(text)

    # Prepare response in JSON format
    message = {"answer": response}
    return jsonify(message)

# Optional: A simple GET route to confirm the backend is running
@app.route("/")
def index_get():
    return "AgroLand Chatbot Backend is running. Send POST requests to /predict"

if __name__ == "__main__":
    # Run the Flask app.
    # In a Colab/ngrok setup, this will be called from the Colab notebook.
    # For local development, you would run this script directly.
    app.run(debug=True) # debug=True is good for local development, turn off for production
