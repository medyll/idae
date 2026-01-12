import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import CreateUpdate from './CreateUpdate.svelte';
import { CrudService } from './CrudService';
import { schemeModelDb } from './dbSchema';

describe('CreateUpdate integration', () => {
  it('validates required, type, and FK fields', async () => {
    // Add a FK field to schema for test (before CrudService and render)
    schemeModelDb.agents.fields.team_id = { type: 'fk', fkTarget: 'teams', required: true };
    const crud = new CrudService();
    crud.create('agents', { id: 1, name: 'John', code: 'A1' });
    crud.create('teams', { id: 10, name: 'TeamX' });
    const { getByLabelText, getByText, queryByText, container, getAllByText } = render(CreateUpdate, {
      props: {
        collection: 'agents',
        mode: 'create',
        showFields: ['name', 'code', 'team_id'],
        crud,
        fields: schemeModelDb.agents.fields // pass fields prop for reactivity
      }
    });
    // Assert team_id is a select (FK)
    const teamIdField = getByLabelText('team_id');
    expect(teamIdField.tagName).toBe('SELECT');
    // Try to submit empty form
    await fireEvent.click(getByText('Create'));
    // All fields are required, so expect 3 error messages
    const requiredErrors = getAllByText('This field is required.');
    expect(requiredErrors.length).toBe(3);
    // Fill required fields before testing FK validation
    await fireEvent.input(getByLabelText('name'), { target: { value: 'AgentX' } });
    await fireEvent.input(getByLabelText('code'), { target: { value: 'AX' } });
    // Fill invalid FK (change event for select)
    await fireEvent.change(teamIdField, { target: { value: '999' } });
    // Debug: log the select value after change
    // eslint-disable-next-line no-console
    console.log('Select value after change to invalid:', teamIdField.value);
    await fireEvent.click(getByText('Create'));
    // Debug: log the DOM to see what errors are present
    // eslint-disable-next-line no-console
    console.log('DOM after invalid FK:', container.innerHTML);
    expect(getByText('Invalid reference: not found in teams')).toBeTruthy();
    // Fill valid FK
    await fireEvent.change(teamIdField, { target: { value: '10' } });
    await fireEvent.click(getByText('Create'));
    expect(queryByText('This field is required.')).toBeNull();
    expect(queryByText('Invalid reference: not found in teams')).toBeNull();
    // Check that agent was created
    const agent = crud.list('agents').find(a => a.name === 'AgentX');
    expect(agent).toBeTruthy();
    expect(String(agent.team_id)).toBe('10');
  });
});
