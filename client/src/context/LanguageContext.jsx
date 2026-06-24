import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    brand: "RaktoSetu",
    home: "Home",
    findDonor: "Find Donor",
    emergency: "Emergency",
    login: "Login",
    register: "Register",
  },
  bn: {
    brand: "রক্তসেতু",
    home: "হোম",
    findDonor: "ডোনার খুঁজুন",
    emergency: "জরুরি রক্তের অনুরোধ",
    login: "লগইন",
    register: "রেজিস্টার",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);