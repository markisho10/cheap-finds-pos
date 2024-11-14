import crypto from 'crypto';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { defaultTimeZone } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  if (typeof date === 'string') {
    const dateString = date.match('Z') ? date : `${date}Z`;
    date = new Date(dateString).toLocaleString('en-US', { timeZone: defaultTimeZone });
    date = new Date(date);
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

export function formatDateforURL(date: Date) {
  const padding = (dateChunk: string | number) => {
    return String(dateChunk).padStart(2, '0')
  }
  const currentTime = new Date();
  return `${date.getFullYear()}-${padding(date.getMonth()+1)}-${padding(date.getDate())}T${padding(currentTime.getHours())}:${padding(currentTime.getMinutes())}:${padding(currentTime.getSeconds())}`
}

export function convertDateToUTC(dateParam: string | Date | null | undefined = null) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'UTC'
  }
  return new Intl.DateTimeFormat('sv-SE', dateOptions).format(new Date(dateParam || Date.now()));
}

export function generateBarcodeNumbers(input: string) {
  // Generate MD5 hash in hexadecimal format and limit to 12 characters
  const md5Hash = crypto.createHash('md5').update(input).digest('hex').substring(0, 12);

  // Replace hexadecimal letters with corresponding digits
  const numbersOnlyHash = md5Hash.replace(/[a-f]/g, letter => {
      return (letter.charCodeAt(0) - 87).toString();
  });
  return numbersOnlyHash;
}

export function productIdToLightHexColorWithContrast(productId: number): string {
  let hash = 0;
  const lightColors = [
    "#FFB6C1", "#FFD700", "#FF6347", "#98FB98", "#F0E68C", "#ADD8E6", "#E0FFFF", "#FF69B4", "#D3D3D3", "#F5F5DC",
    "#FF1493", "#FFE4E1", "#F0F8FF", "#F5FFFA", "#FFFACD", "#FAFAD2", "#D8BFD8", "#F08080", "#E6E6FA", "#FFF5EE",
    "#E0E0E0", "#B0E0E6", "#F4A460", "#FFDAB9", "#B0C4DE", "#FFDEAD", "#FFE4B5", "#F8F8FF", "#FAEBD7", "#FFEBCD",
    "#F5F5F5", "#D3D3D3", "#FFB6C1", "#DCDCDC", "#FFE4E1", "#F0E68C", "#F0FFF0", "#F5F5F5", "#F7D1A2", "#FFF8DC",
    "#FFD700", "#F5F5DC", "#E0FFFF", "#FAEBD7", "#E6E6FA", "#FFDDC1", "#E0B0FF", "#F2F4F7", "#FFEC8B", "#E1EFFF",
    "#FFECF4", "#E4B5A8", "#FFAA00", "#E5E5E5", "#FFB7C5", "#F5E1F4", "#D4AF37", "#B28DFF", "#C1E1DC", "#E0C5E0",
    "#E1C6E8", "#F3D8A8", "#F5A9A9", "#E6E0D4", "#DFF0D8", "#D7D4F0", "#F5F0FF", "#F9D3A3", "#FFB3B3", "#F9E4D0",
    "#E0C8D0", "#F8B8B8", "#F0D1C0", "#F7D1A2", "#F2DBBF", "#F5E5B8", "#F5D0A9", "#F6D8AE", "#E1F0F5", "#F9E0D4",
    "#F6D7B9", "#D4E9F3", "#D4C3E6", "#F7D7E3", "#FFE3B3", "#F2D9B3", "#F2E2A3", "#D8B3B3", "#F7B7D4", "#F8D0D3",
    "#FFACAC", "#F9D8B1", "#F4C2B8", "#D8F2F9", "#F2D6D5", "#F4C3B7", "#F2E1E3", "#F4D4D4", "#E8D8FF", "#F7F0E1"
  ];
  const productIdString = productId.toString();

  for (let i = 0; i < productIdString.length; i++) {
      hash = ((hash << 5) - hash) + productIdString.charCodeAt(i);
      hash |= 0; // Convert to a 32-bit integer
  }

  // Generate a random index based on the hash value for randomness
  const randomIndex = Math.abs(hash) % lightColors.length;

  // Select a random light color from the list
  const randomLightColor = lightColors[randomIndex];

  // Return the selected random light color
  
  return (process.env.NEXT_PUBLIC_ALLOW_BARCODE_RANDOM_COLOR && process.env.NEXT_PUBLIC_ALLOW_BARCODE_RANDOM_COLOR == '1')
    ? randomLightColor
    : '#FFFFFF';
}

