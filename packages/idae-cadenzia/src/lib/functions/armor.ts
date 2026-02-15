import { armorOptions } from '$lib/constants/constants.js';

/**
 * Retrieve a descriptive string for a given key/armor.
 * Example: `getArmorInfo('G')` -> 'G (1♯)' when a value is defined.
 *
 * @param armorName - Name of the key/armor to look up
 * @returns Formatted string or an empty string if not found
 */
export function getArmorInfo(armorName: string) {
  const armor = armorOptions.find((a) => a.name === armorName);
  return armor ? `${armor.name}${armor.value ? ` (${armor.value})` : ''}` : '';
}

export default { getArmorInfo };
