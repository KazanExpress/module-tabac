export type TRuleCondition<U, T> = (user: U, target?: T, ...args: any[]) => boolean | Promise<boolean>;
export type TRuleMap<U, T> = { [key: string]: TRuleCondition<U, T> | TRuleCondition<U, T>[] };

export class Tabac<U, T> {
  private rules: { [key: string]: TRuleCondition<U, T>[] } = {};

  constructor(ruleMap?: TRuleMap<U, T>) {
    if (ruleMap) {
      this.addRules(ruleMap);
    }
  }

  public addRule(name: string, condition: TRuleCondition<U, T> | TRuleCondition<U, T>[]) {
    const conditions = Array.isArray(condition) ? condition : [condition];

    if (this.rules[name]) {
      this.rules[name].push(...conditions);
    } else {
      this.rules[name] = conditions;
    }
  }

  public addRules(ruleMap: TRuleMap<U, T>) {
    Object.keys(ruleMap).forEach(name => {
      this.addRule(name, ruleMap[name]);
    });
  }

  protected can(nameOrRegexp: string | RegExp, user: U, target?: T, ...args: any[]) {
    if (typeof nameOrRegexp === 'object') {
      return Object.keys(this.rules)
        .filter(name => nameOrRegexp.test(name))
        .reduce((acc, cur) => [ ...acc, ...this.rules[cur] ], [] as TRuleCondition<U, T>[])
        .some(cond => cond(user, target, ...args));
    } else {
      return this.rules[nameOrRegexp].some(cond => cond(user, target, ...args));
    }
  }
}
