import { MessageCircle } from 'lucide-react';

import talabatLogo from '../assets/talabat_logo.png';
import noonLogo from '../assets/noon_logo.png';

const DeliveryButtons = () => {
  const phoneNumber = "+971507540056";
  const message = "Hello! I'm interested in your delicious food. Can you help me place an order?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleTalabatClick = () => {
    // Replace with your actual Talabat restaurant URL
    window.open('https://www.talabat.com/', '_blank');
  };

  const handleNoonClick = () => {
    // Replace with your actual Noon Food restaurant URL  
    window.open('https://www.noon.com/food/', '_blank');
  };

  return (
    <>
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="delivery-button whatsapp-button"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle size={24} color="white" />
      </a>

      {/* Talabat Button */}
      <button
        onClick={handleTalabatClick}
        className="delivery-button talabat-button"
        aria-label="Order from Talabat"
      >
        <img 
          src={talabatLogo} 
          alt="Talabat" 
          className="delivery-logo-image" 
        />
      </button>

      {/* Noon Button */}
      <button
        onClick={handleNoonClick}
        className="delivery-button noon-button"
        aria-label="Order from Noon Food"
      >
        <img 
          src={noonLogo} 
          alt="Noon Food" 
          className="delivery-logo-image" 
        />
      </button>
    </>
  );
};

export default DeliveryButtons;