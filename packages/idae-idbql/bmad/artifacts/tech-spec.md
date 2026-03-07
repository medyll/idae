# Tech Spec – @medyll/idae-idbql

## Stack
| Layer | Technology | Justification |
|---|---|---|
| Frontend | Svelte 5 | Modern, reactive UI framework |
| Database | IndexedDB | Native browser DB, async, scalable |
| State | Svelte 5 Runes, idae-stator | Reactive, type-safe state management |
| Test | Vitest, fake-indexeddb | Fast, isolated unit tests |

## System Architecture Overview
- Core: IdbqlIndexedCore manages DB connection, schema, versioning
- Collection: CollectionCore wraps CRUD and query logic
- State: createIdbqlState bridges DB to Svelte 5/idae-stator

## API Design
### Endpoint: N/A (library)
- Purpose: Provide chainable, reactive IndexedDB queries
- Request body: N/A
- Response: Query result (array/object)
- Auth: N/A
- Errors: Throws on invalid query, transaction failure

## Data Model
### Entity: User
| Field | Type | Required | Description |
|---|---|---|---|
| id | number | Yes | Auto-incremented key |
| name | string | Yes | User name |
| age | number | No | User age |

### Entity: Task
| Field | Type | Required | Description |
|---|---|---|---|
| id | number | Yes | Auto-incremented key |
| priority | string | No | Task priority |
| completed | boolean | No | Completion status |

## Integration Points
| System | Type | Auth | Notes |
|---|---|---|---|
| Svelte 5 | UI | N/A | Direct integration |
| idae-stator | State | N/A | Optional engine |

## Security Considerations
- No external data sources; all data stays in browser
- Input validation for queries
- No XSS/injection risk

## Performance Considerations
- IndexedDB async, non-blocking
- Query engine optimized for <50ms typical queries

## Open Technical Questions
- [ ] Should we expose lower-level IndexedDB APIs?
- [ ] Is full MongoDB operator parity required?
- [ ] How to handle browser storage limits?
