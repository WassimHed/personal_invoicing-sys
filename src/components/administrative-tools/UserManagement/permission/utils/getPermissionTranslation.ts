export const getPermissionTranslation = (label?: string) => {
  if (!label) return 'none.none';

  const parts = label.split('_');
  if (parts.length < 2) return label.toLowerCase();
  
  const [, ...entityParts] = parts;
  const entity = entityParts.join('_').toLowerCase();
  const fullLabel = label.toLowerCase();

  return `${entity}.${fullLabel}`;
};
