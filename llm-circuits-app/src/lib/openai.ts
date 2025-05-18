import { OpenAI } from 'openai';

// Define the interface for neuron activation data
export interface NeuronActivation {
  neuronId: string;
  layer: number;
  head?: number;
  activationValue: number;
}

// Define the interface for token data with associated neurons
export interface TokenData {
  token: string;
  position: number;
  associatedNeurons: NeuronActivation[];
}

// Define the interface for connection data
export interface ConnectionData {
  sourceId: string;
  targetId: string;
  weight: number;
}

// Generic interface for any LLM service client
export interface LLMClient {
  processPrompt(prompt: string): Promise<{
    response: string;
    tokens: TokenData[];
    neurons: NeuronActivation[];
    connections: ConnectionData[];
  }>;
  getNeuronHistory(neuronId: string): Promise<{
    token: string;
    activation: number;
    context?: string;
  }[]>;
}

// Main OpenAI API client class
export class OpenAIClient implements LLMClient {
  private client: OpenAI;
  
  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // Added to allow browser-side usage
    });
  }
  
  /**
   * Process a prompt and get the LLM response along with neuron activation data
   * 
   * Note: This is a simplified implementation. In reality, accessing neuron
   * activations would require special API endpoints or model instrumentation.
   */
  async processPrompt(prompt: string): Promise<{
    response: string;
    tokens: TokenData[];
    neurons: NeuronActivation[];
    connections: ConnectionData[];
  }> {
    try {
      // Call the OpenAI API to get a response
      const completion = await this.client.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 150,
      });
      
      // Extract the response text
      const responseText = completion.choices[0]?.message?.content || "";
      
      // In a real implementation, we would get neuron activation data from the API
      // For now, we'll generate mock data based on the response
      
      // Split the response into tokens (this is a simplification)
      const tokenStrings = responseText.split(/\s+/).filter(t => t.length > 0);
      
      // Generate mock neurons (in a real implementation, this would come from the API)
      const neurons: NeuronActivation[] = this.generateMockNeurons(12, 24); // 12 layers, 24 neurons per layer
      
      // Generate mock connections
      const connections: ConnectionData[] = this.generateMockConnections(neurons, 0.15);
      
      // Generate mock token data with associated neurons
      const tokens: TokenData[] = tokenStrings.map((token, index) => {
        return {
          token,
          position: index,
          associatedNeurons: this.getRandomNeurons(neurons, 5 + Math.floor(Math.random() * 5))
        };
      });
      
      return {
        response: responseText,
        tokens,
        neurons,
        connections
      };
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  }
  
  /**
   * Get the activation history for a specific neuron
   * This would be implemented with real data in a production system
   */
  async getNeuronHistory(neuronId: string): Promise<{
    token: string;
    activation: number;
    context?: string;
  }[]> {
    // In a real implementation, this would query a database of past activations
    // For now, return mock data
    const historyLength = 5 + Math.floor(Math.random() * 5);
    const mockHistory = [];
    
    const sampleTokens = [
      "the", "of", "and", "to", "in", "is", "that", "for", "it", "with",
      "as", "was", "on", "be", "at", "by", "this", "have", "from", "or",
      "artificial", "intelligence", "neural", "network", "language", "model",
      "computer", "science", "data", "learning", "algorithm"
    ];
    
    for (let i = 0; i < historyLength; i++) {
      const token = sampleTokens[Math.floor(Math.random() * sampleTokens.length)];
      mockHistory.push({
        token,
        activation: 0.5 + Math.random() * 0.5, // 0.5 to 1.0
        context: `Neuron ${neuronId} ...text containing ${token}...`
      });
    }
    
    // Sort by activation value
    return mockHistory.sort((a, b) => b.activation - a.activation);
  }
  
  // Helper method to generate mock neurons
  private generateMockNeurons(layerCount: number, neuronsPerLayer: number): NeuronActivation[] {
    const neurons: NeuronActivation[] = [];
    
    for (let layer = 1; layer <= layerCount; layer++) {
      for (let i = 0; i < neuronsPerLayer; i++) {
        neurons.push({
          neuronId: `n-${layer}-${i}`,
          layer,
          head: layer % 2 === 0 ? Math.floor(i / (neuronsPerLayer / 4)) : undefined,
          activationValue: Math.random()
        });
      }
    }
    
    return neurons;
  }
  
  // Helper method to generate mock connections
  private generateMockConnections(neurons: NeuronActivation[], connectionDensity: number): ConnectionData[] {
    const connections: ConnectionData[] = [];
    const neuronsByLayer = new Map<number, NeuronActivation[]>();
    
    // Group neurons by layer
    neurons.forEach(neuron => {
      if (!neuronsByLayer.has(neuron.layer)) {
        neuronsByLayer.set(neuron.layer, []);
      }
      neuronsByLayer.get(neuron.layer)!.push(neuron);
    });
    
    // Create connections between adjacent layers
    const layers = Array.from(neuronsByLayer.keys()).sort((a, b) => a - b);
    
    for (let i = 0; i < layers.length - 1; i++) {
      const sourceLayer = layers[i];
      const targetLayer = layers[i + 1];
      
      const sourceNeurons = neuronsByLayer.get(sourceLayer)!;
      const targetNeurons = neuronsByLayer.get(targetLayer)!;
      
      sourceNeurons.forEach(sourceNeuron => {
        // Connect to a random subset of neurons in the next layer
        const connectionCount = Math.floor(targetNeurons.length * connectionDensity);
        
        for (let j = 0; j < connectionCount; j++) {
          const targetIndex = Math.floor(Math.random() * targetNeurons.length);
          const targetNeuron = targetNeurons[targetIndex];
          
          connections.push({
            sourceId: sourceNeuron.neuronId,
            targetId: targetNeuron.neuronId,
            weight: Math.random()
          });
        }
      });
    }
    
    return connections;
  }
  
  // Helper method to get random neurons
  private getRandomNeurons(neurons: NeuronActivation[], count: number): NeuronActivation[] {
    const shuffled = [...neurons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(neuron => ({
      ...neuron,
      activationValue: 0.5 + Math.random() * 0.5 // Higher activation for associated neurons
    }));
  }
}

// Create and export a singleton instance
let openAIClient: OpenAIClient | null = null;

export function initializeOpenAIClient(apiKey: string): OpenAIClient {
  openAIClient = new OpenAIClient(apiKey);
  return openAIClient;
}

export function getOpenAIClient(): OpenAIClient {
  if (!openAIClient) {
    throw new Error("OpenAI client not initialized. Call initializeOpenAIClient first.");
  }
  return openAIClient;
}
