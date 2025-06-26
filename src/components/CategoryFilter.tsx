
interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex overflow-x-auto space-x-4 scrollbar-hide">
          <button
            onClick={() => onCategoryChange("all")}
            className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeCategory === "all"
                ? "bg-cardapio-green text-white shadow-md"
                : "bg-gray-100 text-cardapio-text hover:bg-gray-200"
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium transition-all flex items-center space-x-2 ${
                activeCategory === category.id
                  ? "bg-cardapio-green text-white shadow-md"
                  : "bg-gray-100 text-cardapio-text hover:bg-gray-200"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
