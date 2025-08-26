import { MessageCircle } from 'lucide-react';
import talabatLogo from '../assets/talabat_logo.png';
import noonLogo from '../assets/noon_logo.svg';
import zomatoLogo from "../assets/zomato_logo.svg";

const DeliveryButtons = () => {
  const phoneNumber = "+971507540056";
  const message = "Hello! I'm interested in your delicious food. Can you help me place an order?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleTalabatClick = () => {
    // Replace with your actual Talabat restaurant URL
    window.open('https://www.talabat.com/uae/restaurant/735100/cha-sha-restaurant-al-khalidiyah?aid=6485', '_blank');
  };

  const handleNoonClick = () => {
    // Replace with your actual Noon Food restaurant URL  
    window.open('https://food.noon.com/uae-en/outlet/CHSHRSN5TM/', '_blank');
  };

  const handleZomatoClick = () => {
    // Replace with your actual Noon Food restaurant URL  
    window.open('https://www.zomato.com/abudhabi/cha-sha-al-khalidiya', '_blank');
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

      {/**Zomato Button*/}
      <button
        onClick={handleZomatoClick}
        className="delivery-button zomato-button"
        aria-label="Order from Zomato Food"
      >
        <img 
          src={zomatoLogo} 
          alt="Zomato Food" 
          className="delivery-logo-image" 
        />
      </button>


    </>
  );
};

export default DeliveryButtons;