import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { FaTiktok, FaInstagram } from 'react-icons/fa';
import LogoImage from '@/assets/logo.jpg';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'About Us', href: '/#about' },
    { name: 'Login', href: '/login' },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* Decorative Truck Art Border */}
      <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src={LogoImage}
                alt="Chasha Logo"
                className="h-12 w-12 rounded-full border-2 border-primary"
              />
              <span className="text-2xl font-bold text-primary"></span>
            </div>
            <p className="text-muted-foreground">
              Authentic Pakistani cuisine with the flavors of Karachi. Experience the taste of tradition.
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.tiktok.com/discover/cha-sha-restaurant-abu-dhabi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaTiktok size={20} />
              </a>
              <a
                href="https://www.instagram.com/chasha.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-primary" />
                <span className="text-sm">Khalidya, Abu Dhabi, UAE</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-primary" />
                <a
                  href="tel:+971507540056"
                  className="text-sm hover:text-primary transition-colors"
                >
                  +971507540056
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-primary" />
                <a
                  href="mailto:info@chasha.ae"
                  className="text-sm hover:text-primary transition-colors"
                >
                  info@chasha.ae
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Opening Hours</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock size={16} className="text-primary" />
                <div className="text-sm">
                  <div>Mon - Thu: 08:30 AM - 11:00 PM</div>
                  <div>Fri - Sat: 08:30 AM - 11:00 PM</div>
                  <div>Sunday: 08:30 AM - 11:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Quick Links</h3>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-sm hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Slogan */}
        <div className="mt-12 pt-8 border-t border-primary/20">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Chasha Restaurant. All rights reserved. Made with ❤️ for food lovers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
