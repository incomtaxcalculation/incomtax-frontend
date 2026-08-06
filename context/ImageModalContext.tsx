"use client"

import React, { createContext, useContext, ReactNode, useState, useCallback } from "react"

interface ImageModalContextType {
  openImageModal: (src: string, alt?: string) => void
  closeImageModal: () => void
  isImageModalOpen: boolean
  selectedImage: { src: string; alt: string } | null
}

const ImageModalContext = createContext<ImageModalContextType | undefined>(undefined)

export function ImageModalProvider({ children }: { children: ReactNode }) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)

  const openImageModal = useCallback((src: string, alt: string = "") => {
    setSelectedImage({ src, alt })
    setIsImageModalOpen(true)
  }, [])

  const closeImageModal = useCallback(() => {
    setIsImageModalOpen(false)
    setSelectedImage(null)
  }, [])

  return (
    <ImageModalContext.Provider value={{ openImageModal, closeImageModal, isImageModalOpen, selectedImage }}>
      {children}
    </ImageModalContext.Provider>
  )
}

export function useImageModal() {
  const context = useContext(ImageModalContext)
  if (context === undefined) {
    throw new Error("useImageModal must be used within an ImageModalProvider")
  }
  return context
}
