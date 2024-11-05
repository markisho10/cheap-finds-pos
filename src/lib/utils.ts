import crypto from 'crypto';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return new Intl.DateTimeFormat('en-US').format(date)
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