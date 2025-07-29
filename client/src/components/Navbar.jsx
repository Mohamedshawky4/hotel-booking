import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useClerk, UserButton } from '@clerk/clerk-react';
import { useAppContext } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../translations';
import LanguageToggle from './LanguageToggle';

const BookIcon = () => (
  <svg
    className="w-4 h-4 text-gray-700"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
    />
  </svg>
);

const Navbar = () => {
  const { currentLanguage, isRTL } = useLanguage();
  
  const navLinks = [
    { name: t('nav.home', currentLanguage), path: '/' },
    { name: t('nav.hotels', currentLanguage), path: '/rooms' },
    { name: t('nav.experience', currentLanguage), path: '/' },
    { name: t('nav.about', currentLanguage), path: '/' },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openSignIn } = useClerk();

  const location = useLocation();
  const {user,navigate,isOwner,setShowHotelReg}=useAppContext();

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? 'bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4'
          : 'py-4 md:py-6'
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-9 ${isScrolled && 'invert opacity-80'}`}
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <a
            key={i}
            href={link.path}
            className={`group flex flex-col gap-0.5 ${
              isScrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            {link.name}
            <div
              className={`${
                isScrolled ? 'bg-gray-700' : 'bg-white'
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </a>
        ))}

        {user && (
          <button
            className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${
              isScrolled ? 'text-black' : 'text-white'
            } transition-all`}
            onClick={() => isOwner?navigate('/owner') : setShowHotelReg(true)}
          >
            {isOwner ? t('nav.dashboard', currentLanguage) : t('nav.listYourHotel', currentLanguage)}
          </button>
        )}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4">
        <img
          src={assets.searchIcon}
          alt="search"
          className={`${isScrolled && 'invert'} h-7 transition-all duration-500`}
        />

        {/* Language Toggle */}
        <LanguageToggle />

        {user ? (
          <>
            <button
              onClick={() => navigate('/my-bookings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isScrolled ? 'text-black' : 'text-white'
              }`}
            >
              <BookIcon />
              {t('nav.myBookings', currentLanguage)}
            </button>
            <UserButton />
          </>
        ) : (
          <button
            onClick={openSignIn}
            className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${
              isScrolled ? 'text-black' : 'text-white'
            } transition-all ${isRTL ? 'font-arabic' : ''}`}
          >
            {t('common.signIn') || 'Sign In'}
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden"
      >
        <img
          src={assets.menuIcon}
          alt="menu"
          className={`h-6 ${isScrolled && 'invert'}`}
        />
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden">
          <div className="flex flex-col p-4 space-y-4">
            {navLinks.map((link, i) => (
              <a
                key={i}
                href={link.path}
                className="text-gray-700 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            
            {/* Language Toggle in Mobile Menu */}
            <div className="flex justify-center py-2">
              <LanguageToggle />
            </div>

            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate('/my-bookings');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <BookIcon />
                  {t('nav.myBookings', currentLanguage)}
                </button>
                <button
                  onClick={() => {
                    isOwner ? navigate('/owner') : setShowHotelReg(true);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {isOwner ? t('nav.dashboard', currentLanguage) : t('nav.listYourHotel', currentLanguage)}
                </button>
              </>
            ) : (
                              <button
                  onClick={() => {
                    openSignIn();
                    setIsMenuOpen(false);
                  }}
                  className={`text-gray-700 hover:text-gray-900 transition-colors ${isRTL ? 'font-arabic' : ''}`}
                >
                  {t('common.signIn') || 'Sign In'}
                </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
