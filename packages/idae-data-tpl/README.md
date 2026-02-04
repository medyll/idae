

## Architecture

```mermaid
flowchart LR
  Data[Raw Data] --> Tpl[Template Engine]
  Tpl --> Format[Formatter]
  Format --> Output[Structured Data]
```
