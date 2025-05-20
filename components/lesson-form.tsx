"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button, Input, Textarea } from "@heroui/react"
import { Trash, Plus, Video, Paperclip } from "lucide-react"

const attachmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Please enter a valid URL"),
  type: z.string().min(1, "Type is required"),
  size: z.string().optional(),
})

const lessonSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.string().min(1, "Duration is required"),
  videoUrl: z.string().url("Please enter a valid YouTube or Google Drive URL"),
  attachments: z.array(attachmentSchema).optional().default([]),
})

export type LessonFormValues = z.infer<typeof lessonSchema>

interface LessonFormProps {
  onSubmit: (data: LessonFormValues) => void
  onCancel?: () => void
  defaultValues?: Partial<LessonFormValues>
}

export function LessonForm({ onSubmit, onCancel, defaultValues }: LessonFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<LessonFormValues>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      id: defaultValues?.id || "",
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      duration: defaultValues?.duration || "",
      videoUrl: defaultValues?.videoUrl || "",
      attachments: defaultValues?.attachments || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "attachments",
  })

  const handleAddAttachment = () => {
    append({
      id: Date.now().toString(),
      name: "",
      url: "",
      type: "pdf",
      size: "",
    })
  }

  const handleFormSubmit = (data: LessonFormValues) => {
    setIsSubmitting(true)

    // Add id if not present (new lesson)
    if (!data.id) {
      data.id = `lesson-${Date.now()}`
    }

    setTimeout(() => {
      onSubmit(data)
      setIsSubmitting(false)
    }, 500)
  }

  const videoUrl = watch("videoUrl")

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Lesson Title
        </label>
        <Input
          id="title"
          placeholder="Enter lesson title"
          variant="bordered"
          {...register("title")}
          isInvalid={!!errors.title}
          errorMessage={errors.title?.message}
          className="bg-background border-[#333333]"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          placeholder="Enter lesson description"
          variant="bordered"
          {...register("description")}
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
          className="bg-background border-[#333333] min-h-[120px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="duration" className="block text-sm font-medium">
            Duration
          </label>
          <Input
            id="duration"
            placeholder="e.g. 45 min"
            variant="bordered"
            {...register("duration")}
            isInvalid={!!errors.duration}
            errorMessage={errors.duration?.message}
            className="bg-background border-[#333333]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="videoUrl" className="block text-sm font-medium">
            Video URL
          </label>
          <div className="flex gap-2">
            <Input
              id="videoUrl"
              placeholder="YouTube or Google Drive URL"
              variant="bordered"
              {...register("videoUrl")}
              isInvalid={!!errors.videoUrl}
              errorMessage={errors.videoUrl?.message}
              className="bg-background border-[#333333]"
            />
            <Button
              type="button"
              variant="bordered"
              isIconOnly
              className="border-[#333333] hover:bg-background"
              onClick={() => window.open(videoUrl, "_blank")}
              disabled={!videoUrl}
            >
              <Video className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-gray-400 text-xs">Enter a YouTube or Google Drive video URL</p>
        </div>
      </div>

      <div className="bg-[#1e1e1e] border border-[#333333] rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-bold">Attachments</h4>
          <Button
            type="button"
            onClick={handleAddAttachment}
            variant="bordered"
            size="sm"
            startContent={<Plus className="h-4 w-4" />}
            className="h-8 border-[#333333] hover:bg-background"
          >
            Add
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <Paperclip className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>No attachments added yet</p>
            <p className="text-sm">Add course materials for your students</p>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 bg-background rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Attachment {index + 1}</h4>
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="light"
                    size="sm"
                    isIconOnly
                    className="h-8 text-red-500 hover:text-red-400"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Name</label>
                    <Input
                      placeholder="e.g. Course Syllabus"
                      variant="bordered"
                      {...register(`attachments.${index}.name` as const)}
                      isInvalid={!!errors.attachments?.[index]?.name}
                      errorMessage={errors.attachments?.[index]?.name?.message}
                      className="bg-[#1e1e1e] border-[#333333]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Type</label>
                    <Input
                      placeholder="e.g. pdf"
                      variant="bordered"
                      {...register(`attachments.${index}.type` as const)}
                      isInvalid={!!errors.attachments?.[index]?.type}
                      errorMessage={errors.attachments?.[index]?.type?.message}
                      className="bg-[#1e1e1e] border-[#333333]"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="block text-sm font-medium">URL</label>
                  <Input
                    placeholder="https://example.com/file.pdf"
                    variant="bordered"
                    {...register(`attachments.${index}.url` as const)}
                    isInvalid={!!errors.attachments?.[index]?.url}
                    errorMessage={errors.attachments?.[index]?.url?.message}
                    className="bg-[#1e1e1e] border-[#333333]"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <label className="block text-sm font-medium">Size (optional)</label>
                  <Input
                    placeholder="e.g. 1.2 MB"
                    variant="bordered"
                    {...register(`attachments.${index}.size` as const)}
                    className="bg-[#1e1e1e] border-[#333333]"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="bordered" className="border-[#333333] hover:bg-background">
            Cancel
          </Button>
        )}
        <Button type="submit" color="primary" isLoading={isSubmitting} className="bg-primary hover:bg-[#d10021]">
          {isSubmitting ? "Saving..." : defaultValues?.id ? "Update Lesson" : "Create Lesson"}
        </Button>
      </div>
    </form>
  )
}
