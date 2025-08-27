import { MessageCircle } from 'lucide-react';
import talabatLogo from '../assets/talabat_logo.png';
import noonLogo from '../assets/noon_logo.svg';
import instaLogo from "../assets/instagram_logo.svg";

const DeliveryButtons = () => {
  const phoneNumber = "+923431048001";
  const message = "Hello! I'm interested in your delicious food. Can you help me place an order?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const handleTalabatClick = () => {
    //  Talabat restaurant URL
    window.open('https://www.talabat.com/uae/restaurant/735100/cha-sha-restaurant-al-khalidiyah?aid=6485', '_blank');
  };

  const handleNoonClick = () => {
    // Noon Food restaurant URL  
    window.open('https://food.noon.com/uae-en/outlet/CHSHRSN5TM/', '_blank');
  };

  const handleInstaClick = () => {
    //  Noon Food restaurant URL  
    window.open('https://www.instagram.com/chasha.ae', '_blank');
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
        onClick={handleInstaClick}
        className="delivery-button zomato-button"
        aria-label="Order from Zomato Food"
      >
        <img 
          src={instaLogo} 
          alt="Zomato Food" 
          className="delivery-logo-image" 
        />
      </button>


    </>
  );
};

export default DeliveryButtons;