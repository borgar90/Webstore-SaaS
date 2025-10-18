import type { Category } from './CategoryPill';
import { CategoryPill } from './CategoryPill';

export function CategoryList({ categories }: { categories: Category[] }) {
  return (
    <ul className="categories" id="categories">
      {categories.map((category) => (
        <CategoryPill key={category.id} category={category} />
      ))}
    </ul>
  );
}
