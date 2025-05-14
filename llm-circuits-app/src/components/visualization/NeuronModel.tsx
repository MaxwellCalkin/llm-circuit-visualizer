import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

// Types for our neuron data
interface Neuron {
  id: string;
  layer: number;
  head?: number;
  position: [number, number, number];
  activationValue: number;
}

interface Connection {
  sourceId: string;
  targetId: string;
  weight: number;
}

interface NeuronModelProps {
  neurons: Neuron[];
  connections: Connection[];
  selectedToken?: string;
  selectedNeuron?: string;
  onNeuronClick?: (neuronId: string) => void;
}

// Individual neuron component
const NeuronNode: React.FC<{
  neuron: Neuron;
  isSelected: boolean;
  onClick: () => void;
}> = ({ neuron, isSelected, onClick }) => {
  // Scale neuron size based on activation value (min 0.1, max 0.5)
  const size = 0.1 + Math.min(neuron.activationValue, 1) * 0.4;
  
  // Color based on activation (blue to red gradient)
  const color = new THREE.Color().setHSL(
    (1 - Math.min(neuron.activationValue, 1)) * 0.6, // Hue: 0.6 (blue) to 0 (red)
    0.8, // Saturation
    0.5  // Lightness
  );

  return (
    <group position={neuron.position}>
      <Sphere 
        args={[size, 16, 16]} 
        onClick={onClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      {isSelected && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap'
          }}>
            ID: {neuron.id}<br />
            Layer: {neuron.layer}{neuron.head !== undefined ? `, Head: ${neuron.head}` : ''}<br />
            Activation: {neuron.activationValue.toFixed(2)}
          </div>
        </Html>
      )}
    </group>
  );
};

// Connection between neurons
const NeuronConnection: React.FC<{
  start: [number, number, number];
  end: [number, number, number];
  weight: number;
  isActive: boolean;
}> = ({ start, end, weight, isActive }) => {
  const points = [start, end].map(point => new THREE.Vector3(...point));
  
  // Thicker lines for stronger connections
  const lineWidth = Math.max(0.5, Math.min(weight * 3, 3));
  
  // More opacity for active connections
  const opacity = isActive ? 0.8 : 0.1;
  
  return (
    <Line
      points={points}
      color="#ffffff"
      lineWidth={lineWidth}
      opacity={opacity}
      transparent
    />
  );
};

// Layer label component
const LayerLabel: React.FC<{
  layer: number;
  position: [number, number, number];
}> = ({ layer, position }) => {
  return (
    <Text
      position={position}
      color="white"
      fontSize={0.5}
      anchorX="center"
      anchorY="middle"
    >
      {layer === 0 ? 'Input' : layer === -1 ? 'Output' : `Layer ${layer}`}
    </Text>
  );
};

// Main 3D scene component
const NeuronScene: React.FC<NeuronModelProps> = ({ 
  neurons, 
  connections, 
  selectedToken, 
  selectedNeuron,
  onNeuronClick 
}) => {
  const [hoveredNeuron, setHoveredNeuron] = useState<string | null>(null);
  
  // Group neurons by layer for positioning
  const layerMap = new Map<number, Neuron[]>();
  neurons.forEach(neuron => {
    if (!layerMap.has(neuron.layer)) {
      layerMap.set(neuron.layer, []);
    }
    layerMap.get(neuron.layer)!.push(neuron);
  });
  
  // Sort layers for display
  const sortedLayers = Array.from(layerMap.keys()).sort((a, b) => a - b);
  
  // Create a map for quick neuron lookup
  const neuronMap = new Map<string, Neuron>();
  neurons.forEach(neuron => {
    neuronMap.set(neuron.id, neuron);
  });
  
  // Slowly rotate the model
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Render layer labels */}
      {sortedLayers.map(layer => {
        const xPos = (layer - (sortedLayers.length - 1) / 2) * 5;
        return (
          <LayerLabel 
            key={`layer-${layer}`} 
            layer={layer} 
            position={[xPos, 5, 0]} 
          />
        );
      })}
      
      {/* Render connections */}
      {connections.map((connection, idx) => {
        const sourceNeuron = neuronMap.get(connection.sourceId);
        const targetNeuron = neuronMap.get(connection.targetId);
        
        if (!sourceNeuron || !targetNeuron) return null;
        
        const isActive = 
          (selectedNeuron === connection.sourceId || selectedNeuron === connection.targetId);
        
        return (
          <NeuronConnection
            key={`connection-${idx}`}
            start={sourceNeuron.position}
            end={targetNeuron.position}
            weight={connection.weight}
            isActive={isActive}
          />
        );
      })}
      
      {/* Render neurons */}
      {neurons.map(neuron => (
        <NeuronNode
          key={neuron.id}
          neuron={neuron}
          isSelected={neuron.id === selectedNeuron || neuron.id === hoveredNeuron}
          onClick={() => onNeuronClick && onNeuronClick(neuron.id)}
        />
      ))}
    </group>
  );
};

// Main exported component with Canvas
const NeuronModel: React.FC<NeuronModelProps> = (props) => {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <NeuronScene {...props} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
        />
      </Canvas>
    </div>
  );
};

export default NeuronModel;
