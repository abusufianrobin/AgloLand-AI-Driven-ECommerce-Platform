import random
import json
import torch

# Assuming nltk_utils and model are in the same directory or accessible in PYTHONPATH
from model import NeuralNet
from nltk_utils import bag_of_words, tokenize

# Set device for PyTorch (GPU if available, otherwise CPU)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# --- Load Intents Data ---
try:
    with open('intents.json', 'r', encoding='utf-8') as json_data:
        intents = json.load(json_data)
except FileNotFoundError:
    print("Error: intents.json not found. Make sure it's in the same directory.")
    intents = {"intents": []} # Fallback to empty intents

# --- Load Pre-trained Model Data ---
# IMPORTANT: This assumes 'data.pth' has been created by a training script.
# If you haven't run a training script yet, this will fail.
FILE = "data.pth"
try:
    data = torch.load(FILE)

    input_size = data["input_size"]
    hidden_size = data["hidden_size"]
    output_size = data["output_size"]
    all_words = data['all_words']
    tags = data['tags']
    model_state = data["model_state"]

    # Initialize the model and load its state
    model = NeuralNet(input_size, hidden_size, output_size).to(device)
    model.load_state_dict(model_state)
    model.eval() # Set model to evaluation mode
    print("Chatbot model loaded successfully!")

except FileNotFoundError:
    print(f"Error: {FILE} not found. Please ensure the model has been trained and '{FILE}' exists.")
    print("Cannot run chatbot without a trained model.")
    model = None # Indicate that model is not available
except Exception as e:
    print(f"Error loading model from {FILE}: {e}")
    model = None


bot_name = "AgroBot" # The name of your chatbot

def get_response(msg):
    """
    Generates a response for a given user message.
    """
    if model is None:
        return "Sorry, the AI bot is not ready. Model could not be loaded."

    # Tokenize the input message
    sentence = tokenize(msg)
    # Create a bag-of-words representation of the sentence
    X = bag_of_words(sentence, all_words)
    # Reshape for model input (batch size of 1)
    X = X.reshape(1, X.shape[0])
    # Convert to PyTorch tensor and move to appropriate device (CPU/GPU)
    X = torch.from_numpy(X).to(device)

    # Get model output (logits)
    output = model(X)
    # Get the predicted tag (class with highest probability)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()] # Get the predicted intent tag

    # Calculate probabilities of all tags
    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()] # Probability of the predicted tag

    # Check if the confidence score is above a threshold
    # If confidence is low, provide a fallback response
    if prob.item() > 0.75: # Confidence threshold, adjust as needed (e.g., 0.75, 0.8)
        for intent in intents['intents']:
            if tag == intent["tag"]:
                # Return a random response from the matched intent's responses
                return random.choice(intent['responses'])
    
    # Fallback response for low confidence or unrecognized intent
    return "I'm not sure I understand your question. Could you please rephrase it or ask something related to agriculture, equipment, or our services?"

# Example usage (for testing this file directly)
if __name__ == '__main__':
    print("Start chatting with the AgroBot! (type 'quit' to exit)")
    while True:
        sentence = input("You: ")
        if sentence.lower() == "quit":
            break

        response = get_response(sentence)
        print(f"{bot_name}: {response}")
