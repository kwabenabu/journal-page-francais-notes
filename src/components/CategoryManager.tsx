
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Tag } from "lucide-react";
import { categoryService, Category } from "../services/categoryService";

interface CategoryManagerProps {
  onCategorySelect?: (category: Category | null) => void;
  selectedCategory?: Category | null;
  className?: string;
}

const CategoryManager = ({ onCategorySelect, selectedCategory, className = "" }: CategoryManagerProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#3B82F6");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predefinedColors = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B", 
    "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await categoryService.getCategories();
      if (error) {
        setError("Failed to load categories");
        console.error("Error loading categories:", error);
      } else if (data) {
        setCategories(data);
      }
    } catch (err) {
      setError("Failed to load categories");
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const { data, error } = await categoryService.createCategory(newCategoryName.trim(), newCategoryColor);
      if (error) {
        setError("Failed to create category");
        console.error("Error creating category:", error);
      } else if (data) {
        setCategories(prev => [...prev, data]);
        setNewCategoryName("");
        setNewCategoryColor("#3B82F6");
        setIsCreating(false);
      }
    } catch (err) {
      setError("Failed to create category");
      console.error("Error creating category:", err);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) return;

    try {
      const { data, error } = await categoryService.updateCategory(
        editingCategory.id, 
        newCategoryName.trim(), 
        newCategoryColor
      );
      if (error) {
        setError("Failed to update category");
        console.error("Error updating category:", error);
      } else if (data) {
        setCategories(prev => prev.map(cat => cat.id === data.id ? data : cat));
        setEditingCategory(null);
        setNewCategoryName("");
        setNewCategoryColor("#3B82F6");
      }
    } catch (err) {
      setError("Failed to update category");
      console.error("Error updating category:", err);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete the category "${category.name}"?`)) return;

    try {
      const { error } = await categoryService.deleteCategory(category.id);
      if (error) {
        setError("Failed to delete category");
        console.error("Error deleting category:", error);
      } else {
        setCategories(prev => prev.filter(cat => cat.id !== category.id));
        if (selectedCategory?.id === category.id) {
          onCategorySelect?.(null);
        }
      }
    } catch (err) {
      setError("Failed to delete category");
      console.error("Error deleting category:", err);
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryColor(category.color);
    setIsCreating(false);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setIsCreating(false);
    setNewCategoryName("");
    setNewCategoryColor("#3B82F6");
  };

  if (loading) {
    return <div className="text-center py-4">Loading categories...</div>;
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800">Categories</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
          title="Add Category"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {(isCreating || editingCategory) && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-3">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Color:</span>
              {predefinedColors.map(color => (
                <button
                  key={color}
                  onClick={() => setNewCategoryColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    newCategoryColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                {editingCategory ? 'Update' : 'Create'}
              </button>
              <button
                onClick={cancelEditing}
                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={() => onCategorySelect?.(null)}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
            !selectedCategory ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'
          } border`}
        >
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">All Entries</span>
          </div>
        </button>

        {categories.map(category => (
          <div
            key={category.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              selectedCategory?.id === category.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <button
              onClick={() => onCategorySelect?.(category)}
              className="flex items-center space-x-2 flex-1 text-left"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
            <div className="flex space-x-1">
              <button
                onClick={() => startEditing(category)}
                className="text-gray-400 hover:text-blue-600 p-1"
                title="Edit Category"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleDeleteCategory(category)}
                className="text-gray-400 hover:text-red-600 p-1"
                title="Delete Category"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !isCreating && (
        <div className="text-center py-8 text-gray-500">
          <Tag className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No categories yet.</p>
          <p className="text-xs">Create your first category to organize your entries!</p>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
