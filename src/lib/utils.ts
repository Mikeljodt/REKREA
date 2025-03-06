import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Función para obtener clases y texto para formatear status
export function getStatusConfig(status: string): { className: string, label: string } {
  switch(status.toLowerCase()) {
    case 'active':
    case 'activa':
      return {
        className: "px-2 py-1 rounded-full bg-success/20 text-success text-xs font-medium",
        label: "Activa"
      };
    case 'inactive':
    case 'inactiva':
      return {
        className: "px-2 py-1 rounded-full bg-destructive/20 text-destructive text-xs font-medium",
        label: "Inactiva"
      };
    default:
      return {
        className: "px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium",
        label: status
      };
  }
}

export const generateSerialNumber = (type: string): string => {
  const prefix = type.toUpperCase().substring(0, 2);
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};
