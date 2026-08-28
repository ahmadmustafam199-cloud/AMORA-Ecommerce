import { ShoppingCart, Heart, Clock, Tag } from "lucide-react";
import { useCart } from "./useCart";
import { Link } from "react-router-dom";

const deals = [
  {
    id: 101,
    name: "Nike Air Max 270",
    category: "Shoes",
    price: 18500,
    oldPrice: 25000,
    discount: 26,
    rating: 4.8,
    reviews: 124,
    stock: 8,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu9bPntlthhgjyxo9S8jkxxrfMHsQFCwz6R0L9bjk_yg&s=10",
  },
  {
    id: 102,
    name: "Smart Watch Series 7",
    category: "Electronics",
    price: 8999,
    oldPrice: 12999,
    discount: 31,
    rating: 4.7,
    reviews: 96,
    stock: 12,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaKSCv5aNPmnlo9EPR-JtIeGP2Gw7mfPGb8KWHHFikCQ&s=10",
  },
  {
    id: 103,
    name: "Premium Travel Bag",
    category: "Bags",
    price: 5499,
    oldPrice: 7999,
    discount: 31,
    rating: 4.6,
    reviews: 78,
    stock: 15,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGR8KLuWIJXLZligmijTLp-0OEPQiqhnAz0Ecy5M2UxQ&s=10",
  },
  {
    id: 104,
    name: "Apple AirPods 4",
    category: "Electronics",
    price: 23999,
    oldPrice: 29999,
    discount: 20,
    rating: 4.9,
    reviews: 187,
    stock: 6,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBxdipreocMp7Lm4XA8wVMnaR4xWDqPuFJGeQ8LD4FYw&s=10",
  },
  {
    id: 105,
    name: "AMORA Premium Cap",
    category: "Accessories",
    price: 1999,
    oldPrice: 2999,
    discount: 33,
    rating: 4.5,
    reviews: 54,
    stock: 20,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-0c-GeulpNZGR3u9-_qBeRn7AKVTlMfc-piLFowHNoA&s=10",
  },
  {
    id: 106,
    name: "Men Casual T-Shirt",
    category: "Clothes",
    price: 2499,
    oldPrice: 3999,
    discount: 38,
    rating: 4.6,
    reviews: 89,
    stock: 18,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVdL6APohxNvFQ3ZAstzOGxf9UnMhRyqKNqLr4LgR1PA&s",
  },
  {
    id: 107,
    name: "Oud Wood Perfume",
    category: "Beauty",
    price: 49999,
    oldPrice: 65999,
    discount: 29,
    rating: 4.8,
    reviews: 67,
    stock: 10,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLyNqYNKTB42VCEy2oGZ9lvvet1ZUOnpsJ1jTyR_rS9w&s=10",
  },
  {
    id: 108,
    name: "BMW Remote Control Car",
    category: "Toys",
    price: 3499,
    oldPrice: 4999,
    discount: 30,
    rating: 4.7,
    reviews: 42,
    stock: 9,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGEeu8u9PO2Ax31ceABqaLh3G9rh8SVBXUS6LOt0MEDg&s=10",
  },
];

const Deals = () => {
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Hero */}
      <section className="rounded-2xl bg-[#071a3a] text-white">
        <div className="mx-auto max-w-7xl p-7 text-center md:p-9">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[12px]">
            <Tag size={14} />
            Exclusive Offers
          </div>

          <h1 className="mb-2 text-4xl font-bold ">
            Amazing Deals
          </h1>

          <p className="mx-auto max-w-2xl text-sm text-white/80">
            Discover premium products at exceptional prices. Grab your
            favorites before these exclusive offers disappear.
          </p>
        </div>
      </section>

      {/* Banner */}
      <section className="relative z-10 mx-auto -mt-6 max-w-7xl px-3">
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-lg md:flex-row ">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#114232]">
              Limited Time Offer
            </p>

            <h2 className="mt-0.5 text-[18px] font-bold text-gray-900">
              Up to 40% OFF
            </h2>

            <p className="mt-0.5 text-sm text-gray-500">
              Shop selected products and enjoy exclusive AMORA discounts.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[#114232]">
            <Clock size={21} />
            <div>
              <p className="text-xs text-gray-500">Hurry up!</p>
              <p className="text-sm font-bold">Limited Stock Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Deals */}
      <section className="mx-auto max-w-7xl p-5 ">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#114232]">
              Best Offers
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
              Today's Deals
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {deals.length} deals
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {deals.map((product) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-42 overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <span className="absolute left-1 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                  -{product.discount}%
                </span>

                <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 hover:text-red-500">
                  <Heart size={17} />
                </button>
              </div>

              {/* Details */}
              <div className="p-2">
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  {product.category}
                </p>

                <h3 className="mt-0.5 truncate text-sm font-bold text-gray-900">
                  {product.name}
                </h3>

                <div className=" mt-0.5 flex items-center gap-1.5 text-sm">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-400">
                    ({product.reviews})
                  </span>
                </div>

                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-sm font-bold text-[#114232]">
                    PKR {product.price.toLocaleString()}
                  </span>

                  <span className="text-xs text-gray-400 line-through">
                    PKR {product.oldPrice.toLocaleString()}
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-gray-500">
                  Only {product.stock} left
                </p>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#071a3a] py-2.5 text-sm font-semibold text-white transition hover:bg-[#29465b]"
                >
                  <ShoppingCart size={17} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-[#071a3a] px-5 py-6 text-center text-white">
          <h2 className="text-2xl font-bold md:text-3xl">
            Don't Miss Our Best Offers
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-white/70">
            New deals are added regularly. Shop now and enjoy quality
            products at exceptional prices.
          </p>

          <Link
  to="/#"
  className="mt-3 inline-block cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#114232] transition hover:bg-gray-100"
>
  Shop Now
</Link>  
             
        
        </div>
      </section>

    </div>
  );
};

export default Deals;