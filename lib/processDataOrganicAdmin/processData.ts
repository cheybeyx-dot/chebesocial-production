export interface Service {
  service: string;
  name: string;
  type: string;
  rate: string;
  min: string;
  max: string;
  category: string;
  iconPath: string;
}

export interface FirebaseService {
  description: string;
  hours: number;
  maxQty: number;
  minQty: number;
  minutes: number;
  rate: number;
  serviceId: string;
  id?: string;
  iconPath?: string;
}

interface CategoryInfo {
  name: string;
  iconPath: string;
}

export interface SubCategories {
  amount: number;
  value: string;
  description: string;
  maxOrderQuantity: number;
  minOrderQuantity: number;
}

export interface FirebaseProcessProps {
  logoUrl: string;
  name: string;
  serviceId: string;
  subcategories: SubCategories[];
}

export function processOrganicData(data: FirebaseService[]) {
  const organicServicesByCategory: Record<string, FirebaseService[]> = {};

  if (data && Array.isArray(data)) {
    data.forEach((service) => {
      const categoryInfo = getCategoryInfo(service.serviceId);
      if (!organicServicesByCategory[categoryInfo.name]) {
        organicServicesByCategory[categoryInfo.name] = [];
      }
      organicServicesByCategory[categoryInfo.name].push({
        ...service,
        iconPath: categoryInfo.iconPath,
      });
    });
  }
  return {
    organicCategories: Object.keys(organicServicesByCategory).sort(),
    organicServicesByCategory,
  };
}

export function getCategoryInfo(serviceName: string): CategoryInfo {
  const lowercaseName = serviceName.toLowerCase();

  if (lowercaseName.includes("facebook"))
    return { name: "Facebook", iconPath: "/assets/icons/facebook.svg" };
  if (lowercaseName.includes("instagram") || lowercaseName.includes("accounts"))
    return { name: "Instagram", iconPath: "/assets/icons/instagram.svg" };
  if (lowercaseName.includes("twitter"))
    return { name: "Twitter", iconPath: "/assets/images/twitter_logo.jpg" };
  if (lowercaseName.includes("youtube"))
    return { name: "YouTube", iconPath: "/assets/icons/youtube.svg" };
  if (lowercaseName.includes("tiktok"))
    return { name: "TikTok", iconPath: "/assets/images/tiktok_logo.jpg" };
  if (lowercaseName.includes("linkedin"))
    return { name: "LinkedIn", iconPath: "/assets/images/linkedIn_logo.jpg" };
  if (lowercaseName.includes("spotify"))
    return { name: "Spotify", iconPath: "/assets/images/spotify_logo.jpg" };
  if (lowercaseName.includes("reddit"))
    return { name: "Reddit", iconPath: "/assets/images/reddit_logo.jpg" };
  if (lowercaseName.includes("snapchat"))
    return { name: "Snapchat", iconPath: "/assets/images/snapchat_logo.jpg" };
  if (lowercaseName.includes("threads") || lowercaseName.includes("thread"))
    return { name: "Threads", iconPath: "/assets/images/thread_logo.jpg" };
  if (lowercaseName.includes("telegram"))
    return { name: "Telegram", iconPath: "/assets/icons/telegram.svg" };
  if (lowercaseName.includes("boomplay"))
    return { name: "Boomplay", iconPath: "/assets/images/boomplay.jpg" };
  if (lowercaseName.includes("audiomack"))
    return { name: "Audiomack", iconPath: "/assets/images/audiomack.jpg" };
  if (lowercaseName.includes("playstore") || lowercaseName.includes("play store"))
    return { name: "Play Store", iconPath: "/assets/images/playstore.jpg" };
  if (lowercaseName.includes("whatsapp"))
    return { name: "Whatsapp", iconPath: "/assets/images/whatsapp-pic.jpg" };
  if (lowercaseName.includes("website"))
    return { name: "Website", iconPath: "/assets/images/website.jpg" };
  if (lowercaseName.includes("discord"))
    return { name: "Discord", iconPath: "/assets/images/discord_logo.jpg" };
  return { name: "Other", iconPath: "/assets/icons/user.svg" };
}
