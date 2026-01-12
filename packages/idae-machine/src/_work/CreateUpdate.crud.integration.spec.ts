import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import CreateUpdate from './CreateUpdate.svelte';
import { CrudService } from './CrudService';
import { schemeModelDb } from './dbSchema';

describe('CreateUpdate integration - CRUD and edge cases', () => {
  it('creates a new agent with valid data', async () => {
    schemeModelDb.agents.fields.team_id = { type: 'fk', fkTarget: 'teams', required: true };
    const crud = new CrudService();
    crud.create('teams', { id: 10, name: 'TeamX' });
    const { getByLabelText, getByText, queryByText } = render(CreateUpdate, {
      props: {
        collection: 'agents',
        mode: 'create',
        showFields: ['name', 'code', 'team_id'],
        crud,
        fields: schemeModelDb.agents.fields
      }
    });
    await fireEvent.input(getByLabelText('name'), { target: { value: 'AgentY' } });
    await fireEvent.input(getByLabelText('code'), { target: { value: 'AY' } });
    await fireEvent.change(getByLabelText('team_id'), { target: { value: '10' } });
    await fireEvent.click(getByText('Create'));
    expect(queryByText('This field is required.')).toBeNull();
    expect(queryByText('Invalid reference: not found in teams')).toBeNull();
    const agent = crud.list('agents').find(a => a.name === 'AgentY');
    expect(agent).toBeTruthy();
    expect(String(agent.team_id)).toBe('10');
  });

  it('prevents creation with duplicate code', async () => {
    schemeModelDb.agents.fields.team_id = { type: 'fk', fkTarget: 'teams', required: true };
    const crud = new CrudService();
    crud.create('agents', { id: 1, name: 'John', code: 'A1', team_id: 10 });
    crud.create('teams', { id: 10, name: 'TeamX' });
    const { getByLabelText, getByText, queryByText } = render(CreateUpdate, {
      props: {
        collection: 'agents',
        mode: 'create',
        showFields: ['name', 'code', 'team_id'],
        crud,
        fields: schemeModelDb.agents.fields
      }
    });
    await fireEvent.input(getByLabelText('name'), { target: { value: 'Jane' } });
    await fireEvent.input(getByLabelText('code'), { target: { value: 'A1' } });
    await fireEvent.change(getByLabelText('team_id'), { target: { value: '10' } });
    await fireEvent.click(getByText('Create'));
    // Assuming your validation logic prevents duplicate codes and shows an error
    expect(queryByText('Duplicate code')).toBeTruthy();
    const agent = crud.list('agents').find(a => a.name === 'Jane');
    expect(agent).toBeFalsy();
  });

  it('edits an existing agent and updates values', async () => {
    schemeModelDb.agents.fields.team_id = { type: 'fk', fkTarget: 'teams', required: true };
    const crud = new CrudService();
    crud.create('agents', { id: 1, name: 'John', code: 'A1', team_id: 10 });
    crud.create('teams', { id: 10, name: 'TeamX' });
    const { getByLabelText, getByText, queryByText } = render(CreateUpdate, {
      props: {
        collection: 'agents',
        mode: 'edit',
        showFields: ['name', 'code', 'team_id'],
        crud,
        fields: schemeModelDb.agents.fields,
        item: { id: 1, name: 'John', code: 'A1', team_id: 10 }
      }
    });
    await fireEvent.input(getByLabelText('name'), { target: { value: 'Johnny' } });
    await fireEvent.input(getByLabelText('code'), { target: { value: 'A1' } });
    await fireEvent.change(getByLabelText('team_id'), { target: { value: '10' } });
    await fireEvent.click(getByText('Update'));
    // Check that no required or duplicate errors are present
    expect(queryByText('This field is required.')).toBeNull();
    expect(queryByText('Duplicate code')).toBeNull();
    const agent = crud.list('agents').find(a => a.id === 1);
    expect(agent.name).toBe('Johnny');
  });

  it('deletes an agent after confirmation', async () => {
    schemeModelDb.agents.fields.team_id = { type: 'fk', fkTarget: 'teams', required: true };
    const crud = new CrudService();
    crud.create('agents', { id: 1, name: 'John', code: 'A1', team_id: 10 });
    crud.create('teams', { id: 10, name: 'TeamX' });
    const { getByText, queryByText } = render(CreateUpdate, {
      props: {
        collection: 'agents',
        mode: 'edit',
        showFields: ['name', 'code', 'team_id'],
        crud,
        fields: schemeModelDb.agents.fields,
        item: { id: 1, name: 'John', code: 'A1', team_id: 10 }
      }
    });
    await fireEvent.click(getByText('Delete'));
    // Simulate confirmation dialog (if present)
    // If your UI requires a second click to confirm, add it here
    // await fireEvent.click(getByText('Confirm'));
    // For now, assume delete is immediate
    expect(crud.list('agents').find(a => a.id === 1)).toBeFalsy();
    expect(queryByText('This field is required.')).toBeNull();
  });
});
