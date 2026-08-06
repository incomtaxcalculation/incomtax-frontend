"use client"

import { ImageModal } from "@/components/ui/ImageModal"
import { useImageModal } from "@/context/ImageModalContext"

export function GlobalImageModal() {
  const { selectedImage, isImageModalOpen, closeImageModal } = useImageModal()

  if (!selectedImage) return null

  return (
    <ImageModal
      src={selectedImage.src}
      alt={selectedImage.alt}
      isOpen={isImageModalOpen}
      onClose={closeImageModal}
    />
  )
}
