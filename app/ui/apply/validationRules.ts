export const VALIDATION_RULES = {
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