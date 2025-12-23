// This file contains functions to translate service data

import { Service } from "../processDataApi/processData"

// Map of common French terms to English
const frenchToEnglish: Record<string, string> = {
  // Categories
  "Abonnés Tiktok": "TikTok Followers",
  "Services de vues YouTube": "YouTube Views Services",
  "Vues des publicités YouTube": "YouTube Ad Views",
  "J'aime Instagram": "Instagram Likes",
  "Instagram : Abonnés [ En activité ⚡️]": "Instagram: Followers [Active ⚡️]",
  "Spotify Plays [Device Targeted]": "Spotify Plays [Device Targeted]",
  "Chaine WhatsApp / Abonnés & Réaction": "WhatsApp Channel / Followers & Reactions",
  "Facebook (en reparation)": "Facebook (under maintenance)",
  "Twitter Abonné": "Twitter Followers",
  "YouTube : Abonnés garantis": "YouTube: Guaranteed Subscribers",
  SoundCloud: "SoundCloud",

  // Common terms in service names
  Abonnés: "Followers",
  Vues: "Views",
  Likes: "Likes",
  réels: "reels",
  jours: "days",
  "Démarrage instantané": "Instant start",
  "Garantie à vie": "Lifetime guarantee",
  "Recharge à vie": "Lifetime refill",
  "Haute qualité": "High quality",
  "Sans perte": "No drop",
  "Vues réelles": "Real views",
  "grâce aux publicités": "through ads",
  "Heure de début": "Start time",
  "Serveur de haute qualité": "High quality server",
  "MEILLEURE QUALITÉ": "BEST QUALITY",
  "Taux de chute": "Drop rate",
  "Recharge de": "Refill for",
  "Tous comptes": "All accounts",
  Mix: "Mix",
  Réaction: "Reaction",
  "Monde entier": "Worldwide",
  "utilisateurs réels": "real users",
}

// Function to translate a single string
export function translateText(text: string, targetLanguage: string): string {
  if (targetLanguage === "fr") return text

  if (targetLanguage === "en") {
    let translatedText = text

    // Replace known French terms with English equivalents
    Object.entries(frenchToEnglish).forEach(([french, english]) => {
      // Use case-insensitive replacement with regex
      const regex = new RegExp(french, "gi")
      translatedText = translatedText.replace(regex, english)
    })

    return translatedText
  }

  return text
}

// Function to translate service data
export function translateServiceData(service: Service, targetLanguage: string): Service {
  if (targetLanguage === "fr") return service

  if (targetLanguage === "en") {
    return {
      ...service,
      name: translateText(service.name, targetLanguage),
      category: translateText(service.category, targetLanguage),
      // Add other fields that need translation
    }
  }

  return service
}

// Function to translate an array of services
export function translateServices(services: Service[], targetLanguage: string): Service[] {
  return services.map((service) => translateServiceData(service, targetLanguage))
}

