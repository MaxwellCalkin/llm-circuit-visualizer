# Research Notes on LLM Circuits Visualization

## Key Concepts from Mechanistic Interpretability

### Features and Circuits
- **Features**: Properties of inputs or subsets of inputs that are represented in the model
  - Examples: token patterns, semantic concepts, syntactic structures
  - Features are the fundamental building blocks of models
- **Circuits**: Subsets of a model's weights and non-linearities used to map earlier features to later features
  - Circuits perform understandable computations to produce interpretable features
  - Can span across multiple layers and involve multiple neurons

### Neuron Activation Visualization
- Neurons in LLMs often represent a mixture of concepts (polysemantic)
- Visualization helps identify which neurons activate for specific inputs
- Tracking neuron activations across layers reveals computational pathways

## Visualization Approaches

### NeuronautLLM Approach
- Visual analysis system for identifying influential neurons in transformer-based LLMs
- Key components:
  1. **Prompt Input View**: Enter prompt, target token, and distractor token
  2. **Token Effect and Prediction View**: Shows effect of prompt tokens on target token
  3. **Neuron Space View**: Displays neurons that influence the model in a specific direction
  4. **Neuron Explanation View**: Detailed overview of selected neurons

### Circuit Tracing Approach
- Uses replacement models to trace computational steps
- Attribution graphs show influence of features on one another
- Visualizes how tokens from input affect neurons across layers
- Shows paths of activation from input tokens to output predictions

## Technical Considerations

### 3D Visualization
- Three.js is suitable for creating interactive 3D visualizations
- Need to represent:
  - Neurons as points/nodes in 3D space
  - Connections between neurons across layers
  - Activation strength through color/size/brightness
  - Layer structure of the model

### Interactive Features
- Ability to rotate and explore the model from different angles
- Click on specific tokens to see associated neuron activations
- Click on neurons to see activation history across different tokens
- Display statistics about circuits and specific neurons

### Data Processing
- Need to access neuron activations from OpenAI API
- Track which tokens activate which neurons
- Store neuron activation history for analysis
- Process data in real-time as the LLM generates responses

## Implementation Challenges
- Accessing internal neuron activations from OpenAI API may require special endpoints
- Visualizing potentially millions of neurons and connections in a performant way
- Creating an intuitive interface for exploring complex neural networks
- Real-time processing and visualization of activation data

## Next Steps
- Design overall website architecture
- Plan data flow from user prompt to visualization
- Create wireframes for the application
- Set up Next.js project with Three.js integration
