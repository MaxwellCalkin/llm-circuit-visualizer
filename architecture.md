# Website Architecture for LLM Circuits Visualizer

## Overview
The LLM Circuits Visualizer will be a Next.js application that provides an interactive 3D visualization of neuron activations in large language models. The application will allow users to input prompts, view the LLM's response, and explore the neural circuits that activate during the generation process.

## Core Components

### 1. User Interface
- **Prompt Input Area**: Text box at the top of the page for user to enter prompts
- **Response Display**: Area to show the LLM's generated response
- **3D Visualization Canvas**: Main area displaying the neural network in 3D space
- **Token Explorer**: Interface to select and analyze specific tokens from the response
- **Neuron Inspector**: Panel showing details about selected neurons
- **Controls**: UI elements for rotating, zooming, and filtering the visualization

### 2. Data Flow Architecture
```
User Prompt → OpenAI API → Response + Activation Data → Visualization Renderer
                                                      ↓
                            User Interaction ← Interactive Elements
```

### 3. Backend Services
- **OpenAI API Integration**: Service to send prompts and receive responses
- **Activation Data Processor**: Module to extract and format neuron activation data
- **Data Storage**: System to store activation history for neurons

### 4. Visualization Engine
- **Three.js Renderer**: Core 3D rendering system
- **Neuron Representation System**: Logic for representing neurons in 3D space
- **Layer Organization**: Structure to organize neurons by model layers
- **Connection Visualization**: System to show connections between neurons
- **Activation Highlighting**: Logic to highlight active neurons and circuits

## Technical Stack

### Frontend
- **Framework**: Next.js
- **3D Visualization**: Three.js
- **State Management**: React Context API / Redux
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with responsive design

### Backend (API Routes in Next.js)
- **API Integration**: OpenAI API client
- **Data Processing**: Server-side processing of activation data
- **Caching**: Response and activation data caching for performance

## Page Structure
- **Home Page**: Main interface with all components
  - Header with application title and controls
  - Prompt input area
  - Response display section
  - 3D visualization canvas (main content)
  - Sidebar for token and neuron inspection

## Data Models

### Neuron Data
```typescript
interface Neuron {
  id: string;
  layer: number;
  head?: number; // For attention heads
  position: {x: number, y: number, z: number};
  connections: Connection[];
  activationHistory: ActivationRecord[];
}

interface Connection {
  sourceId: string;
  targetId: string;
  weight: number;
}

interface ActivationRecord {
  tokenId: string;
  activationValue: number;
  timestamp: number;
}
```

### Token Data
```typescript
interface Token {
  id: string;
  text: string;
  position: number; // Position in response
  associatedNeurons: NeuronActivation[];
}

interface NeuronActivation {
  neuronId: string;
  activationValue: number;
}
```

## Interactive Features

### Token Exploration
- Click on a token in the response to highlight associated neurons
- View statistics about which neurons were most active for that token
- Compare activation patterns between different tokens

### Neuron Exploration
- Click on neurons to see their activation history
- View which tokens most strongly activated a selected neuron
- Explore connections to other neurons

### Model Navigation
- Rotate the 3D model to view from different angles
- Zoom in/out to focus on specific areas
- Filter visualization by layer, activation strength, or neuron type

## Implementation Phases
1. Basic UI setup with prompt input and response display
2. Integration with OpenAI API
3. Simple 3D visualization of neurons
4. Token-neuron association implementation
5. Interactive features for token exploration
6. Neuron history and detailed statistics
7. Performance optimization
8. UI polish and responsive design

## Technical Challenges and Solutions

### Challenge: Accessing Neuron Activations
- Solution: Use OpenAI's API with special parameters to request activation data
- Alternative: Implement a simplified model of activation patterns if direct access is limited

### Challenge: Performance with Large Neural Networks
- Solution: Implement level-of-detail rendering
- Solution: Only render active neurons and their immediate connections
- Solution: Use WebGL for hardware acceleration

### Challenge: Intuitive 3D Navigation
- Solution: Implement camera controls with sensible defaults
- Solution: Add preset views (top, side, layer-by-layer)
- Solution: Include guided tours of interesting activation patterns

### Challenge: Real-time Visualization Updates
- Solution: Stream activation data as tokens are generated
- Solution: Use efficient data structures for quick updates
- Solution: Implement progressive rendering
