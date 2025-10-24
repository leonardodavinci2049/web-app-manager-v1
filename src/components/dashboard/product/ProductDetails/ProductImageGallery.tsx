"use client";

import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Plus,
  X,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { uploadProductImageAction } from "@/app/actions/action-product-images";
// Comentado temporariamente até o componente AlertDialog ser criado
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  productId: number;
  onImageUploadSuccess?: () => void | Promise<void>;
}

export function ProductImageGallery({
  images,
  productName,
  productId,
  onImageUploadSuccess,
}: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomedImageIndex, setZoomedImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [_deleteImageIndex, setDeleteImageIndex] = useState<number | null>(
    null,
  );
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle image loading errors
  const handleImageError = useCallback((index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  }, []);

  // Handle image upload via drag & drop or file input
  const handleImageUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      setIsUploading(true);

      try {
        // Process each file
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          // Validate file type
          if (!file.type.startsWith("image/")) {
            toast.error(
              `${file.name} não é uma imagem válida. Por favor, selecione apenas imagens.`,
            );
            continue;
          }

          // Validate file size (10MB limit)
          if (file.size > 10 * 1024 * 1024) {
            toast.error(
              `${file.name} é muito grande. O limite é 10MB por arquivo.`,
            );
            continue;
          }

          // Create FormData for upload
          const formData = new FormData();
          formData.append("file", file);
          formData.append("productId", productId.toString());
          // Don't send tags to match the working test page pattern

          // Call server action to upload
          const result = await uploadProductImageAction(formData);

          if (result.success) {
            toast.success(`${file.name} enviada com sucesso!`);
          } else {
            toast.error(`Erro ao enviar ${file.name}: ${result.error}`);
          }
        }

        // After all uploads complete, trigger refresh callback
        if (onImageUploadSuccess) {
          await onImageUploadSuccess();
        }
      } catch (error) {
        console.error("Error uploading images:", error);
        toast.error("Erro ao fazer upload das imagens");
      } finally {
        setIsUploading(false);
      }
    },
    [productId, onImageUploadSuccess],
  );

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      handleImageUpload(files);
    },
    [handleImageUpload],
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      handleImageUpload(files);

      // Reset input value so the same file can be selected again
      e.target.value = "";
    },
    [handleImageUpload],
  );

  // Handle image deletion
  const _handleDeleteImage = useCallback(
    async (index: number) => {
      try {
        // Mock deletion process - in real app, this would call an API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success("Imagem removida com sucesso!");

        // In real implementation, you would:
        // 1. Delete image from server/cloud storage
        // 2. Update product images in database
        // 3. Update local state or refresh images

        // If we're deleting the currently selected image, select the first one
        if (index === selectedImageIndex && images.length > 1) {
          setSelectedImageIndex(0);
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        toast.error("Erro ao remover imagem");
      } finally {
        setDeleteImageIndex(null);
      }
    },
    [selectedImageIndex, images.length],
  );

  // Navigation functions for zoom modal
  const navigateZoomedImage = useCallback(
    (direction: "prev" | "next") => {
      if (direction === "prev") {
        setZoomedImageIndex((prev) =>
          prev === 0 ? images.length - 1 : prev - 1,
        );
      } else {
        setZoomedImageIndex((prev) =>
          prev === images.length - 1 ? 0 : prev + 1,
        );
      }
    },
    [images.length],
  );

  // Keyboard navigation for zoom modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isZoomModalOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          navigateZoomedImage("prev");
          break;
        case "ArrowRight":
          e.preventDefault();
          navigateZoomedImage("next");
          break;
        case "Escape":
          e.preventDefault();
          setIsZoomModalOpen(false);
          break;
      }
    },
    [isZoomModalOpen, navigateZoomedImage],
  );

  // Add keyboard event listener
  React.useEffect(() => {
    if (isZoomModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isZoomModalOpen, handleKeyDown]);

  const openZoomModal = useCallback((index: number) => {
    setZoomedImageIndex(index);
    setIsZoomModalOpen(true);
  }, []);

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-square bg-muted group">
            {!imageErrors.has(selectedImageIndex) ? (
              <>
                <Image
                  src={images[selectedImageIndex]}
                  alt={`${productName} - Imagem principal`}
                  fill
                  className="object-cover transition-transform duration-300"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={() => handleImageError(selectedImageIndex)}
                />

                {/* Zoom button - appears on hover */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => openZoomModal(selectedImageIndex)}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>

                {/* Image counter badge */}
                {images.length > 1 && (
                  <Badge variant="secondary" className="absolute left-3 top-3">
                    {selectedImageIndex + 1} de {images.length}
                  </Badge>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-12 w-12" />
                  <p className="text-sm">Imagem não disponível</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Image Gallery Grid */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <Card
            key={`product-gallery-${index}-${productId || "unknown"}`}
            className={`cursor-pointer overflow-hidden transition-all hover:ring-2 hover:ring-primary ${
              selectedImageIndex === index ? "ring-2 ring-primary" : ""
            } ${imageErrors.has(index) ? "opacity-50" : ""}`}
            onClick={() =>
              !imageErrors.has(index) && setSelectedImageIndex(index)
            }
          >
            <CardContent className="p-0 relative">
              <div className="relative aspect-square bg-muted">
                {!imageErrors.has(index) ? (
                  <>
                    <Image
                      src={image}
                      alt={`${productName} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                      onError={() => handleImageError(index)}
                    />

                    {/* Delete button for non-primary images */}
                    {index > 0 && (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -right-1 -top-1 h-6 w-6 opacity-0 hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteImageIndex(index);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Image Button with Drag & Drop */}
        <Card
          className={`cursor-pointer overflow-hidden border-dashed border-2 transition-colors ${
            isDragOver ? "border-primary bg-primary/10" : "hover:border-primary"
          } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="p-0">
            <div className="relative aspect-square bg-muted flex items-center justify-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />

              <div className="flex flex-col items-center gap-1 text-muted-foreground pointer-events-none">
                {isUploading ? (
                  <>
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span className="text-xs">Enviando...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-6 w-6" />
                    <span className="text-xs text-center">
                      {isDragOver ? "Soltar aqui" : "Adicionar"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zoom Modal */}
      <Dialog open={isZoomModalOpen} onOpenChange={setIsZoomModalOpen}>
        <DialogContent className="max-w-5xl h-[80vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center justify-between">
              <span>
                {productName} - Imagem {zoomedImageIndex + 1} de {images.length}
              </span>
              <Badge variant="secondary">
                Use ← → para navegar | ESC para fechar
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="relative flex-1 bg-black">
            {!imageErrors.has(zoomedImageIndex) ? (
              <Image
                src={images[zoomedImageIndex]}
                alt={`${productName} - Ampliada`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1200px) 100vw, 80vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-white">
                  <ImageIcon className="h-16 w-16" />
                  <p>Imagem não disponível</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={() => navigateZoomedImage("prev")}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>

                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => navigateZoomedImage("next")}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - Commented until AlertDialog component is available */}
      {/* 
      <AlertDialog
        open={deleteImageIndex !== null}
        onOpenChange={() => setDeleteImageIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover esta imagem? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteImageIndex !== null && handleDeleteImage(deleteImageIndex)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      */}
    </div>
  );
}
