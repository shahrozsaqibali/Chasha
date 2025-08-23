import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppButton = () => {
  const phoneNumber = "+971507540056";
  const message = "Hello! I'm interested in your delicious food. Can you help me place an order?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float animate-float"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} color="white" />
    </a>
  );
};

export default WhatsAppButton;