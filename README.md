# LLM Circuits Visualizer

A 3D visualization tool for exploring neuron activations in large language models, designed for mechanistic interpretability research.

## Live Demo

The application is deployed and available at: [https://uxztkcbe.manus.space](https://uxztkcbe.manus.space)

## Overview

LLM Circuits Visualizer provides an interactive 3D visualization of neuron activations within a large language model as it processes user prompts. The tool allows researchers to explore the "circuits" that activate within an LLM, visualizing neurons in 3D space and tracking their activations across different tokens.

## Features

- **3D Neuron Visualization**: View all neurons in the LLM represented in 3D space with the ability to rotate, zoom, and explore from different angles
- **Token-Neuron Relationship**: See which neurons activate for specific tokens in the LLM's response
- **Neuron Inspection**: Click on neurons to view detailed information about their activation patterns and history
- **Token Comparison**: Compare activation patterns across different tokens
- **API Integration**: Connect to OpenAI or a TransformerLens service to process real prompts
- **Mock Data Mode**: Explore the visualization capabilities with mock data when no API key is provided

## Usage Guide

### Getting Started

1. Visit the [LLM Circuits Visualizer](https://uxztkcbe.manus.space)
2. You can use the application in two modes:
   - **Mock Data Mode**: Explore the visualization with pre-generated mock data
   - **API Mode**: Enter your OpenAI API key or a TransformerLens endpoint to process real prompts

### Entering Prompts

1. Type your prompt in the input box at the top of the page
2. Click "Send" to process the prompt
3. The LLM's response will appear below the input box, with each token displayed separately

### Exploring Neuron Activations

1. **Select a Token**: Click on any token in the response to see which neurons activate for that token
2. **Explore the 3D Model**: Use your mouse to rotate, zoom, and pan around the 3D visualization
   - Left-click and drag to rotate
   - Scroll to zoom in/out
   - Right-click and drag to pan
3. **Click on Neurons**: Select individual neurons to view detailed information about them
4. **View Token Analysis**: The Token Explorer panel shows which neurons are most strongly activated by the selected token
5. **View Neuron Details**: The Neuron Inspector panel shows details about the selected neuron, including its layer, activation value, and top token activations

### Advanced Features

1. **Compare Tokens**: Click the "Compare Tokens" button to select multiple tokens and compare their activation patterns
2. **View Neuron History**: Click "Show Activation History" in the Neuron Inspector to see a neuron's activation history across different tokens
3. **Highlight Connections**: Click "Highlight Connections" to visualize the connections between the selected neuron and other neurons
4. **Filter Visualization**: Use the controls at the bottom to filter by layer or activation strength

## Technical Details

### Architecture

The LLM Circuits Visualizer is built with:

- **Next.js**: React framework for the frontend application
- **Three.js**: 3D visualization library (via React Three Fiber)
- **OpenAI API / TransformerLens Service**: For processing prompts and accessing neuron activations
- **Tailwind CSS**: For styling the user interface

### Data Flow

1. User enters a prompt
2. Prompt is sent to the selected API (OpenAI or TransformerLens)
3. The service returns the response along with neuron activation data
4. Visualization components render the neurons and their connections in 3D space
5. User interactions update the visualization to show relevant information

### Limitations

- The current implementation uses mock data for neuron activations when no API key is provided
- Accessing real activations may require specialized endpoints or model instrumentation
- The visualization is a simplified representation of the actual neural network architecture

## Future Enhancements

- Integration with more LLM providers
- More detailed circuit analysis tools
- Ability to save and share visualizations
- Comparative analysis between different models
- Time-series visualization of activation patterns

## Acknowledgements

This project was inspired by research in mechanistic interpretability, particularly work on understanding the internal representations and computational mechanisms of large language models.

## License

This project is open source and available under the MIT License.
