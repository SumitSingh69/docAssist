// Medical condition interface
export interface IMedicalCondition {
  name: string;
  diagnosedAt?: string;
}

// Medication interface
export interface IMedication {
  name: string;
  dosage?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
}

// Allergy interface
export interface IAllergy {
  name: string;
  severity?: string;
}

// Injury interface
export interface IInjury {
  name?: string;
  year?: number;
  notes?: string;
}

// Lifestyle interface
export interface ILifestyle {
  alcohol?: boolean;
  smoking?: boolean;
  caffeine?: boolean;
  fasting?: boolean;
}

// User interface
export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "doctor" | "admin";
  image?: string;
  age?: number;
  gender?: "male" | "female" | "other";

  // Medical Profile
  medicalConditions?: IMedicalCondition[];
  allergies?: IAllergy[];
  pastInjuries?: IInjury[];

  // Medication History
  currentMedications?: IMedication[];
  pastMedications?: IMedication[];

  // Lifestyle
  lifestyle?: ILifestyle;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

// Update user payload
export interface IUpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  medicalConditions?: IMedicalCondition[];
  allergies?: IAllergy[];
  pastInjuries?: IInjury[];
  currentMedications?: IMedication[];
  pastMedications?: IMedication[];
  lifestyle?: ILifestyle;
}

// API Response types
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code: string;
    details?: unknown;
  };
}
