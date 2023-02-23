type Entity<Key extends string> = {
  [key in Key]: string;
} & {
  id: number;
};

type NamedEntity = Entity<"name">;

export type NameHashMap = Record<string, number>;

function getHashMap<Key extends string>(
  entities: Entity<Key>[],
  key: Key
): NameHashMap {
  return entities.reduce((acc, entity) => {
    const entityName = entity[key]?.toLowerCase();
    if (entityName != null) {
      acc[entityName] = entity.id;
    }
    return acc;
  }, {} as NameHashMap);
}

function getNameHashMap(entities: NamedEntity[]): NameHashMap {
  return getHashMap(entities, "name");
}

export { getHashMap, getNameHashMap };
