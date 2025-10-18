export interface Category {
  id: string;
  label: string;
  count: number;
}

export function CategoryPill({ category }: { category: Category }) {
  return (
    <li className="category-pill" id={`category-${category.id}`}>
      <span>{category.label}</span>
      <span>({category.count})</span>
    </li>
  );
}
