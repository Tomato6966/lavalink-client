# BotClientOptions

**Type:** [class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/class)

<table><thead><tr><th width="141">Parameter</th><th width="96">Type</th><th width="102" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td>id</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td align="center">✓</td><td>The Client-Id for Lavalink Authorization Header</td></tr><tr><td>username</td><td>?<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></td><td align="center">X</td><td>The Client-Username for Lavalink Authorization Header</td></tr></tbody></table>

### Example

```typescript
{
    id: "498094279793704991",
    username: "Amazing Discord Bot"
}
```

### Interface

```typescript
export interface BotClientOptions {
  /** Bot Client Id */
  id: string;
  /** Bot Client Username */
  username?: string;
  /** So users can pass entire objects / classes */
  [x: string | number | symbol | undefined]: any;
}
```
