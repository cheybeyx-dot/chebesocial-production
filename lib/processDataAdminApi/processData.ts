export interface Service {
  service: string;
  name: string;
  type: string;
  rate: string;
  min: string;
  max: string;
  category: string;
  iconPath: string; // Changed from iconName to iconPath
}

interface CategoryInfo {
  name: string;
  iconPath: string; // Changed from iconName to iconPath
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

export function processData(data: Service[]) {
  const servicesByCategory: Record<string, Service[]> = {};

  if (data && Array.isArray(data)) {
    data.forEach((service) => {
      const categoryInfo = getCategoryInfo(service.name);
      if (!servicesByCategory[categoryInfo.name]) {
        servicesByCategory[categoryInfo.name] = [];
      }
      servicesByCategory[categoryInfo.name].push({
        ...service,
        iconPath: categoryInfo.iconPath,
      });
    });
  }

  return {
    categories: Object.keys(servicesByCategory).sort(),
    servicesByCategory,
  };
}

function getCategoryInfo(serviceName: string): CategoryInfo {
  const lowercaseName = serviceName.toLowerCase();

  // Updated to use image paths instead of icon names
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
  if (lowercaseName.includes("discord"))
    return { name: "Discord", iconPath: "/assets/images/discord_logo.jpg" };
  return { name: "Other", iconPath: "/assets/icons/user.svg" };
}

export const processDataFirebase = (data: FirebaseProcessProps) => {
  try {
    // Process and transform the data if needed
    const processedData = {
      logoUrl: data.logoUrl,
      name: data.name,
      serviceId: data.serviceId,
      subcategories: data.subcategories.map((subcat) => ({
        amount: subcat.amount,
        value: subcat.value,
        description: subcat.description,
        maxOrderQuantity: subcat.maxOrderQuantity,
        minOrderQuantity: subcat.minOrderQuantity,
      })),
    };

    return {
      logoUrl: processedData.logoUrl,
      name: processedData.name,
      serviceId: processedData.serviceId,
      subcategories: processedData.subcategories,
    };
  } catch (error) {
    console.error("Error processing Firebase data:", error);
    return { data: null };
  }
};