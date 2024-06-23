let globalPrefix = "";
let globalSuffix = "";
let lastId = 0;

export default function nextId(localPrefix?: string | null): string {
  lastId++;
  return `${localPrefix || globalPrefix}${lastId}${globalSuffix}`;
}

export const resetId = (): void => {
  lastId = 0;
};

export const setGlobalPrefix = (newPrefix: string): void => {
  globalPrefix = newPrefix;
};

export const setGlobalSuffix = (newSuffix: string): void => {
  globalSuffix = newSuffix;
};

// uniquly setting the prefix and suffix for each component
//        Checkbox with id: input-3-checkbox
//        Input with id:input-1-checkbox