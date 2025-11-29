'use client';

import { useState } from "react";

type FieldErrors = Record<string, string>;

const VALIDATION_RULES = {
  name: {
    required: "სახელი და გვარი სავალდებულოა",
    minLength: { value: 2, message: "სახელი უნდა შედგებოდეს მინიმუმ 2 სიმბოლოსგან" }
  },
  email: {
    required: "ელფოსტა სავალდებულოა",
    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "არასწორი ელფოსტის ფორმატი" }
  },
  phone: {
    required: "ტელეფონი სავალდებულოა",
    minLength: { value: 9, message: "ტელეფონი უნდა შედგებოდეს მინიმუმ 9 სიმბოლოსგან" },
    pattern: { value: /^[\d\s+\-()]+$/, message: "არასწორი ტელეფონის ფორმატი" }
  },
  resume: {
    required: "CV-ის ატვირთვა სავალდებულოა",
    fileType: { value: "application/pdf", message: "მხოლოდ PDF ფაილები დაშვებულია" },
    maxSize: { value: 10 * 1024 * 1024, message: "ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს" }
  }
} as const;

export function useFormValidation() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string, files?: FileList | null): string => {
    const rules = VALIDATION_RULES[name as keyof typeof VALIDATION_RULES];
    if (!rules) return "";

    if ('required' in rules && !value.trim() && (!files || files.length === 0)) {
      return rules.required;
    }

    if ('minLength' in rules && value.trim().length < rules.minLength.value) {
      return rules.minLength.message;
    }

    if ('pattern' in rules && value && !rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }

    if (name === 'resume' && files && files.length > 0) {
      const file = files[0];
      if ('fileType' in rules && file.type !== rules.fileType.value) {
        return rules.fileType.message;
      }
      if ('maxSize' in rules && file.size > rules.maxSize.value) {
        return rules.maxSize.message;
      }
    }

    return "";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value, files);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (touched[name]) {
      const error = validateField(name, value, files);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const reset = () => {
    setErrors({});
    setTouched({});
  };

  return { errors, touched, handleBlur, handleChange, reset };
}