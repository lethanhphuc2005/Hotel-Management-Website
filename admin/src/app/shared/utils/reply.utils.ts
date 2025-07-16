export interface HasIdParent {
  id: string;
  parent_id?: string | null;
  children?: HasIdParent[]; // thêm children
}

export function buildCommentTree<T extends HasIdParent>(items: T[]): T[] {
  const itemMap: Record<string, T & { children: T[] }> = {};

  // Bước 1: Khởi tạo map
  items.forEach(item => {
    itemMap[item.id] = { ...item, children: [] };
  });

  const tree: T[] = [];

  // Bước 2: Gắn vào parent
  items.forEach(item => {
    if (item.parent_id && itemMap[item.parent_id]) {
      itemMap[item.parent_id].children.push(itemMap[item.id]);
    } else {
      tree.push(itemMap[item.id]);
    }
  });

  return tree;
}
