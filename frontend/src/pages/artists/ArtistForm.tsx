// frontend/src/pages/artists/ArtistForm.tsx

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import {
  useGetArtistByIdQuery,
  useCreateArtistMutation,
  useUpdateArtistMutation,
} from "../../store/api/artistApi";
import { ArtistStatus } from "../../types/artist.types";
import type { ArtistCreateRequest, ArtistUpdateRequest } from "../../types/artist.types";
import PageMeta from "../../components/common/PageMeta";

// Define form schema using Zod
const artistFormSchema = z.object({
  name: z.string().min(1, "Artist name is required"),
  bio: z.string().optional(),
  status: z.nativeEnum(ArtistStatus).default(ArtistStatus.ACTIVE),
});

type ArtistFormData = z.infer<typeof artistFormSchema>;

const ArtistForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>(); // 'id' will be present for edit mode

  const isEditMode = !!id;

  const { data: artistData, isLoading: isArtistLoading } = useGetArtistByIdQuery(id!, {
    skip: !isEditMode,
  });
  const [createArtist, { isLoading: isCreating }] = useCreateArtistMutation();
  const [updateArtist, { isLoading: isUpdating }] = useUpdateArtistMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistFormSchema),
    defaultValues: {
      name: "",
      bio: "",
      status: ArtistStatus.ACTIVE,
    },
  });

  useEffect(() => {
    if (isEditMode && artistData?.data) {
      reset({
        name: artistData.data.name,
        bio: artistData.data.bio,
        status: artistData.data.status,
      });
    }
  }, [isEditMode, artistData, reset]);

  const onSubmit = async (data: ArtistFormData) => {
    try {
      if (isEditMode && id) {
        await updateArtist({ id, body: data as ArtistUpdateRequest }).unwrap();
        toast.success("Artist updated successfully!");
      } else {
        await createArtist(data as ArtistCreateRequest).unwrap();
        toast.success("Artist created successfully!");
      }
      navigate("/artists");
    } catch (err) {
      toast.error("Failed to save artist.");
      console.error("Failed to save artist:", err);
    }
  };

  const formTitle = isEditMode ? `Edit Artist: ${artistData?.data?.name || ""}` : "Add New Artist";
  const submitButtonText = isEditMode ? "Update Artist" : "Create Artist";
  const isSubmitting = isCreating || isUpdating;

  if (isEditMode && isArtistLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading artist data...</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={formTitle} description={`${formTitle} form`} />
      <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">{formTitle}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Biography (Optional)
            </label>
            <textarea
              id="bio"
              {...register("bio")}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
            {errors.bio && <p className="mt-2 text-sm text-red-600">{errors.bio.message}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value={ArtistStatus.ACTIVE}>Active</option>
              <option value={ArtistStatus.INACTIVE}>Inactive</option>
            </select>
            {errors.status && <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/artists")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ArtistForm;
