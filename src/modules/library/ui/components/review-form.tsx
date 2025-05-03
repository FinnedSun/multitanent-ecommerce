import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarPicker } from "@/components/star-picker";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { ReviewGetOneOutput } from "@/modules/reviews/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
  initialData?: ReviewGetOneOutput;
}

const reviewFormSchema = z.object({
  rating: z.number().min(1, { message: "Reting is required" }).max(5),
  description: z.string().min(3, { message: "Description is required" }),
});

export const ReviewForm = ({
  productId,
  initialData
}: ReviewFormProps) => {
  const [isPreview, setIsPreview] = useState(!!initialData);

  const trpc = useTRPC();
  const queryClient = useQueryClient()
  const createReview = useMutation(trpc.reviews.create.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({ productId }))
      setIsPreview(true);
    },
    onError: (error) => {
      toast.error(error.message);
      setIsPreview(false);
    }
  }))

  const updateReview = useMutation(trpc.reviews.update.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({ productId }))
      setIsPreview(true);
    },
    onError: (error) => {
      toast.error(error.message);
      setIsPreview(false);
    }
  }))

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      description: initialData?.description || "",
    },
  });

  const onSubmit = (values: z.infer<typeof reviewFormSchema>) => {
    if (initialData) {
      updateReview.mutate({
        reviewId: initialData.id,
        rating: values.rating,
        description: values.description,
      })
    } else {
      createReview.mutate({
        productId,
        rating: values.rating,
        description: values.description,
      })
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <p className="font-medium">
          {isPreview ? "Your rating:" : "Like it? give it a rating!"}
        </p>
        <FormField
          control={form.control}
          name={"rating"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <StarPicker
                  {...field}
                  disabled={isPreview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"description"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Write your review here"
                  disabled={isPreview}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isPreview && (
          <Button
            variant={"eleveted"}
            disabled={createReview.isPending || updateReview.isPending}
            type="submit"
            size={"lg"}
            className="text-white bg-black hover:bg-pink-400 hover:text-primary w-fit"
          >
            {initialData ? "Update review" : "Post review"}
          </Button>
        )}
      </form>
      {isPreview && (
        <Button
          onClick={() => setIsPreview(false)}
          size={"lg"}
          type="button"
          variant={"eleveted"}
          className="w-fit mt-4"
        >
          Edit
        </Button>
      )}
    </Form>
  )
}

export const ReviewFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <p className="font-medium">
        Like it? give it a rating!
      </p>

      <StarPicker disabled />

      <Textarea
        placeholder="Write your review here"
        disabled
      />

      <Button
        variant={"eleveted"}
        disabled
        type="button"
        size={"lg"}
        className="text-white bg-black hover:bg-pink-400 hover:text-primary w-fit"
      >
        Post review
      </Button>
    </div>
  )
}