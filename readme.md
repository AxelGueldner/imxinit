# imxInit

This module will watch given DOM nodes for certain activation types like visible in viewport to trigger an init event.

## Who is this for?

If you want to init DOM node specific JavaScript code in dependency of certain activation types, to not init all your modules at load, then you might find this module helpfull.

## Installing

```
$ npm install imxinit
```
After this you can simply require imxQuery:
```javascript
var imxInit = require('imxinit');
```

## Accessing imxInit

imxInit down to the base, is a simple VanilaJS module. There is one public method given:

### addListener

addListener will register a new listener for a given DOM node
```javascript
imxQuery.addListener({params});
```

#### The params

* **type** - the activation type
* **node** - target node to overwatch
* **initCallback** - callback function that will be executed the first activation time
* **updateCallback** - callback function that will be executed every but the first activation time

#### Activation Types

Currently there are three activation types supported by imxinit:
* **viewport** - will be triggered if the DOM node reaches the browsers viewport
* **hover** - will be triggered if the users mouse hovers the DOM node
* **click** - will be triggered on click of the DOM node

### events

Additional to the callback functions you can register EventListener on two events:
* **imx_init** - will be triggered the first activation time
* **imx_update** - will be triggered every but the first activation time
