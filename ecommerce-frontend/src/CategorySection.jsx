const CATEGORIES = [
  {
    name: "Electronics",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFMDc3gUpBtwQ-DwnjeuC_rvkgSYNY3k39QmodZeMlrA&s=10",
  },
  {
    name: "Clothes",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSk0Qn8Q4D39iSMGLxBtYw-WMpCUCJlK4jWP8cFP5-sA&s=10",
  },
  {
    name: "Sports",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxCAS6OnsPu8yLzyuB6-vyq_N8mRO6BOxi8kVYEw00vA&s=10",
  },
  {
    name: "Home & Kitchen",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwFRsH0tMd-EC7FZimtSCMaaUc0wleLzwKDwh2fYCH_Q&s=10",
  },
  {
    name: "Shoes",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcvsIgS6Xb4m2HQFHGaIDlzmc6zMx7BElWwkVwLaG2lg&s=10",
  },
  {
    name: "Phones",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-24QdYCjmJ4nbdOPAxYQl70kUPE4u5gvj4L-N-Bdnug&s=10",
  },
  {
    name: "Accessories",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJxkDFKrVYE-3qGW13TbddNyOu44rebSZXtzzwqILXug&s=10",
  },
  {
    name: "Beauty",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUlCN2efRPie9x9TmcCxbFmzPYhRgui9LIWc03b8tydQ&s=10",
  },
  {
    name: "Bags",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVNN3y7-hdt8Da-sKdfobiNN3_P2zUSY5TkQPjHIDHYA&s=10",
  },
  {
    name: "Computer",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9Mdsa0_w6rsSQo-ZTxhkkYFeU9EvfVpLWXbAVEh3T8w&s=10",
  },
];

function Categories({ onCategoryClick, selectedCategory }) {
  return (
    <div className="w-full px-3 pt-2">
      <div className="grid grid-cols-10 gap-2">
        {CATEGORIES.map((category, index) => {
          const isSelected = selectedCategory === category.name;

          return (
            <div
              key={`${category.name}-${index}`}
              onClick={() => onCategoryClick(category.name)}
              className={`
                group
                h-24
                w-full
                rounded-xl
                border
                bg-white
                p-2
                flex
                flex-col
                items-center
                justify-center
                shadow-sm
                hover:-translate-y-1
                hover:shadow-lg
                transition-all
                duration-200
                cursor-pointer
                ${
                  isSelected
                    ? "border-orange-500 ring-2 ring-orange-200 shadow-md"
                    : "border-gray-100 hover:border-gray-200"
                }
              `}
            >
              <div className="h-12 w-full flex items-center justify-center">
                <img
                  src={category.image}
                  alt={category.name}
                  className="
                    h-11
                    w-full
                    object-contain
                    group-hover:scale-110
                    transition-transform
                    duration-200
                  "
                />
              </div>

              <h2
                className="
                  mt-2
                  w-full
                  text-[11px]
                  font-serif
                  font-bold
                  text-gray-800
                  text-center
                  truncate
                "
                title={category.name}
              >
                {category.name}
              </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Categories;