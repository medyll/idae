# Step 3: Initialisation of DataList/CollectionList component

This component displays a collection in grid or list mode, as described in README.md.

**Note: the reference version is in `src/lib/form/CollectionList.svelte`**

## Purpose
- Show items of a collection, with support for grid/list display
- Prepare click event handling and filtering logic

## Structure
- Title with collection name and display mode
- Items rendered in grid or list
- Message if no items

## Main props (CollectionList)

| Prop         | Type                        | Description                                 |
|--------------|-----------------------------|---------------------------------------------|
| collection   | string                      | Collection name                             |
| target       | string (opt.)               | HTML target for modal/CRUD                  |
| displayMode  | 'line' | 'grid' (opt.)       | Display mode                                |
| where        | Where<COL> (opt.)           | Filtering                                   |
| onclick      | (data, idx) => void (opt.)  | Click handler                               |

## Next steps
- Integrate data fetching and filtering
- Implement click event logic
- Connect to schema and CRUD workflow

---
See `src/lib/form/CollectionList.svelte` for up-to-date code.

## Follow-up
- [ ] Integrate data fetching and filtering
- [ ] Implement click event logic
- [ ] Connect to schema and CRUD workflow
- [ ] Svelte 5 syntax alignment
- [ ] PR/backlog link: #61