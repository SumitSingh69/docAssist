import { Document, Schema, model, Model } from "mongoose";
import { UserGender, UserRole } from "../enums/user.enum.js";
import { hashPassword, compareValue } from "../utils/bcrypt.js";
import crypto from "crypto";
import env from "../config/env.config.js";

// Define interfaces for subdocuments
interface IMedicalCondition {
  name: string;
  diagnosedAt?: Date;
}

interface IMedication {
  name: string;
  dosage?: string;
  frequency?: string;
  startDate?: Date;
  endDate?: Date;
}

interface IAllergy {
  name: string;
  severity?: string;
}

interface IInjury {
  name?: string;
  year?: number;
  notes?: string;
}

// 1. Define the methods interface
interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
  omitPassword(): Omit<UserDocument, "password">;
  generateRefreshToken(): string;
  isRefreshTokenValid(token: string): boolean;
}

// 2. Define the document interface (including methods)
export interface UserDocument extends Document, IUserMethods {
  name: string;
  email: string;
  password: string;
  phone: string;
  image?: string;
  role: UserRole;

  // Refresh Token fields
  refreshToken?: string;
  refreshTokenExpiresAt?: Date;

  // Personal Info
  age?: number;
  gender?: UserGender;

  // Medical Profile
  medicalConditions: IMedicalCondition[];
  allergies: IAllergy[];
  pastInjuries: IInjury[];

  // Medication History
  currentMedications: IMedication[];
  pastMedications: IMedication[];

  // Lifestyle
  lifestyle: {
    alcohol?: boolean;
    smoking?: boolean;
    caffeine?: boolean;
    fasting?: boolean;
  };

  createdAt: Date;
  updatedAt: Date;
}

// 3. Define the Model interface
type UserModel = Model<UserDocument, {}, IUserMethods>;

const MedicalConditionSchema = new Schema<IMedicalCondition>({
  name: { type: String, required: true },
  diagnosedAt: { type: Date },
});

const MedicationSchema = new Schema<IMedication>({
  name: { type: String, required: true },
  dosage: { type: String },
  frequency: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
});

const AllergySchema = new Schema<IAllergy>({
  name: { type: String, required: true },
  severity: { type: String },
});

const InjurySchema = new Schema<IInjury>({
  name: { type: String },
  year: { type: Number },
  notes: { type: String },
});

// 4. Create the schema with full generics
const userSchema = new Schema<UserDocument, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => /^\S+@\S+\.\S+$/.test(v),
        message: "Email is not valid",
      },
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^\d{10}$/.test(v),
        message: "Phone is not valid",
      },
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    refreshTokenExpiresAt: {
      type: Date,
      select: false,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: Object.values(UserGender),
    },
    medicalConditions: {
      type: [MedicalConditionSchema],
      default: [],
    },
    allergies: {
      type: [AllergySchema],
      default: [],
    },
    pastInjuries: {
      type: [InjurySchema],
      default: [],
    },
    currentMedications: {
      type: [MedicationSchema],
      default: [],
    },
    pastMedications: {
      type: [MedicationSchema],
      default: [],
    },
    lifestyle: {
      alcohol: { type: Boolean, default: false },
      smoking: { type: Boolean, default: false },
      caffeine: { type: Boolean, default: false },
      fasting: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ role: 1 });

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }
});

userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete (user as any).password;
  delete (user as any).refreshToken;
  delete (user as any).refreshTokenExpiresAt;
  return user;
};

userSchema.methods.comparePassword = async function (password: string) {
  return compareValue(password, this.password);
};

userSchema.methods.generateRefreshToken = function () {
  const refreshToken = crypto.randomBytes(64).toString("hex");

  const expiresIn = env.JWT_REFRESH_EXPIRES_IN;
  const expiresAt = new Date();

  if (expiresIn.endsWith("d")) {
    const days = parseInt(expiresIn.replace("d", ""), 10);
    expiresAt.setDate(expiresAt.getDate() + (isNaN(days) ? 7 : days));
  } else {
    expiresAt.setDate(expiresAt.getDate() + 7);
  }

  this.refreshToken = refreshToken;
  this.refreshTokenExpiresAt = expiresAt;

  return refreshToken;
};

userSchema.methods.isRefreshTokenValid = function (token: string) {
  return (
    this.refreshToken === token &&
    !!this.refreshTokenExpiresAt &&
    new Date() < this.refreshTokenExpiresAt
  );
};

const User = model<UserDocument, UserModel>("User", userSchema);
export default User;
