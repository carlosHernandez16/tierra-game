import React, { useState } from "react";
import { SketchPicker } from "react-color";
import Button from "@/components/ui/button";
import styles from "@/styles/hexagon.module.css"; // Importing CSS module

const HEX_WIDTH = 80; // Adjust size if needed
const HEX_HEIGHT = 69; // sqrt(3)/2 * width
const HEX_SPACING_X = 0.77;
const HEX_SPACING_Y = 0.60;

// Directions to add a new hexagon relative to existing ones
const HEX_DIRECTIONS = [
  { row: -1, col: 1 },  // Upper right
  { row: 1, col: 1 },   // Lower right
  { row: -1, col: -1 }, // Upper left
  { row: 1, col: -1 },  // Lower left
  { row: -2, col: 0 },  // Directly above
  { row: 2, col: 0 },   // Directly below
];

const MuralCanvas = () => {
  const initialHexagons = [
    { id: 0, row: 0, col: 0, offsetX: 0, offsetY: 0 }, // Center
    { id: 1, row: -1, col: 1, offsetX: 5, offsetY: -5 }, // Upper right
    { id: 2, row: 1, col: 1, offsetX: -3, offsetY: 7 }, // Lower right
    { id: 3, row: -1, col: -1, offsetX: -5, offsetY: -3 }, // Upper left
    { id: 4, row: 1, col: -1, offsetX: 3, offsetY: 5 }, // Lower left
    { id: 5, row: -2, col: 0, offsetX: 2, offsetY: -8 }, // Top center
    { id: 6, row: 2, col: 0, offsetX: -2, offsetY: 10 }, // Bottom center
  ];

  const [hexagons, setHexagons] = useState(
    initialHexagons.map((hex) => ({
      ...hex,
      owner: null,
      color: "#ffffff",
    }))
  );

  const [selectedHex, setSelectedHex] = useState(null);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [user, setUser] = useState("User1"); // Placeholder user
  const [addMode, setAddMode] = useState(false);

  // Find available positions around the periphery
  const getAvailablePositions = () => {
    const occupied = new Set(hexagons.map((h) => `${h.row},${h.col}`));
    const newPositions = new Set();

    hexagons.forEach((hex) => {
      HEX_DIRECTIONS.forEach((dir) => {
        const newRow = hex.row + dir.row;
        const newCol = hex.col + dir.col;
        const key = `${newRow},${newCol}`;

        if (!occupied.has(key)) {
          newPositions.add(key);
        }
      });
    });

    return [...newPositions].map((pos, index) => {
      const [row, col] = pos.split(",").map(Number);
      return { id: hexagons.length + index, row, col };
    });
  };

  const [availablePositions, setAvailablePositions] = useState(getAvailablePositions());
  
  // Claim an available hex position
  const addHex = (row, col) => {
    setHexagons((prev) => [
      ...prev,
      { id: prev.length, row, col, owner: user, color: "#ffffff" },
    ]);

    // Recalculate available positions after adding
    setAvailablePositions(getAvailablePositions());
    setAddMode(false); // Exit add mode after placing
  };

   const claimHex = (id) => {
    setHexagons((prev) =>
      prev.map((hex) =>
        hex.id === id && !hex.owner ? { ...hex, owner: user, color: currentColor } : hex
      )
    );
  };

  const paintHex = () => {
    if (selectedHex !== null) {
      setHexagons((prev) =>
        prev.map((hex) =>
          hex.id === selectedHex ? { ...hex, color: currentColor } : hex
        )
      );
    }
  }; 

  return (
    <div className="flex flex-col items-center p-4">
      {/* Sidebar for buttons */}
      <div className="p-4">
        <h2 className="text-lg font-bold">Actions</h2>
        <Button className="mt-2" onClick={() => setAddMode(!addMode)}>
          {addMode ? "Cancel Add" : "Add Hex"}
        </Button>
      </div>
      <h1 className="text-xl font-bold mb-2">The Wall - Mural Canvas</h1>
      <div className={styles.hexContainer}>
        {hexagons.map((hex) => {
          const x = hex.col * HEX_WIDTH * 0.77; // Horizontal spacing
          const y = hex.row * HEX_HEIGHT * 0.60; // Vertical spacing

          return (
            <div
              key={hex.id}
              className={styles.hexTile}
              style={{
                backgroundColor: hex.color,
                transform: `translate(${x}px, ${y}px) rotate(90deg)`, 
              }}
              //onClick={() => claimHex(hex.id)}
              onClick={() => setSelectedHex(hex.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                if (hex.owner === user) setSelectedHex(hex.id);
              }}
            >
              {hex.owner && <span className="text-xs text-white">{hex.owner}</span>}
            </div>
          );
        })}

        {/* Show available positions when in add mode */}
        {addMode &&
            availablePositions.map((pos) => {
              const x = pos.col * HEX_WIDTH * HEX_SPACING_X;
              const y = pos.row * HEX_HEIGHT * HEX_SPACING_Y;

              return (
                <div
                  key={`available-${pos.id}`}
                  className={`${styles.hexTile} ${styles.availableHex}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  onClick={() => addHex(pos.row, pos.col)}
                />
              );
            })}
      </div>
      {selectedHex !== null && (
        <div className="mt-4 p-2 border rounded">
          <h2>Paint Your Hex</h2>
          <SketchPicker color={currentColor} onChange={(color) => setCurrentColor(color.hex)} />
          <Button className="mt-2" onClick={paintHex}>
            Apply Color
          </Button>
        </div>
      )}
    </div>
  );
};

export default MuralCanvas;
