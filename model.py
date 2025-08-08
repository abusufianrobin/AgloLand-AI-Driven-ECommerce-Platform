import torch
import torch.nn as nn

class NeuralNet(nn.Module):
    """
    A simple Feedforward Neural Network for chatbot intent classification.
    It consists of three fully connected layers with ReLU activations.
    """
    def __init__(self, input_size, hidden_size, num_classes):
        super(NeuralNet, self).__init__()
        self.l1 = nn.Linear(input_size, hidden_size)  # First linear layer
        self.l2 = nn.Linear(hidden_size, hidden_size) # Second linear layer
        self.l3 = nn.Linear(hidden_size, num_classes) # Output linear layer
        self.relu = nn.ReLU() # ReLU activation function

    def forward(self, x):
        """
        Defines the forward pass of the network.
        """
        out = self.l1(x)
        out = self.relu(out) # Apply ReLU after first layer
        out = self.l2(out)
        out = self.relu(out) # Apply ReLU after second layer
        out = self.l3(out)
        # No activation function (like softmax) or sigmoid here,
        # as CrossEntropyLoss in PyTorch typically expects raw logits.
        return out

# Example usage (for testing this file directly)
if __name__ == '__main__':
    # Example dimensions
    input_size = 100
    hidden_size = 50
    num_classes = 10

    # Create an instance of the model
    model = NeuralNet(input_size, hidden_size, num_classes)
    print(model)

    # Create a dummy input tensor
    dummy_input = torch.randn(1, input_size) # Batch size of 1

    # Pass the dummy input through the model
    output = model(dummy_input)
    print("Output shape:", output.shape)
