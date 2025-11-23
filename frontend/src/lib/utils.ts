import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value === undefined || value === null) return;

    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach((subKey) => {
        // @ts-ignore
        const subValue = value[subKey];
        if (subValue !== undefined && subValue !== null) {
          formData.append(`${key}.${subKey}`, subValue.toString());
        }
      });
    } else {
      formData.append(key, value.toString());
    }
  });

  return formData;
}
