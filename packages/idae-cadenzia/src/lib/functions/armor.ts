import { armorOptions } from '$lib/constants/constants.js';

/**
 * Récupère une chaîne descriptive pour une armure donnée.
 * Exemple: `getArmorInfo('G')` -> 'G (1♯)' si une valeur est définie.
 *
 * @param armorName - Nom de l'armure/tonalité à chercher
 * @returns Chaîne formatée ou chaîne vide si non trouvée
 */
export function getArmorInfo(armorName: string) {
  const armor = armorOptions.find((a) => a.name === armorName);
  return armor ? `${armor.name}${armor.value ? ` (${armor.value})` : ''}` : '';
}

export default { getArmorInfo };
