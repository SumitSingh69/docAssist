import { ErrorCodeEnum } from "../enums/error-code.enum.js";
import User, { type UserDocument } from "../models/user.model.js";
import { BadRequestException, NotFoundException } from "../utils/AppError.js";
import type { UpdateUserType } from "../validators/user.validator.js";

export const getCurrentUserService = async (user: UserDocument) => {
  if (!user) {
    throw new BadRequestException(
      "User not found",
      ErrorCodeEnum.AUTH_USER_NOT_FOUND
    );
  }

  return user;
};

export const updateUserService = async (
  userId: string,
  updateData: UpdateUserType & { image?: string }
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundException(
      "User not found",
      ErrorCodeEnum.AUTH_USER_NOT_FOUND
    );
  }

  // Update basic fields
  if (updateData.name) user.name = updateData.name;
  if (updateData.email) user.email = updateData.email;
  if (updateData.phone) user.phone = updateData.phone;
  if (updateData.image) user.image = updateData.image;
  if (updateData.age) user.age = updateData.age;
  if (updateData.gender) user.gender = updateData.gender as any;

  // Update medical profile
  if (updateData.medicalConditions)
    user.medicalConditions = updateData.medicalConditions as any;
  if (updateData.allergies) user.allergies = updateData.allergies as any;
  if (updateData.pastInjuries)
    user.pastInjuries = updateData.pastInjuries as any;

  // Update medication history
  if (updateData.currentMedications)
    user.currentMedications = updateData.currentMedications as any;
  if (updateData.pastMedications)
    user.pastMedications = updateData.pastMedications as any;

  // Update lifestyle (handle optional properties)
  if (updateData.lifestyle) {
    user.lifestyle = {
      alcohol: updateData.lifestyle.alcohol ?? user.lifestyle.alcohol ?? false,
      smoking: updateData.lifestyle.smoking ?? user.lifestyle.smoking ?? false,
      caffeine:
        updateData.lifestyle.caffeine ?? user.lifestyle.caffeine ?? false,
      fasting: updateData.lifestyle.fasting ?? user.lifestyle.fasting ?? false,
    };
  }

  await user.save();

  return user.omitPassword();
};
