import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
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
import Input from "../../components/form/Input";
import TextArea from "../../components/form/TextArea";
import Select from "../../components/form/Select";
import DatePicker from "../../components/form/DatePicker";

// Define form schema using Zod
const artistFormSchema = z.object({
  name: z.string().min(1, "Artist name is required"),
  bio: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  genres: z.string().optional(),
  debutDate: z.string().optional(),
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
    control,
    formState: { errors },
  } = useForm<ArtistFormData>({
    resolver: zodResolver(artistFormSchema.partial().required({ name: true, status: true })),
    defaultValues: {
      name: "",
      bio: "",
      image: "",
      genres: "",
      debutDate: "",
      status: ArtistStatus.ACTIVE,
    },
  });

  useEffect(() => {
    if (isEditMode && artistData?.data) {
      const artist = artistData.data;
      reset({
        name: artist.name,
        bio: artist.bio || "",
        image: artist.image || "",
        genres: artist.genres?.join(", ") || "",
        debutDate: artist.debutDate ? artist.debutDate.split("T")[0] : "",
        status: artist.status,
      });
    }
  }, [isEditMode, artistData, reset]);

  const onSubmit = async (data: Partial<ArtistFormData>) => {
    const formattedData = {
      ...data,
      genres: data.genres ? data.genres.split(",").map(g => g.trim()).filter(g => g) : [],
      debutDate: data.debutDate || undefined,
    };

    try {
      if (isEditMode && id) {
        await updateArtist({ id, body: formattedData as ArtistUpdateRequest }).unwrap();
        toast.success("Artist updated successfully!");
      } else {
        await createArtist(formattedData as ArtistCreateRequest).unwrap();
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
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading artist data...</p>
      </div>
    );
  }

  return (
    <>
      <PageMeta title={formTitle} description={`${formTitle} form`} />
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 shadow-theme-xs rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{formTitle}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isEditMode ? "Update artist details and preferences." : "Create a new artist profile in the system."}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Artist Name"
                id="name"
                placeholder="Enter artist name"
                {...register("name")}
                error={errors.name?.message}
                required
              />

              <Controller
                name="debutDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="debutDate"
                    label="Debut Date"
                    placeholder="Select debut date"
                    value={field.value}
                    onChange={(dates) => {
                      if (dates && dates.length > 0 && dates[0]) {
                        const date = dates[0];
                        const offset = date.getTimezoneOffset();
                        const localDate = new Date(date.getTime() - offset * 60 * 1000);
                        field.onChange(localDate.toISOString().split("T")[0]);
                      } else {
                        field.onChange("");
                      }
                    }}
                  />
                )}
              />

              <Input
                label="Image URL"
                id="image"
                placeholder="https://example.com/image.jpg"
                {...register("image")}
                error={errors.image?.message}
              />

              <Input
                label="Genres"
                id="genres"
                placeholder="Pop, Rock, Soul"
                hint="Comma-separated values"
                {...register("genres")}
              />

              <Select
                label="Status"
                id="status"
                options={[
                  { label: "Active", value: ArtistStatus.ACTIVE },
                  { label: "Inactive", value: ArtistStatus.INACTIVE },
                ]}
                {...register("status")}
                error={errors.status?.message}
              />
            </div>

            <TextArea
              label="Bio"
              id="bio"
              placeholder="Tell us about the artist..."
              rows={4}
              {...register("bio")}
              error={errors.bio?.message}
            />

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => navigate("/artists")}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : submitButtonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ArtistForm;
