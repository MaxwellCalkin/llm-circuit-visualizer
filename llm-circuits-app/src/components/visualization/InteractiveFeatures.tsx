import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface NeuronHistoryModalProps {
  neuronId: string;
  historyData: Array<{
    token: string;
    activation: number;
    context?: string;
  }>;
  onClose: () => void;
}

const NeuronHistoryModal: React.FC<NeuronHistoryModalProps> = ({
  neuronId,
  historyData,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Activation History for Neuron {neuronId}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-4rem)]">
          {/* Activation chart */}
          <div className="mb-6 bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Activation Pattern</h3>
            <div className="h-48 flex items-end space-x-1">
              {historyData.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex-1 bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer relative group"
                  style={{ height: `${item.activation * 100}%` }}
                  title={`${item.token}: ${item.activation.toFixed(2)}`}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 p-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.token}: {item.activation.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>0.0</span>
              <span>Activation Value</span>
              <span>1.0</span>
            </div>
          </div>
          
          {/* Token list */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Token Activations</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-800">
                  <tr>
                    <th className="px-4 py-2">Token</th>
                    <th className="px-4 py-2">Activation</th>
                    <th className="px-4 py-2">Context</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-700">
                      <td className="px-4 py-3 font-medium">{item.token}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-700 rounded-full h-2.5 mr-2">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${item.activation * 100}%` }}
                            ></div>
                          </div>
                          <span>{item.activation.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate">{item.context || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface TokenComparisonModalProps {
  tokens: string[];
  selectedTokens: string[];
  onSelectToken: (token: string) => void;
  onClose: () => void;
  onCompare: () => void;
}

const TokenComparisonModal: React.FC<TokenComparisonModalProps> = ({
  tokens,
  selectedTokens,
  onSelectToken,
  onClose,
  onCompare
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Compare Token Activations
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-300 mb-4">
            Select up to 3 tokens to compare their neuron activations:
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {tokens.map((token, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded text-sm ${
                  selectedTokens.includes(token)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                } ${selectedTokens.length >= 3 && !selectedTokens.includes(token) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => onSelectToken(token)}
                disabled={selectedTokens.length >= 3 && !selectedTokens.includes(token)}
              >
                {token}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col gap-2 mb-6">
            <h3 className="text-md font-semibold text-gray-300">Selected Tokens:</h3>
            {selectedTokens.length > 0 ? (
              selectedTokens.map((token, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                  <span>{token}</span>
                  <button
                    onClick={() => onSelectToken(token)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No tokens selected</p>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={onCompare}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            disabled={selectedTokens.length < 2}
          >
            Compare
          </button>
        </div>
      </div>
    </div>
  );
};

interface HighlightedConnectionProps {
  sourcePosition: [number, number, number];
  targetPosition: [number, number, number];
  weight: number;
}

const HighlightedConnection: React.FC<HighlightedConnectionProps> = ({
  sourcePosition,
  targetPosition,
  weight
}) => {
  const points = [sourcePosition, targetPosition].map(point => new THREE.Vector3(...point));
  
  // Animation for highlighted connections
  const lineRef = useRef<THREE.Line>(null);
  
  useEffect(() => {
    if (!lineRef.current) return;
    
    const animate = () => {
      if (lineRef.current) {
        const material = lineRef.current.material as THREE.LineBasicMaterial;
        material.opacity = 0.5 + Math.sin(Date.now() * 0.005) * 0.5;
      }
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);
  
  return (
    <line ref={lineRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        attach="material"
        color="#00ffff"
        linewidth={weight * 5}
        opacity={0.8}
        transparent
      />
    </line>
  );
};

export { NeuronHistoryModal, TokenComparisonModal, HighlightedConnection };
