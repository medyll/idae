// Test unitaire initial pour CrudZone.svelte
import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import CrudZone from '../../_work/CrudZone.svelte';

// Ajout de la configuration jsdom pour Vitest
import { beforeAll } from 'vitest';
beforeAll(() => {
  // Vitest utilise jsdom par défaut si la config est correcte
  // Si besoin, forcer l'environnement :
  // process.env.VITEST_ENV = 'jsdom';
});

describe('CrudZone', () => {
  it('affiche le nom de la collection', () => {
    const { getByText } = render(CrudZone, { props: { collection: 'agents' } });
    expect(getByText('agents')).toBeTruthy();
  });

  it('affiche la liste vide et le message de sélection', () => {
    const { getByText } = render(CrudZone, { props: { collection: 'agents' } });
    expect(getByText('Sélectionnez un élément pour voir le détail.')).toBeTruthy();
  });
});
