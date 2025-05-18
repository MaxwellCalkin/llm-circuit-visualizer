import React from 'react';

interface TokenExplorerProps {
  tokens: string[];
  selectedToken?: string;
  onTokenSelect: (token: string) => void;
  tokenNeuronMap?: Record<string, string[]>;
}

const TokenExplorer: React.FC<TokenExplorerProps> = ({
  tokens,
  selectedToken,
  onTokenSelect,
  tokenNeuronMap
}) => {
  return (
    <div className="p-4 bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Token Explorer</h2>
      
      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-300 mb-2">Response Tokens</h3>
        <div className="flex flex-wrap gap-2">
          {tokens.map((token, index) => (
            <button
              key={`token-${index}`}
              className={`px-3 py-1 rounded text-sm ${
                selectedToken === token
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
              onClick={() => onTokenSelect(token)}
            >
              {token}
            </button>
          ))}
        </div>
      </div>
      
      {selectedToken && tokenNeuronMap && (
        <div>
          <h3 className="text-md font-semibold text-gray-300 mb-2">
            Top Neurons for &quot;{selectedToken}&quot;
          </h3>
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-800">
                <tr>
                  <th className="px-4 py-2">Neuron ID</th>
                  <th className="px-4 py-2">Layer</th>
                  <th className="px-4 py-2">Activation</th>
                </tr>
              </thead>
              <tbody>
                {tokenNeuronMap[selectedToken]?.map((neuronId, idx) => (
                  <tr key={`neuron-${idx}`} className="border-b border-gray-700">
                    <td className="px-4 py-2">{neuronId}</td>
                    <td className="px-4 py-2">{Math.floor(Math.random() * 12) + 1}</td>
                    <td className="px-4 py-2">{(Math.random() * 0.8 + 0.2).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {selectedToken && !tokenNeuronMap && (
        <div className="text-gray-400 italic">
          No neuron data available for this token.
        </div>
      )}
    </div>
  );
};

export default TokenExplorer;
