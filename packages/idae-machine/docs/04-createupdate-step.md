# Step 4: Initialisation of CreateUpdate component

This component provides a form for creating, updating, or viewing records, as described in README.md.

**Note: the reference version is in `src/lib/form/CreateUpdate.svelte`**

## Purpose
- Render a form for selected fields
- Support create, update, and show modes
- Prepare for foreign key section

## Structure
- Title with collection and mode
- Form with fields
- Submit button (if not in show mode)
- Foreign keys section (placeholder)

## Main props (CreateUpdate)

| Prop         | Type                              | Description                                 |
|--------------|-----------------------------------|---------------------------------------------|
| collection   | string                            | Collection name                             |
| mode         | 'create' | 'update' | 'show'      | Form mode                                   |
| data         | Record<string, any> (opt.)        | Data to edit                                |
| dataId       | any (opt.)                        | ID of the record                            |
| showFields   | string[] (opt.)                   | Fields to show                              |
| inPlaceEdit  | boolean | string[] (opt.)          | Allow in-place edit                         |
| displayMode  | 'vertical' | 'wrap' (opt.)         | Display mode                                |
| showFks      | boolean (opt.)                    | Show foreign keys section                   |

## Next steps
- Implement form logic and validation
- Integrate with schema and CRUD workflow
- Add FK support

---
See `src/lib/form/CreateUpdate.svelte` for up-to-date code.

## Follow-up
- [ ] Implement form logic and validation
- [ ] Integrate with schema and CRUD workflow
- [ ] Add FK support
- [ ] Svelte 5 syntax alignment
- [ ] PR/backlog link: #61