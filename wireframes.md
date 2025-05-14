# LLM Circuits Visualizer - Wireframes

## Main Interface Layout

```
+-------------------------------------------------------+
|                  LLM Circuits Visualizer              |
+-------------------------------------------------------+
| [Prompt Input Box                            ] [Send] |
+-------------------------------------------------------+
|                                                       |
| Response:                                             |
| [Token 1] [Token 2] [Token 3] [Token 4] ...           |
|                                                       |
+-------------------------------------------------------+
|                                                       |
|                                                       |
|                                                       |
|                                                       |
|                  3D Visualization Area                |
|                                                       |
|                                                       |
|                                                       |
|                                                       |
+---------------------------+---------------------------+
|                           |                           |
|  Token Analysis           |  Neuron Inspector         |
|  - Selected: [Token X]    |  - Selected: [Neuron ID]  |
|  - Top Neurons:           |  - Layer: X, Head: Y      |
|    * Neuron A (0.85)      |  - Activation: 0.XX       |
|    * Neuron B (0.72)      |  - Top Tokens:            |
|    * Neuron C (0.64)      |    * Token A (0.85)       |
|                           |    * Token B (0.72)       |
+---------------------------+---------------------------+
|  Visualization Controls                               |
|  [Rotate] [Zoom] [Reset] [Layers ▼] [Filter ▼]        |
+-------------------------------------------------------+
```

## 3D Visualization Concept

```
    Layer 1       Layer 2       Layer 3       Output
    
    O O O         O O O         O O O         
    O O O    →    O O O    →    O O O    →    [Tokens]
    O O O         O O O         O O O         
    
    ↑             ↑             ↑
    Input        Hidden        Hidden
    Embeddings   Layer 1       Layer 2
```

- Neurons represented as spheres
- Connections shown as lines between neurons
- Active neurons highlighted with brighter colors
- Size of neuron indicates activation strength
- Layers arranged in 3D space
- Camera controls allow rotation and zoom

## Token Explorer Detail

```
+-------------------------------------------------------+
| Token Explorer                                        |
+-------------------------------------------------------+
| Selected Token: "artificial"                          |
|                                                       |
| Position: 7 in response                               |
| Context: "...advanced artificial intelligence..."     |
|                                                       |
| Neuron Activations:                                   |
| +---------------------------------------------+       |
| | Neuron ID | Layer | Head | Activation Value |       |
| |-----------|-------|------|------------------|       |
| | N1842     | 8     | 3    | 0.87             |       |
| | N2451     | 11    | 2    | 0.76             |       |
| | N0472     | 4     | 7    | 0.65             |       |
| | ...       | ...   | ...  | ...              |       |
| +---------------------------------------------+       |
|                                                       |
| [View in 3D] [Compare with other tokens]              |
+-------------------------------------------------------+
```

## Neuron Inspector Detail

```
+-------------------------------------------------------+
| Neuron Inspector                                      |
+-------------------------------------------------------+
| Selected Neuron: N1842                                |
|                                                       |
| Layer: 8  Head: 3  Position: (x,y,z)                  |
|                                                       |
| Description: This neuron appears to activate for      |
| technology-related concepts and terminology.          |
|                                                       |
| Top Token Activations:                                |
| +---------------------------------------------+       |
| | Token      | Activation | Context           |       |
| |------------|------------|-------------------|       |
| | artificial | 0.87       | "...advanced art..|       |
| | technology | 0.82       | "...new technol...|       |
| | computer   | 0.79       | "...modern compu..|       |
| | ...        | ...        | ...               |       |
| +---------------------------------------------+       |
|                                                       |
| [Highlight Connections] [Show Activation History]     |
+-------------------------------------------------------+
```

## Mobile Layout Adaptation

```
+---------------------------+
| LLM Circuits Visualizer   |
+---------------------------+
| [Prompt Input      ][Send]|
+---------------------------+
| Response:                 |
| [Token 1] [Token 2] ...   |
+---------------------------+
|                           |
|                           |
|    3D Visualization       |
|         Area              |
|                           |
|                           |
+---------------------------+
| [Tabs: Tokens | Neurons | Controls] |
+---------------------------+
| Tab Content               |
| (Selected tab details)    |
|                           |
|                           |
+---------------------------+
```
