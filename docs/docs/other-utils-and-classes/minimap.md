---
description: The default Store Option for Players and Nodes.
---

# MiniMap

#### extends [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Map)

## Constructor

```javascript
new MiniMap(data?: [ [key, value], [key, value] ])
```

## <mark style="color:red;">Import</mark>

{% tabs %}
{% tab title="Typescript / ESM" %}
<pre class="language-typescript" data-title="index.ts" data-line-numbers><code class="lang-typescript"><strong>import { MiniMap } from "lavalink-client";
</strong></code></pre>
{% endtab %}

{% tab title="JavaScript (cjs)" %}
{% code title="index.js" lineNumbers="true" %}
```javascript
const { MiniMap } = require("lavalink-client");
```
{% endcode %}
{% endtab %}
{% endtabs %}

## <mark style="color:red;">Overview</mark>

| Properties               | Methods (from Map)                                                | Methods (added)                                                    |
| ------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| [size](minimap.md#.size) | [get](minimap.md#.get-key-any)                                    | [toJSON](minimap.md#.tojson)                                       |
|                          | [set](minimap.md#.set-key-any-value-any)                          | [filter](minimap.md#.filter-fn-value-key-map-greater-than-boolean) |
|                          | [has](minimap.md#.has-key-any)                                    | [map](minimap.md#.map-fn-value-key-map-greater-than-any)           |
|                          | [delete](minimap.md#.delete-key-any)                              |                                                                    |
|                          | [clear](minimap.md#.clear)                                        |                                                                    |
|                          | [entries](minimap.md#.entries)                                    |                                                                    |
|                          | [values](minimap.md#.values)                                      |                                                                    |
|                          | [keys](minimap.md#.keys)                                          |                                                                    |
|                          | [forEach](minimap.md#.foreach-fn-value-key-map-greater-than-void) |                                                                    |

***

## <mark style="color:blue;">Properties</mark>

### <mark style="color:blue;">.size</mark>

> _Returns the Amount of entries_

**Type**: [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Number)

## <mark style="color:purple;">Methods</mark>

### <mark style="color:purple;">.get(key:</mark>any<mark style="color:purple;">)</mark>

> _Get a value of a key_

**Returns**: any

### <mark style="color:purple;">.set(key:</mark>any<mark style="color:purple;">, value:</mark>any<mark style="color:purple;">)</mark>

> _Sets a Value into a key, if Key already exists then it gets overridden_

**Returns**: value:any

### <mark style="color:purple;">.has(key:</mark>any<mark style="color:purple;">)</mark>

> _Checks if the key is existing or not_

**Returns**: [boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

### <mark style="color:purple;">.delete(key:</mark>any<mark style="color:purple;">)</mark>

> _Deletes a key, if available, if not available nothing will happen_

**Returns**: any

### <mark style="color:purple;">.clear(</mark><mark style="color:purple;">)</mark>

> _Clears the entire Map_

**Returns**: [void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)

### <mark style="color:purple;">.entries(</mark><mark style="color:purple;">)</mark>

> _Get an iterator of all entries, if you want to put the entries into an array do this:_
>
> _\`\[...map.entries()]\`_

**Returns**: [IterableIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration\_protocols?retiredLocale=de)<\[Key,Value]>

### <mark style="color:purple;">.values()</mark>

> _Get an iterator of all values, if you want to put the entries into an array do this:_
>
> _\`\[...map.values()]\`_

**Returns**: [IterableIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration\_protocols?retiredLocale=de)<\[Value]>

### <mark style="color:purple;">.keys()</mark>

> _Get an iterator of all keys, if you want to put the entries into an array do this:_
>
> _\`\[...map.keys()]\`_

**Returns**: [IterableIterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration\_protocols?retiredLocale=de)<\[Key]>

### <mark style="color:purple;">.forEach(fn:</mark>(value,key,map)=>[void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)<mark style="color:purple;">)</mark>

> _Run a function upon every entry._

**Returns**: [void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)

## <mark style="color:red;">Extended Methods</mark>

### <mark style="color:red;">.map(fn</mark><mark style="color:purple;">:</mark>(value,key,map)=>any<mark style="color:red;">)</mark>

> _Run a function upon every entry._

**Returns**: [void](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)

### <mark style="color:red;">.filter(fn</mark><mark style="color:purple;">:</mark>(value,key,map)=>[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)<mark style="color:red;">)</mark>

> _Identical to_ [Array.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Array/filter), but returns a [MiniMap ](minimap.md)instead of an [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Array).

**Returns**: [MiniMap](minimap.md)\<Key, Value>

### <mark style="color:red;">.toJSON(</mark><mark style="color:red;">)</mark>

> Returns the Map to a JSON like value, just executes [this.entries](minimap.md#.entries) and formats is an array instead

**Returns**: \[Key, Value]\[]
