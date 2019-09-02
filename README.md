# Typed Attribute-Based Access Control module

## Conditions

Conditions are the core logic in this library. They defines how to restrict users to certain actions.

Any condition must be a function with 1 required argument - user object to test. 2nd optional argument is a `Context Target`. For example, if you are creating a Tabac rules for an order module of your app - the `Context Target` apperantly should be an order object.

Any additional arguments will be passed as is.

## Methods

Any instance of the Tabac has some methods.

### **addRule**

Simple method to add a rule with one or more conditions.

Arguments:

| Argument name | Type | Description |
| --- | --- | --- |
| `name` | `String` | Name of the rule in the map |
| `condition` | `Function` or `Array` | Checks the access  |

### **addRules**

Almost the same as `addRule`, but you can add bunch of rules at a time.

Arguments:

| Argument name | Type | Description |
| --- | --- | --- |
| `ruleMap` | `Object` | Map of rules. key is the name of rule, value - 1 or more conditions |

### **can**

Checks if certain user and target satisfies at least 1 condition.

Arguments:

| Argument name | Type | Description |
| --- | --- | --- |
| `nameOrRegexp` | `String` or `RegExp` | Name of the rule to check, or RegExp to find a list of rules that match that regular expression |
| `user` | `Object` | User object to test |
| `target`? | `Object` | Context Target object to test |
| `...args`? | `any` | Additional arguments if needed |

## Example

```ts
// Any point at your application
interface IUser {
  id: number;
  role: string;
}

interface IOrder {
  author: number;
  status: string;
}

const OrderTabac = new Tabac<IUser, IOrder>({
  add: user => user.role === 'admin',
  delete: (user, order) => !!order && user.id === order.author,
  'delivery.routeSheet.addOrder': [
    user => user.role === 'dp_admin',
    user => user.role === 'admin',
    (user, order) => user.role === 'admin' && !!order && order.status === 'DELIVERING'
  ],
});


// And then do some checks
const user: IUser = { id: 5, role: 'worker' };
let canDoStuffWithRouteSheets = OrderTabac.can(/delivery\.routeSheet\..*/, user);

console.log(canDoStuffWithRouteSheets); // --> false
```
