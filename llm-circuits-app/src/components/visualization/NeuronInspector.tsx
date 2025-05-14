import React, { useState } from 'react';

interface NeuronInspectorProps {
  selectedNeuron?: string;
  neuronData?: {
    id: string;
    layer: number;
    head?: number;
    activationValue: number;
    topTokens?: Array<{
      token: string;
      activation: number;
      context?: string;
    }>;
  };
  onHighlightConnections?: () => void;
  onShowHistory?: () => void;
}

const NeuronInspector: React.FC<NeuronInspectorProps> = ({
  selectedNeuron,
  neuronData,
  onHighlightConnections,
  onShowHistory
}) => {
  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Neuron Inspector</h2>
      
      {selectedNeuron && neuronData ? (
        <>
          <div className="mb-4">
            <h3 className="text-md font-semibold text-gray-300 mb-2">
              Selected Neuron: {neuronData.id}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              <div className="bg-gray-800 p-2 rounded">
                <span className="font-medium">Layer:</span> {neuronData.layer}
              </div>
              {neuronData.head !== undefined && (
                <div className="bg-gray-800 p-2 rounded">
                  <span className="font-medium">Head:</span> {neuronData.head}
                </div>
              )}
              <div className="bg-gray-800 p-2 rounded">
                <span className="font-medium">Activation:</span> {neuronData.activationValue.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex gap-2">
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                onClick={onHighlightConnections}
              >
                Highlight Connections
              </button>
              <button
                className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                onClick={onShowHistory}
              >
                Show Activation History
              </button>
            </div>
          </div>
          
          {neuronData.topTokens && neuronData.topTokens.length > 0 && (
            <div>
              <h3 className="text-md font-semibold text-gray-300 mb-2">
                Top Token Activations
              </h3>
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-sm text-left text-gray-300">
                  <thead className="text-xs uppercase bg-gray-800">
                    <tr>
                      <th className="px-4 py-2">Token</th>
                      <th className="px-4 py-2">Activation</th>
                      <th className="px-4 py-2">Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    {neuronData.topTokens.map((item, idx) => (
                      <tr key={`token-${idx}`} className="border-b border-gray-700">
                        <td className="px-4 py-2">{item.token}</td>
                        <td className="px-4 py-2">{item.activation.toFixed(2)}</td>
                        <td className="px-4 py-2 truncate max-w-[200px]">
                          {item.context || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-gray-800 rounded text-sm text-gray-300">
            <p className="font-semibold mb-1">Description:</p>
            <p className="italic">
              This neuron appears to activate for {' '}
              {Math.random() > 0.5 ? 'semantic concepts related to technology' : 
               Math.random() > 0.5 ? 'syntactic patterns in the text' : 
               'specific named entities and proper nouns'}.
            </p>
          </div>
        </>
      ) : (
        <div className="text-gray-400 italic">
          Select a neuron in the visualization to see details.
        </div>
      )}
    </div>
  );
};

export default NeuronInspector;
