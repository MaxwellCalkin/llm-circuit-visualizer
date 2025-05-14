'use client';

import React, { useState, useEffect } from 'react';
import { NeuronHistoryModal, TokenComparisonModal } from '@/components/visualization/InteractiveFeatures';
import NeuronModel from '@/components/visualization/NeuronModel';
import TokenExplorer from '@/components/visualization/TokenExplorer';
import NeuronInspector from '@/components/visualization/NeuronInspector';
import { initializeOpenAIClient, getOpenAIClient } from '@/lib/openai';
import { useOpenAI } from '@/hooks/useOpenAI';

// Enhanced version of the page component with interactive features
export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isApiKeySet, setIsApiKeySet] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [client, setClient] = useState<any>(null);
  
  // Modal states
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);
  const [tokensForComparison, setTokensForComparison] = useState<string[]>([]);
  
  // Initialize OpenAI client when API key is set
  useEffect(() => {
    if (apiKey && !isApiKeySet) {
      try {
        const client = initializeOpenAIClient(apiKey);
        setClient(client);
        setIsApiKeySet(true);
      } catch (error) {
        console.error('Error initializing OpenAI client:', error);
      }
    }
  }, [apiKey, isApiKeySet]);
  
  // Use mock data when no API key is provided
  const useMockData = !isApiKeySet;
  
  // Initialize OpenAI hook
  const {
    isLoading,
    error,
    response,
    tokens: apiTokens,
    neurons: apiNeurons,
    connections: apiConnections,
    selectedToken,
    selectedNeuron,
    neuronHistory,
    processPrompt,
    selectToken,
    selectNeuron
  } = client ? useOpenAI(client) : {
    isLoading: false,
    error: null,
    response: null,
    tokens: [],
    neurons: [],
    connections: [],
    selectedToken: null,
    selectedNeuron: null,
    neuronHistory: [],
    processPrompt: async () => {},
    selectToken: () => {},
    selectNeuron: async () => {}
  };
  
  // Mock data for development when no API key is provided
  const mockTokens = [
    'The', 'large', 'language', 'model', 'processed', 'the', 'input', 
    'and', 'generated', 'a', 'response', 'based', 'on', 'its', 
    'training', 'data', 'and', 'parameters'
  ];
  
  // Generate mock neurons
  const generateMockNeurons = (layerCount: number, neuronsPerLayer: number) => {
    const neurons = [];
    
    for (let layer = 1; layer <= layerCount; layer++) {
      for (let i = 0; i < neuronsPerLayer; i++) {
        // Calculate position in 3D space
        // Arrange neurons in a cylinder shape for each layer
        const angle = (i / neuronsPerLayer) * Math.PI * 2;
        const radius = 3;
        const x = (layer - (layerCount + 1) / 2) * 5; // Space layers along x-axis
        const y = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        // Random activation value for demonstration
        const activationValue = Math.random();
        
        neurons.push({
          id: `n-${layer}-${i}`,
          layer,
          head: layer % 2 === 0 ? Math.floor(i / (neuronsPerLayer / 4)) : undefined,
          position: [x, y, z] as [number, number, number],
          activationValue
        });
      }
    }
    
    return neurons;
  };
  
  // Generate mock connections
  const generateMockConnections = (neurons: any[], connectionDensity: number) => {
    const connections = [];
    const neuronsByLayer = new Map<number, any[]>();
    
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
            sourceId: sourceNeuron.id,
            targetId: targetNeuron.id,
            weight: Math.random()
          });
        }
      });
    }
    
    return connections;
  };
  
  // Mock token-neuron associations
  const generateMockTokenNeuronMap = (tokens: string[], neurons: any[]) => {
    const tokenNeuronMap: Record<string, string[]> = {};
    
    tokens.forEach(token => {
      // Assign 5-10 random neurons to each token
      const neuronCount = Math.floor(Math.random() * 6) + 5;
      const tokenNeurons = [];
      
      for (let i = 0; i < neuronCount; i++) {
        const randomIndex = Math.floor(Math.random() * neurons.length);
        tokenNeurons.push(neurons[randomIndex].id);
      }
      
      tokenNeuronMap[token] = tokenNeurons;
    });
    
    return tokenNeuronMap;
  };
  
  // Mock neuron data for inspector
  const getMockNeuronData = (neuronId: string, neurons: any[]) => {
    const neuron = neurons.find(n => n.id === neuronId);
    
    if (!neuron) return null;
    
    // Generate random top tokens
    const topTokenCount = Math.floor(Math.random() * 5) + 3;
    const topTokens = [];
    
    const availableTokens = [...mockTokens];
    
    for (let i = 0; i < topTokenCount; i++) {
      const tokenIndex = Math.floor(Math.random() * availableTokens.length);
      const token = availableTokens.splice(tokenIndex, 1)[0];
      
      topTokens.push({
        token,
        activation: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
        context: `...text containing ${token}...`
      });
    }
    
    // Sort by activation value
    topTokens.sort((a, b) => b.activation - a.activation);
    
    return {
      id: neuronId,
      layer: neuron.layer,
      head: neuron.head,
      activationValue: neuron.activationValue,
      topTokens
    };
  };
  
  // Generate mock data
  const mockNeurons = generateMockNeurons(8, 20); // 8 layers, 20 neurons per layer
  const mockConnections = generateMockConnections(mockNeurons, 0.2); // 20% connection density
  const mockTokenNeuronMap = generateMockTokenNeuronMap(mockTokens, mockNeurons);
  
  // Use either API data or mock data
  const displayTokens = useMockData ? mockTokens : apiTokens.map(t => t.token);
  const displayNeurons = useMockData ? mockNeurons : apiNeurons.map(n => ({
    id: n.neuronId,
    layer: n.layer,
    head: n.head,
    position: [
      (n.layer - 4.5) * 5, // Position along x-axis based on layer
      Math.sin((n.neuronId.charCodeAt(0) / 255) * Math.PI * 2) * 3, // y position
      Math.cos((n.neuronId.charCodeAt(0) / 255) * Math.PI * 2) * 3  // z position
    ] as [number, number, number],
    activationValue: n.activationValue
  }));
  const displayConnections = useMockData ? mockConnections : apiConnections;
  
  // Local state for UI
  const [localSelectedToken, setLocalSelectedToken] = useState<string | undefined>(undefined);
  const [localSelectedNeuron, setLocalSelectedNeuron] = useState<string | undefined>(undefined);
  const [neuronData, setNeuronData] = useState<any | undefined>(undefined);
  
  // Mock neuron history data
  const mockNeuronHistory = [
    { token: 'language', activation: 0.92, context: '...large language model...' },
    { token: 'model', activation: 0.87, context: '...language model processed...' },
    { token: 'neural', activation: 0.76, context: '...neural network architecture...' },
    { token: 'artificial', activation: 0.71, context: '...artificial intelligence...' },
    { token: 'learning', activation: 0.68, context: '...machine learning algorithms...' },
    { token: 'data', activation: 0.65, context: '...training data and parameters...' },
    { token: 'network', activation: 0.62, context: '...neural network design...' },
    { token: 'intelligence', activation: 0.58, context: '...artificial intelligence systems...' },
  ];
  
  // Handle token selection
  const handleTokenSelect = (token: string) => {
    setLocalSelectedToken(token);
    setLocalSelectedNeuron(undefined);
    setNeuronData(undefined);
    
    if (!useMockData) {
      selectToken(token);
    }
  };
  
  // Handle neuron selection
  const handleNeuronClick = (neuronId: string) => {
    setLocalSelectedNeuron(neuronId);
    
    if (useMockData) {
      setNeuronData(getMockNeuronData(neuronId, mockNeurons));
    } else {
      selectNeuron(neuronId).then(() => {
        // neuronHistory will be updated by the hook
        const neuron = apiNeurons.find(n => n.neuronId === neuronId);
        if (neuron) {
          setNeuronData({
            id: neuronId,
            layer: neuron.layer,
            head: neuron.head,
            activationValue: neuron.activationValue,
            topTokens: neuronHistory
          });
        }
      });
    }
  };
  
  // Handle highlight connections
  const handleHighlightConnections = () => {
    console.log('Highlighting connections for neuron:', localSelectedNeuron);
    // In a real implementation, this would update the visualization
  };
  
  // Handle show history
  const handleShowHistory = () => {
    setShowHistoryModal(true);
  };
  
  // Handle token comparison
  const handleComparisonTokenSelect = (token: string) => {
    setTokensForComparison(prev => {
      if (prev.includes(token)) {
        return prev.filter(t => t !== token);
      } else if (prev.length < 3) {
        return [...prev, token];
      }
      return prev;
    });
  };
  
  const handleCompareTokens = () => {
    console.log('Comparing tokens:', tokensForComparison);
    setShowComparisonModal(false);
    // In a real implementation, this would update the visualization to show comparison
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!useMockData && prompt) {
      await processPrompt(prompt);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">LLM Circuits Visualizer</h1>
        
        {/* API Key input */}
        {!isApiKeySet && (
          <div className="mb-8">
            <div className="flex">
              <input
                type="password"
                placeholder="Enter your OpenAI API key..."
                className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-l text-white"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-r"
                onClick={() => setIsApiKeySet(true)}
              >
                Set Key
              </button>
            </div>
            <p className="text-gray-400 mt-2 text-sm">
              {useMockData ? 'Using mock data for demonstration. Enter your API key for real data.' : ''}
            </p>
          </div>
        )}
        
        {/* Prompt input */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex">
            <input
              type="text"
              placeholder="Enter your prompt here..."
              className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded-l text-white"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-r"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Send'}
            </button>
          </div>
        </form>
        
        {/* Error message */}
        {error && (
          <div className="mb-8 p-4 bg-red-900 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Error:</h2>
            <p>{error}</p>
          </div>
        )}
        
        {/* Response display */}
        <div className="mb-8 p-4 bg-gray-900 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Response:</h2>
            <button
              onClick={() => setShowComparisonModal(true)}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
            >
              Compare Tokens
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {displayTokens.map((token, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded cursor-pointer ${
                  localSelectedToken === token
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => handleTokenSelect(token)}
              >
                {token}
              </span>
            ))}
          </div>
        </div>
        
        {/* Main visualization */}
        <div className="mb-8">
          <NeuronModel
            neurons={displayNeurons}
            connections={displayConnections}
            selectedToken={localSelectedToken}
            selectedNeuron={localSelectedNeuron}
            onNeuronClick={handleNeuronClick}
          />
        </div>
        
        {/* Bottom panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TokenExplorer
            tokens={displayTokens}
            selectedToken={localSelectedToken}
            onTokenSelect={handleTokenSelect}
            tokenNeuronMap={useMockData ? mockTokenNeuronMap : undefined}
          />
          
          <NeuronInspector
            selectedNeuron={localSelectedNeuron}
            neuronData={neuronData}
            onHighlightConnections={handleHighlightConnections}
            onShowHistory={handleShowHistory}
          />
        </div>
        
        {/* Controls */}
        <div className="mt-8 p-4 bg-gray-900 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Visualization Controls</h2>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded">
              Reset View
            </button>
            <select className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded">
              <option>All Layers</option>
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i} value={i + 1}>Layer {i + 1}</option>
              ))}
            </select>
            <select className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded">
              <option>All Activations</option>
              <option>High Activations</option>
              <option>Medium Activations</option>
              <option>Low Activations</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Neuron History Modal */}
      {showHistoryModal && localSelectedNeuron && (
        <NeuronHistoryModal
          neuronId={localSelectedNeuron}
          historyData={useMockData ? mockNeuronHistory : neuronHistory}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
      
      {/* Token Comparison Modal */}
      {showComparisonModal && (
        <TokenComparisonModal
          tokens={displayTokens}
          selectedTokens={tokensForComparison}
          onSelectToken={handleComparisonTokenSelect}
          onClose={() => setShowComparisonModal(false)}
          onCompare={handleCompareTokens}
        />
      )}
    </main>
  );
}
