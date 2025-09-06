import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Clock, Users, Award, ArrowRight, MessageCircle, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useBestSellers } from '@/hooks/useMenuItems';
//import TwickSection from "../components/TwikSection"


// Direct image URLs for better reliability
const heroImage1 = 'https://res.cloudinary.com/dy5mtu23k/image/upload/f_webp,q_auto,w_1600/Landscape_m7mdav.jpg';
const heroImage2 = 'https://res.cloudinary.com/dy5mtu23k/image/upload/f_webp,q_auto,w_1600/hero-bg-2_nlpjqs.jpg';
const heroImage3 = 'https://res.cloudinary.com/dy5mtu23k/image/upload/f_webp,q_auto,w_1600/hero-bg-3_ljj14z.jpg';

import LogoImage from "@/assets/logo.webp";

// Cache Manager for preloader state
class PreloaderCache {
  static CACHE_KEY = 'chasha_preloader_cache';
  static CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  static shouldShowPreloader() {
    try {
      const cached = JSON.parse(sessionStorage.getItem(this.CACHE_KEY) || '{}');
      const now = Date.now();
      
      // Check if cache exists and is still valid
      if (cached.timestamp && (now - cached.timestamp) < this.CACHE_DURATION) {
        return false; // Don't show preloader if cache is valid
      }
      
      return true; // Show preloader if no cache or cache expired
    } catch (error) {
      console.warn('Error reading preloader cache:', error);
      return true; // Show preloader on error
    }
  }
  
  static setPreloaderShown() {
    try {
      const cacheData = {
        timestamp: Date.now(),
        shown: true
      };
      sessionStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Error setting preloader cache:', error);
    }
  }
  
  static clearCache() {
    try {
      sessionStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.warn('Error clearing preloader cache:', error);
    }
  }
}

