# Step 6: Initialisation of dbFields structure

This module defines field types and validation rules, as described in README.md.

## Purpose
- Declare field types and modifiers (required, readonly, private, fk)
- Provide a parser for DSL strings to FieldRule objects

## Structure
- FieldType union type
- FieldRule interface
- FieldsDefinition type
- parseFieldRule function

## Next steps
- Extend parser for more DSL features
- Integrate with schema and form validation

---
See src/_work/dbFields.ts for initial code.