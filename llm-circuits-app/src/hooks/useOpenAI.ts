import { useState } from 'react';
import { type LLMClient, TokenData, NeuronActivation, ConnectionData } from '@/lib/openai';

// Define the interface for the hook return value
interface UseOpenAIReturn {
  isLoading: boolean;
  error: string | null;
  response: string | null;
  tokens: TokenData[];
  neurons: NeuronActivation[];
  connections: ConnectionData[];
  selectedToken: string | null;
  selectedNeuron: string | null;
  neuronHistory: Array<{ token: string; activation: number; context?: string }>;
  processPrompt: (prompt: string) => Promise<void>;
  selectToken: (token: string) => void;
  selectNeuron: (neuronId: string) => Promise<void>;
}

// Custom hook for LLM service integration
export function useOpenAI(client: LLMClient | null): UseOpenAIReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [neurons, setNeurons] = useState<NeuronActivation[]>([]);
  const [connections, setConnections] = useState<ConnectionData[]>([]);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [selectedNeuron, setSelectedNeuron] = useState<string | null>(null);
  const [neuronHistory, setNeuronHistory] = useState<Array<{ token: string; activation: number; context?: string }>>([]);

  // Process a prompt and get the response with neuron activations
  const processPrompt = async (prompt: string) => {
    if (!client) {
      setError('LLM client not initialized');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setTokens([]);
    setNeurons([]);
    setConnections([]);
    setSelectedToken(null);
    setSelectedNeuron(null);
    setNeuronHistory([]);

    try {
      const result = await client.processPrompt(prompt);
      
      setResponse(result.response);
      setTokens(result.tokens);
      setNeurons(result.neurons);
      setConnections(result.connections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Select a token to highlight associated neurons
  const selectToken = (token: string) => {
    setSelectedToken(token);
    setSelectedNeuron(null);
    setNeuronHistory([]);
  };

  // Select a neuron to view its details and history
  const selectNeuron = async (neuronId: string) => {
    setSelectedNeuron(neuronId);

    if (!client) {
      return;
    }

    try {
      const history = await client.getNeuronHistory(neuronId);
      setNeuronHistory(history);
    } catch (err) {
      console.error('Error fetching neuron history:', err);
      setNeuronHistory([]);
    }
  };

  return {
    isLoading,
    error,
    response,
    tokens,
    neurons,
    connections,
    selectedToken,
    selectedNeuron,
    neuronHistory,
    processPrompt,
    selectToken,
    selectNeuron
  };
}
