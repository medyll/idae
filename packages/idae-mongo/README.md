

## Architecture

```mermaid
flowchart TD
  IdaeDb[IdaeDb Adapter] --> Mongo[MongoDBAdapter]
  Mongo --> Mongoose[Mongoose Model]
  Mongoose --> DB[(MongoDB)]
```
