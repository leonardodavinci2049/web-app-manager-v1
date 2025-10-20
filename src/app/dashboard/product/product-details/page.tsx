import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SiteHeaderWithBreadcrumb } from "@/components/dashboard/header/site-header-with-breadcrumb";
import {
  ModernProductDetails,
  ModernProductDetailsSkeleton,
} from "@/components/dashboard/product/details/ModernProductDetails";
import { createLogger } from "@/lib/logger";
import { ProductServiceApi } from "@/services/api/product/product-service-api";
import type { ProductDetail } from "@/services/api/product/types/product-types";
import { ProductDetailsParamsSchema } from "./schemas";

const logger = createLogger("ProductDetailsPage");

interface ProductDetailsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Server Component - Fetch data directly
async function ProductDetailsPageContent({ productId }: { productId: number }) {
  let product: ProductDetail | null = null;
  let hasError = false;

  try {
    // Call the API service to get product details
    const response = await ProductServiceApi.findProductById({
      pe_type_business: 1, // Default business type
      pe_id_produto: productId,
      pe_slug_produto: "", // Search by ID, not slug
    });

    // Validate response
    if (!ProductServiceApi.isValidProductDetailResponse(response)) {
      hasError = true;
      logger.error("Invalid product detail response:", response);
    } else {
      product = ProductServiceApi.extractProductDetail(response);
      if (!product) {
        hasError = true;
        logger.error("Product not found in response:", response);
      }
    }
  } catch (error) {
    hasError = true;
    logger.error("Error fetching product details:", error);
  }

  // Show 404 if product not found
  if (hasError || !product) {
    logger.warn(`Product not found or error occurred for ID: ${productId}`);
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-6 py-6">
          <div className="px-4 lg:px-6">
            {/* Modern Product Details */}
            <ModernProductDetails product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ProductDetailsPage({
  searchParams,
}: ProductDetailsPageProps) {
  // Await searchParams as it's a Promise in Next.js 15
  const params = await searchParams;

  // Validate and extract product ID from search params
  let productId: number;

  try {
    const validatedParams = ProductDetailsParamsSchema.parse({
      id: params.id as string,
    });
    productId = validatedParams.id;
  } catch (error) {
    logger.error("Invalid product ID parameter:", error);
    notFound();
  }

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Produtos", href: "#" },
    { label: "Catálogo", href: "/dashboard/product/catalog" },
    { label: "Detalhes", isActive: true },
  ];

  return (
    <>
      <SiteHeaderWithBreadcrumb
        title="Detalhes do Produto"
        breadcrumbItems={breadcrumbItems}
      />

      <Suspense
        fallback={
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-6">
              <div className="flex flex-col gap-6 py-6">
                <div className="px-4 lg:px-6">
                  <ModernProductDetailsSkeleton />
                </div>
              </div>
            </div>
          </div>
        }
      >
        <ProductDetailsPageContent productId={productId} />
      </Suspense>
    </>
  );
}
