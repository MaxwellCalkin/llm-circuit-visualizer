import { type LLMClient, TokenData, NeuronActivation, ConnectionData } from './openai';

export class TransformerLensClient implements LLMClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  async processPrompt(prompt: string): Promise<{
    response: string;
    tokens: TokenData[];
    neurons: NeuronActivation[];
    connections: ConnectionData[];
  }> {
    const res = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {})
      },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
      throw new Error(`TransformerLens API error: ${res.statusText}`);
    }

    return (await res.json()) as {
      response: string;
      tokens: TokenData[];
      neurons: NeuronActivation[];
      connections: ConnectionData[];
    };
  }

  async getNeuronHistory(neuronId: string): Promise<Array<{ token: string; activation: number; context?: string }>> {
    const res = await fetch(`${this.baseUrl}/neuron/${encodeURIComponent(neuronId)}/history`, {
      headers: {
        ...(this.apiKey ? { Authorization: `Bearer ${this.apiKey}` } : {})
      }
    });

    if (!res.ok) {
      throw new Error(`TransformerLens API error: ${res.statusText}`);
    }

    return (await res.json()) as Array<{ token: string; activation: number; context?: string }>;
  }
}

let tlensClient: TransformerLensClient | null = null;

export function initializeTransformerLensClient(baseUrl: string, apiKey?: string): TransformerLensClient {
  tlensClient = new TransformerLensClient(baseUrl, apiKey);
  return tlensClient;
}

export function getTransformerLensClient(): TransformerLensClient {
  if (!tlensClient) {
    throw new Error('TransformerLens client not initialized.');
  }
  return tlensClient;
}
