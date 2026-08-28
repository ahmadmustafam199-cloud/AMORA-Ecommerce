import { Pencil, Trash2, Eye } from "lucide-react";

function ProductTable({ products, onDelete, onEdit, onView }) {
  // Common column layout definition for perfect alignment
  const gridLayout = "grid grid-cols-[30px_90px_minmax(120px,1fr)_minmax(150px,1.2fr)_90px_85px_65px_105px] items-center gap-2";

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className={`${gridLayout} border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600`}>
        <div className="text-center">#</div>
        <div>Images</div>
        <div>Product Name</div>
        <div>Description</div>
        <div>Category</div>
        <div className="pl-5">Price</div>
        <div className="text-center">Stock</div>
        <div className="text-center">Actions</div>
      </div>

      {/* Products Body */}
      <div className="divide-y divide-slate-100">
        {products.map((product, index) => {
          const productId = product._id || product.id;

          return (
            <div
              key={productId}
              className={`${gridLayout} px-3 py-2.5 hover:bg-slate-50/80 transition-colors`}
            >
              {/* Number */}
              <div className="text-center text-xs font-medium text-slate-400">
                {index + 1}
              </div>

              {/* Images */}
              <div className="flex items-center gap-1">
                {product.images?.slice(0, 2).map((image, imageIndex) => (
                  <img
                    key={imageIndex}
                    src={
                      image.startsWith("http")
                        ? image
                        : `http://localhost:5000${
                            image.startsWith("/") ? image : `/${image}`
                          }`
                    }
                    alt={product.name}
                    className="h-9 w-9 rounded-md border border-slate-200 object-cover"
                  />
                ))}
              </div>

              {/* Product Name */}
              <div className="min-w-0">
                <h3
                  className="truncate text-xs font-semibold text-slate-800"
                  title={product.name}
                >
                  {product.name}
                </h3>
              </div>

              {/* Description */}
              <div className="min-w-0">
                <p
                  className="truncate text-[11px] text-slate-500"
                  title={product.description}
                >
                  {product.description || "No description"}
                </p>
              </div>

              {/* Category */}
              <div>
                <span className="inline-block truncate max-w-full rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-100">
                  {product.category}
                </span>
              </div>
              

              {/* Price */}
              <div className="whitespace-nowrap text-right
               text-xs font-semibold text-slate-700">
                Rs. {Number(product.price).toLocaleString()}
              </div>

              {/* Stock */}
              <div className="text-center">
                <span
                  className={`inline-block rounded px-1.5 py-0.5 text-[11px] font-medium ${
                    product.stock > 0
                      ? "bg-slate-100 text-slate-700"
                      : "bg-red-50 text-red-600 border border-red-100"
                  }`}
                >
                  {product.stock}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-1">
                {/* EDIT */}
                <button
                  type="button"
                  title="Edit"
                  onClick={() => onEdit(product)}
                  className="flex h-7 w-7 items-center justify-center rounded border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Pencil size={14} />
                </button>

                {/* DELETE */}
                <button
                  type="button"
                  title="Delete"
                  onClick={() => onDelete(productId)}
                  className="flex h-7 w-7 items-center justify-center rounded border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>

                {/* VIEW */}
                <button
                  type="button"
                  title="View"
                  onClick={() => onView(product)}
                  className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Eye size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="py-10 text-center text-xs text-slate-400">
          No products found.
        </div>
      )}
    </div>
  );
}

export default ProductTable;