# ManagerQueueOptions

**Type:** [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Object)

<table><thead><tr><th width="232">Parameter</th><th width="212">Type</th><th width="102" align="center">Required</th><th>Description</th></tr></thead><tbody><tr><td>maxPreviousTracks</td><td><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number">number</a></td><td align="center">X</td><td>How many Tracks are allowed to be saved in to queue.previous</td></tr><tr><td>queueStore</td><td><a href="queuestoremanager.md">QueueStoreManager</a></td><td align="center">X</td><td>If it should use a custom <a href="queuestoremanager.md">QueueStoreManager</a>, else it uses the <a href="../../../other-utils-and-classes/defaultqueuestore.md">Default one</a></td></tr><tr><td>queueChangesWatcher</td><td><a href="queuechangeswatcher.md">QueueChangesWatcher</a></td><td align="center">X</td><td>If it should use a custom Queue Changes Watcher</td></tr></tbody></table>

### Interface

```typescript
export interface ManagerQueueOptions {
  maxPreviousTracks?: number;
  queueStore?: QueueStoreManager;
  queueChangesWatcher?: QueueChangesWatcher;
}
```