// Simple Logo Preloader
const Preloader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo with Zoom In/Out Animation */}
        <motion.img
          src={LogoImage}
          alt="Cha Sha Logo"
          className="w-60 h-60 mx-auto"
        />
        
        {/* Logo Text */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl font-bold text-white mt-4"
        >
          
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-white/80 text-lg mt-2"
        >
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// Enhanced Image Preloader Hook with Caching
const useImagePreloader = (imageUrls, shouldPreload = true) => {
  const [loadedImages, setLoadedImages] = useState(0);
  const [isLoading, setIsLoading] = useState(shouldPreload);
  const [cachedImages, setCachedImages] = useState(new Set());

  useEffect(() => {
    if (!shouldPreload || imageUrls.length === 0) {
      setIsLoading(false);
      return;
    }

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    const preloadImage = (src) => {
      return new Promise((resolve) => {
        // Check if image is already in browser cache
        if (cachedImages.has(src)) {
          loadedCount++;
          setLoadedImages(loadedCount);
          resolve();
          return;
        }

        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setLoadedImages(loadedCount);
          setCachedImages(prev => new Set([...prev, src]));
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          setLoadedImages(loadedCount);
          resolve(); // Still resolve to continue loading other images
        };
        img.src = src;
      });
    };

    const loadAllImages = async () => {
      const promises = imageUrls.map(preloadImage);
      await Promise.all(promises);
      setIsLoading(false);
    };

    loadAllImages();
  }, [imageUrls, shouldPreload, cachedImages]);

  const progress = imageUrls.length > 0 ? (loadedImages / imageUrls.length) * 100 : 100;
  
  return { isLoading, progress };
};

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [shouldShowPreloader, setShouldShowPreloader] = useState(() => PreloaderCache.shouldShowPreloader());
  const [showPreloader, setShowPreloader] = useState(shouldShowPreloader);
  
  // Use the custom hook to fetch best sellers from Supabase
  const { menuItems: bestSellers, loading: bestSellersLoading, error: bestSellersError } = useBestSellers(6, true);

  // Define images to preload - fixed to remove undefined references
  const imagesToPreload = [
    heroImage1,
    heroImage2,
    heroImage3,
    // Add Google Images from About section
    "https://lh3.googleusercontent.com/gps-cs-s/AC9h4no-r1I0PULQ5cd-3V_1-jpFTiAOVtHWqYu8clf3Cas_uAercW8jsZggtlublx7yd0zi6MooXzuuUEuydnGwpDrG7d24g3M5jQ41VJmyhTj9y4Ehh_3NaNSF2tI73sh8R9Y8H-Ic8A=s680-w680-h510",
    "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nr2j0LajgDx32D1ywQtO1kX0YITzf3YwuF6Lx0XyWY32DJrH7KmFHr2223BetxQ030ak9ymd989VBsBZz9i8E7HS9C_Bv8Olq5kdg7HxEZMV1YGbSnxxJHMUvNJyDcD_GhrejAy=s680-w680-h510",
    "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrkXx3eX9gdadm9kUetJed0d0djKWPfD0AokR0QBRck-qx7GCKeVSPOJAtlkajWXONJ2OC01CBwSJBWiKfjoVfCQKOo5TJXLtPnq1frWwHeHHY2WLz5opAVgMddszX_lfFcS-f7=s680-w680-h510",
    "https://lh3.googleusercontent.com/gps-cs-s/AC9h4nojhWZ0tHa4uWEE712P6rT-raYF3faUXWzimnDo4MqflewQZmQJYSPwJAKr2wybnHPlituoqVnADiiuFX5lU9qH4wC5Xurf92MEA-DlfSXx_hqocZtXum0ju0VzdgVfnFhJIyLW=s680-w680-h510"
  ];

  // Add best seller images to preload list
  const allImagesToPreload = [
    ...imagesToPreload,
    ...bestSellers.map(item => item.Image).filter(Boolean)
  ];

  // Use image preloader hook - only preload if we should show preloader
  const { isLoading: imagesLoading, progress: imageProgress } = useImagePreloader(
    allImagesToPreload, 
    shouldShowPreloader
  );

  // Calculate overall progress
  const dataProgress = (!shouldShowPreloader || !bestSellersLoading) ? 40 : 0; // 40% for data loading
  const totalProgress = Math.min(100, imageProgress * 0.6 + dataProgress); // 60% for images, 40% for data

  // Hide preloader when everything is loaded
  useEffect(() => {
    if (!shouldShowPreloader) {
      // If we shouldn't show preloader, hide it immediately
      setShowPreloader(false);
      return;
    }

    const minLoadingTime = 2500; // Minimum 2.5 seconds to show the preloader
    const startTime = Date.now();
    
    const shouldHidePreloader = !imagesLoading && !bestSellersLoading && bestSellers.length >= 0;
    
    if (shouldHidePreloader) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
      
      setTimeout(() => {
        setShowPreloader(false);
        PreloaderCache.setPreloaderShown(); // Mark preloader as shown in cache
      }, remainingTime);
    } else if (bestSellersError && !imagesLoading) {
      // If there's an error but images are loaded, still hide preloader after minimum time
      setTimeout(() => {
        setShowPreloader(false);
        PreloaderCache.setPreloaderShown(); // Mark preloader as shown even on error
      }, minLoadingTime);
    }
  }, [imagesLoading, bestSellersLoading, bestSellers, bestSellersError, shouldShowPreloader]);

  const heroSlides = [
    {
      image: heroImage1,
      title: "ChaSha Abu Dhabi",
      subtitle: "Chai jo maan ko bhaye",
    },
    {
      image: heroImage2,
      title: "Made with Love & Tradition",
      subtitle: "Every dish tells a story of heritage and passion",
    },
    {
      image: heroImage3,
      title: "Fresh, Flavorful, Unforgettable",
      subtitle: "Bringing you the best of Pakistani street food culture",
    },
  ];

  // Auto-rotate hero slides
  useEffect(() => {
    if (showPreloader) return; // Don't start auto-rotation until preloader is gone
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [showPreloader]);

  const reviews = [
    {
      name: "Rishabh Ambadkar",
      rating: 5,
      comment: "Had a wonderful experience everytime I eat over here. Their chai ☕ taste is like I m drinking in home. Do try their pindi chaane outstanding taste. Their staff is also very warm and friendly. Out of 10 I will give 10 to this restaurant. Would love to come here again and again. Thank you team Cha Sha for the great experience.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Casey Aguilar",
      rating: 5,
      comment: "Delicious chai and stuffed paratha. Must try the doodh pati karak and aloo and keema parathas! The servers are very kind and helpful. My mom who can't handle any spice was with me and they brought extra food to accommodate her. 🙏",
      image: "https://images.unsplash.com/photo-1494790108755-2616b9449db1?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Usman Abdul Rehman",
      rating: 5,
      comment: "It's very tasty and delicious food. We ordered chicken cheese paratha and omelette paratha.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Safsaf Elhd",
      rating: 5,
      comment: "Amazing foood, my favorite Pakistani spot Staff are very freindly😍😍😍 thank youuu💕",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  // Colorful word colors for the hero title
  const wordColors = [
    'text-orange-400',
    'text-red-400', 
    'text-green-400',
    'text-blue-400',
    'text-purple-400',
    'text-yellow-400',
    'text-pink-400',
    'text-cyan-400',
    'text-emerald-400',
    'text-rose-400'
  ];

  const handleWhatsAppClick = () => {
    const message = "Hello! I'd like to place an order for delivery.";
    window.open(`https://wa.me/971561945726?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleGoogleReview = () => {
    window.open('https://www.google.com/search?sca_esv=869098bf9f856b8f&sxsrf=AE3TifMJzMm-EpX3IhXoU4PKq2gV1DYw3g:1755950001953&q=chasha&si=AMgyJEtREmoPL4P1I5IDCfuA8gybfVI2d5Uj7QMwYCZHKDZ-E_Q9hdkmh0-hWmYl1OWASXztUSkVfR6Kv15DnIXC4vK61p0Yg84gyiSQaVTmwJ_ph5xeRrUogwVBPvmKYWuyzzlLLA_6c70SDDf5h08VSUC4siAUzQ%3D%3D&sa=X&ved=2ahUKEwidm_DA76CPAxX4-QIHHTCLE9cQrrQLegQIJRAA&biw=1366&bih=607&dpr=1#lrd=0x3e5e67628444cb29:0x2bb4fc9da30da468,3,,,,', '_blank');
  };


  


  // Render Best Sellers Content
function truncateWords(text: string, wordLimit: number) {
  const words = text.split(" ")
  if (words.length <= wordLimit) return text
  return words.slice(0, wordLimit).join(" ") + "..."
}

const renderBestSellers = () => {
  if (bestSellersLoading && shouldShowPreloader) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="truck-art-border animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg"></div>
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-muted rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (bestSellersError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive text-lg mb-4">
          Error loading best sellers: {bestSellersError}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (bestSellers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No best sellers available at the moment.
        </p>
      </div>
    );
  }

  return (
    <>
   
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      {bestSellers.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: index * 0.2, duration: 0.8 }}
        >
          <Card className="truck-art-border hover:shadow-xl transition-all duration-300 overflow-hidden">
            {/* Image wrapper */}
            <div className="relative aspect-[3/2] w-full bg-white overflow-hidden">
  <img
    src={item.Image}
    alt={item.Name}
    className="w-full h-full object-cover transition-transform duration-300"
    onError={(e) => {
      (e.currentTarget as HTMLImageElement).src =
        "/src/assets/placeholder-dish.jpg";
    }}
  />
  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
    {item.Currency} {item.Price}
  </div>
  {!item.isAvailable && (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
      <span className="text-white font-semibold">Currently Unavailable</span>
    </div>
  )}
</div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">
                {item.Name}
              </h3>
              {/* Description with truncation */}
              <p
                className="text-muted-foreground mb-4"
                title={item.Description}
              >
                {truncateWords(item.Description, 7)}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary font-medium">
                  {item.Category}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-accent text-accent"
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
    </>
  );
};


  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Preloader - Only shows when needed */}
      <AnimatePresence>
        {showPreloader && <Preloader progress={totalProgress} />}
      </AnimatePresence>

      <Header />
      <WhatsAppButton />

      {/* Fixed Hero Section */}
      <section className="relative h-screen overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {/* Use img element instead of background-image for better reliability */}
            <img 
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
            
            <div className="relative pl-4 sm:pl-12 z-10 container mx-auto px-4 h-full flex items-center justify-start">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-left text-white max-w-4xl"
              >
                {/* COLORFUL HERO TITLE */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3">
                  {heroSlides[currentSlide].title.split(" ").map((word, index) => (
                    <motion.span
                      key={`${currentSlide}-${index}`} // Add currentSlide to key for proper animation
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className={`mr-2 inline-block ${wordColors[index % wordColors.length]} drop-shadow-lg`}
                    >
                      {word}
                    </motion.span>
                  ))}
                </h1>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-yellow-400 max-w-xl mb-6">
                  {heroSlides[currentSlide].subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-start items-start sm:items-center pt-2">
                  <Button variant="hero" size="sm" asChild>
                    <Link to="/menu">
                      Open Menu
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators 
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSlide === index 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>*/}
      </section>

      {/* Best Sellers Section */}
      <section className="py-20 truck-art-pattern">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Best Sellers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our most loved dishes that keep customers coming back for more
            </p>
            {bestSellersLoading && shouldShowPreloader && (
              <p className="text-sm text-muted-foreground mt-2">Loading fresh from our kitchen...</p>
            )}
          </motion.div>

          {renderBestSellers()}

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="truck" size="lg" asChild>
                <Link to="/menu">View Full Menu</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-muted/30 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* LEFT SIDE - TEXT */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-primary">About Chasha</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Founded with a passion for authentic Pakistani cuisine, Chasha brings the vibrant flavors 
                of Karachi to Dubai. Our journey began with a simple mission: to serve traditional recipes 
                passed down through generations, using the finest ingredients and time-honored cooking methods.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Every dish at Chasha tells a story of our rich culinary heritage. From our signature biryanis 
                to our slow-cooked niharis, we maintain the authenticity that makes Pakistani cuisine so beloved 
                around the world.
              </p>
              
              {/* FEATURES */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">Fresh Daily</h3>
                    <p className="text-sm text-muted-foreground">Prepared fresh every day</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">Authentic</h3>
                    <p className="text-sm text-muted-foreground">Traditional recipes</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE - PHOTO COLLAGE */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4 relative w-full max-w-full overflow-hidden"
            >
              <img
                src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4no-r1I0PULQ5cd-3V_1-jpFTiAOVtHWqYu8clf3Cas_uAercW8jsZggtlublx7yd0zi6MooXzuuUEuydnGwpDrG7d24g3M5jQ41VJmyhTj9y4Ehh_3NaNSF2tI73sh8R9Y8H-Ic8A=s680-w680-h510"
                alt="Dish 1"
                className="rounded-2xl shadow-lg object-cover h-56 w-full max-w-full"
              />
              <img
                src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nr2j0LajgDx32D1ywQtO1kX0YITzf3YwuF6Lx0XyWY32DJrH7KmFHr2223BetxQ030ak9ymd989VBsBZz9i8E7HS9C_Bv8Olq5kdg7HxEZMV1YGbSnxxJHMUvNJyDcD_GhrejAy=s680-w680-h510"
                alt="Dish 2"
                className="rounded-2xl shadow-lg object-cover h-72 w-full max-w-full mt-8"
              />
              <img
                src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nrkXx3eX9gdadm9kUetJed0d0djKWPfD0AokR0QBRck-qx7GCKeVSPOJAtlkajWXONJ2OC01CBwSJBWiKfjoVfCQKOo5TJXLtPnq1frWwHeHHY2WLz5opAVgMddszX_lfFcS-f7=s680-w680-h510"
                alt="Dish 3"
                className="rounded-2xl shadow-lg object-cover h-72 w-full max-w-full"
              />
              <img
                src="https://lh3.googleusercontent.com/gps-cs-s/AC9h4nojhWZ0tHa4uWEE712P6rT-raYF3faUXWzimnDo4MqflewQZmQJYSPwJAKr2wybnHPlituoqVnADiiuFX5lU9qH4wC5Xurf92MEA-DlfSXx_hqocZtXum0ju0VzdgVfnFhJIyLW=s680-w680-h510"
                alt="Dish 4"
                className="rounded-2xl shadow-lg object-cover h-56 w-full max-w-full mt-8"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              What Our Customers Say
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className="fill-accent text-accent" />
              ))}
              <span className="text-xl font-semibold ml-2">4.9/5</span>
            </div>
          </motion.div>

          {/* REVIEWS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {reviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <Card className="truck-art-border h-full">
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    {/* Stars */}
                    <div>
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={16} className="fill-accent text-accent" />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic">"{review.comment}"</p>
                    </div>

                    {/* Name pinned at bottom */}
                    <div className="mt-6">
                      <p className="font-semibold text-primary">{review.name}</p>
                      <p className="text-sm text-muted-foreground">Verified Customer</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Button variant="truck" size="lg" onClick={handleGoogleReview}>
              Rate us on Google
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;