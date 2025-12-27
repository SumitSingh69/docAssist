"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/hooks/use-axios";
import type { IUser, IUpdateUserPayload, IApiResponse } from "../types";

// Query keys
export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
};

// API functions
const fetchCurrentUser = async (): Promise<IUser> => {
  const response = await axiosInstance.get<IApiResponse<IUser>>("/user/me");
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const updateUserProfile = async (data: {
  payload: IUpdateUserPayload;
  imageFile?: File;
}): Promise<IUser> => {
  const { payload, imageFile } = data;

  if (imageFile) {
    const formData = new FormData();
    formData.append("image", imageFile);

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) {
        if (typeof value === "object") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await axiosInstance.put<IApiResponse<IUser>>(
      "/user/me",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  }

  const response = await axiosInstance.put<IApiResponse<IUser>>(
    "/user/me",
    payload
  );

  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

// Hook for getting current user
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// Hook for updating user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.me(), updatedUser);
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });
}

// Combined hook for convenience
export function useUser() {
  const { data: user, isLoading, error, refetch } = useCurrentUser();
  const updateMutation = useUpdateProfile();

  return {
    user,
    isLoading,
    error: error?.message || null,
    refetch,
    updateProfile: (payload: IUpdateUserPayload, imageFile?: File) =>
      updateMutation.mutateAsync({ payload, imageFile }),
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error?.message || null,
  };
}
