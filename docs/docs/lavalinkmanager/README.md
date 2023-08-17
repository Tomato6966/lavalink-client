---
description: The main Base-Manager of this Package
---

# LavalinkManager

_Extends_ [_node:EventEmitter_](https://nodejs.org/dist/latest/docs/api/events.html#events\_class\_eventemitter)

### <mark style="color:red;">Import</mark>

{% tabs %}
{% tab title="Typescript / ESM" %}
<pre class="language-typescript" data-title="index.ts" data-line-numbers><code class="lang-typescript"><strong>import { LavalinkManager } from "lavalink-client";
</strong></code></pre>
{% endtab %}

{% tab title="JavaScript (cjs)" %}
{% code title="index.js" lineNumbers="true" %}
```javascript
const { LavalinkManager } = require("lavalink-client");
```
{% endcode %}
{% endtab %}
{% endtabs %}

### <mark style="color:red;">Overview</mark>

{% tabs %}
{% tab title="Properties" %}
* initiated
* useable
* options
* players
* nodeManager
* utils
{% endtab %}

{% tab title="Methods" %}

{% endtab %}
{% endtabs %}

### <mark style="color:blue;">Properties</mark>

#### <mark style="color:blue;">.initated</mark>

_If the_ [_LavalinkManager_](./) _was initated_

**Type**: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

#### <mark style="color:blue;">.useable</mark>

_If the_ [_LavalinkManager_](./) _is useable (If at least 1 Node is connected)_

**Type**: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/Boolean)

#### <mark style="color:blue;">.options</mark>

_The options from the_ [_LavalinkManager_](./)

**Type**: [ManagerOptions](manager-options.md)

#### <mark style="color:blue;">.players</mark>

All the Players of the [_LavalinkManager_](./)

**Type**_:_ [_MiniMap_](../managerutils/minimap.md)_\<guildId:string,_ [_Player_](../player.md)_>_

#### <mark style="color:blue;">.nodeManager</mark>

The Node Manager of the [_LavalinkManager_](./)

**Type**_:_ [_NodeManager_](../nodemanager.md)

#### <mark style="color:blue;">.utils</mark>

The [_LavalinkManager_](./)_'s Utils_

**Type**_:_ [_ManagerUtils_](../managerutils/)

### <mark style="color:purple;">Methods</mark>
