import { Pencil, Trash2, Eye, ImageOff } from "lucide-react";

const API_BASE_URL = "https://amora-backend-lake.vercel.app";

function ProductTable({
  products = [],
  onDelete,
  onEdit,
  onView,
}) {
  // =====================================================
  // GRID LAYOUT
  // =====================================================

  const gridLayout =
    "grid grid-cols-[30px_90px_minmax(120px,1fr)_minmax(150px,1.2fr)_90px_85px_65px_105px] items-center gap-2";

  // =====================================================
  // SAFE IMAGE URL
  // =====================================================

  const getImageUrl = (image) => {
    // null, undefined, empty string, number etc.
    if (!image || typeof image !== "string") {
      return "";
    }

    const cleanImage = image.trim();

    if (!cleanImage) {
      return "";
    }

    // Already complete URL
    if (
      cleanImage.startsWith("http://") ||
      cleanImage.startsWith("https://")
    ) {
      return cleanImage;
    }

    // Backend relative path
    if (cleanImage.startsWith("/")) {
      return `${API_BASE_URL}${cleanImage}`;
    }

    return `${API_BASE_URL}/${cleanImage}`;
  };

  // =====================================================
  // SAFE PRODUCT IMAGE
  // =====================================================

  const getProductImages = (product) => {
    if (!product) return [];

    // If images array exists
    if (Array.isArray(product.images)) {
      return product.images
        .filter(
          (image) =>
            typeof image === "string" &&
            image.trim() !== ""
        )
        .slice(0, 2);
    }

    // If only single image exists
    if (
      typeof product.image === "string" &&
      product.image.trim() !== ""
    ) {
      return [product.image];
    }

    return [];
  };

  // =====================================================
  // PRODUCT ID
  // =====================================================

  const getProductId = (product) =>
    product?._id || product?.id;

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className={`${gridLayout} border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600`}
      >
        <div className="text-center">#</div>

        <div>Images</div>

        <div>Product Name</div>

        <div>Description</div>

        <div>Category</div>

        <div className="pl-5">Price</div>

        <div className="text-center">Stock</div>

        <div className="text-center">Actions</div>
      </div>

      {/* =================================================
          PRODUCTS BODY
      ================================================= */}

      <div className="divide-y divide-slate-100">
        {products.map((product, index) => {
          const productId =
            getProductId(product);

          const productImages =
            getProductImages(product);

          return (
            <div
              key={
                productId ||
                `product-${index}`
              }
              className={`${gridLayout} px-3 py-2.5 transition-colors hover:bg-slate-50/80`}
            >
              {/* =================================================
                  NUMBER
              ================================================= */}

              <div className="text-center text-xs font-medium text-slate-400">
                {index + 1}
              </div>

              {/* =================================================
                  IMAGES
              ================================================= */}

              <div className="flex items-center gap-1">
                {productImages.length > 0 ? (
                  productImages.map(
                    (image, imageIndex) => {
                      const imageUrl =
                        getImageUrl(image);

                      return (
                        <div
                          key={`${image}-${imageIndex}`}
                          className="relative h-9 w-9 overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={
                                product.name ||
                                "Product"
                              }
                              className="h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  "none";

                                const fallback =
                                  event.currentTarget
                                    .nextElementSibling;

                                if (
                                  fallback
                                ) {
                                  fallback.style.display =
                                    "flex";
                                }
                              }}
                            />
                          ) : null}

                          {/* Image fallback */}
                          <div
                            className={`${
                              imageUrl
                                ? "hidden"
                                : "flex"
                            } absolute inset-0 items-center justify-center`}
                          >
                            <ImageOff
                              size={15}
                              className="text-slate-300"
                            />
                          </div>
                        </div>
                      );
                    }
                  )
                ) : (
                  /* No image */
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
                    <ImageOff
                      size={15}
                      className="text-slate-300"
                    />
                  </div>
                )}
              </div>

              {/* =================================================
                  PRODUCT NAME
              ================================================= */}

              <div className="min-w-0">
                <h3
                  className="truncate text-xs font-semibold text-slate-800"
                  title={
                    product.name ||
                    "Unnamed Product"
                  }
                >
                  {product.name ||
                    "Unnamed Product"}
                </h3>
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <div className="min-w-0">
                <p
                  className="truncate text-[11px] text-slate-500"
                  title={
                    product.description ||
                    "No description"
                  }
                >
                  {product.description ||
                    "No description"}
                </p>
              </div>

              {/* =================================================
                  CATEGORY
              ================================================= */}

              <div className="min-w-0">
                <span
                  className="inline-block max-w-full truncate rounded border border-emerald-100 bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700"
                  title={
                    product.category ||
                    "Uncategorized"
                  }
                >
                  {product.category ||
                    "Uncategorized"}
                </span>
              </div>

              {/* =================================================
                  PRICE
              ================================================= */}

              <div className="whitespace-nowrap text-right text-xs font-semibold text-slate-700">
                Rs.{" "}
                {Number(
                  product.price || 0
                ).toLocaleString()}
              </div>

              {/* =================================================
                  STOCK
              ================================================= */}

              <div className="text-center">
                <span
                  className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-medium ${
                    Number(
                      product.stock || 0
                    ) > 0
                      ? "bg-slate-100 text-slate-700"
                      : "border border-red-100 bg-red-50 text-red-600"
                  }`}
                >
                  {Number(
                    product.stock || 0
                  )}
                </span>
              </div>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="flex items-center justify-center gap-1">
                {/* EDIT */}

                <button
                  type="button"
                  title="Edit"
                  aria-label="Edit product"
                  onClick={() =>
                    onEdit?.(product)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded border border-blue-200 text-blue-600 transition-colors hover:bg-blue-50"
                >
                  <Pencil size={14} />
                </button>

                {/* DELETE */}

                <button
                  type="button"
                  title="Delete"
                  aria-label="Delete product"
                  onClick={() =>
                    onDelete?.(productId)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded border border-red-200 text-red-500 transition-colors hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>

                {/* VIEW */}

                <button
                  type="button"
                  title="View"
                  aria-label="View product"
                  onClick={() =>
                    onView?.(product)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <Eye size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {products.length === 0 && (
        <div className="py-10 text-center text-xs text-slate-400">
          No products found.
        </div>
      )}
    </div>
  );
}

export default ProductTable;