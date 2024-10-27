import React, { useState } from 'react';
import './Popup.css';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import { Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { addToMarketplace } from '../functions/functions';

function Popup({ isVisible, onClose, card, wallet }) {
  const [value, setValue] = useState('1'); // Pour garder l'onglet "Détails" actif

  const handleAddToMarketplace = () => {
    addToMarketplace(wallet, card.id, [])
      .then(() => {
        alert('Card added to Marketplace successfully');
        onClose(); // Fermer le popup après l'ajout
      })
      .catch(error => console.error("Error adding to marketplace:", error));
  };

  return (
    isVisible && (
      <div className="popup-overlay">
        <div className="popup">
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <TabPanel value="1">
                <h2>{card.name}</h2>
                <img className="cardImage" src={card.images.small} alt={card.name} />
                <div className="card-details">
                  <h3>Card Details <InfoIcon fontSize="small" className="icon" /></h3>
                  <p className='black'>
                    <strong>Supertype:</strong> {card.supertype}
                  </p>
                  <p className='black'>
                    <strong>Subtypes:</strong> {card.subtypes ? card.subtypes.join(", ") : "N/A"}
                  </p>
                  <p className='black'>
                    <FitnessCenterIcon fontSize="small" className="heart-icon" /> <strong>HP:</strong> {card.hp}
                  </p>
                  <p className='black'>
                    <SportsMmaIcon fontSize="small" className="sword-icon" /> <strong>Types:</strong> {card.types ? card.types.join(", ") : "N/A"}
                  </p>
                  <p className='black'>
                    <strong>Rules:</strong> {card.rules ? card.rules.join(", ") : "N/A"} <ArrowForwardIcon fontSize="small" className="icon" />
                  </p>
                  <h3>Attacks</h3>
                  <ul>
                    {card.attacks ? (
                      card.attacks.map((attack, index) => (
                        <li key={index}>
                          <SportsMmaIcon fontSize="small" className="sword-icon" /> <strong>{attack.name}</strong> - {attack.text}
                        </li>
                      ))
                    ) : (
                      <li>No attacks available.</li>
                    )}
                  </ul>
                  <h3>Weaknesses</h3>
                  <ul>
                    {card.weaknesses ? (
                      card.weaknesses.map((weakness, index) => (
                        <li key={index}>
                          <FitnessCenterIcon fontSize="small" className="heart-icon" /> <strong>Type:</strong> {weakness.type}, <strong>Value:</strong> {weakness.value}
                        </li>
                      ))
                    ) : (
                      <li>No weaknesses available.</li>
                    )}
                  </ul>
                  <h3>Retreat Cost</h3>
                  <p className='black'>{card.retreatCost ? card.retreatCost.join(", ") : "N/A"} <ArrowForwardIcon fontSize="small" className="icon" /></p>
                </div>
                <div className="add-to-marketplace-button">
                  <Button variant="contained" onClick={handleAddToMarketplace}>
                    Add to Marketplace
                  </Button>
                </div>
                <button className="close-button" onClick={onClose}>
                  Close
                </button>
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      </div>
    )
  );
}

export default Popup;
