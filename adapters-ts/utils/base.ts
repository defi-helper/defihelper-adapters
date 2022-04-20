export class Builder<C, M extends {}> {
  protected parts: { [k in keyof M]: M[k] };

  constructor(def: { [k in keyof M]: M[k] }) {
    this.parts = def;
  }

  part<N extends keyof M>(name: N, v: M[N]) {
    this.parts[name] = v;

    return this;
  }

  build(context: C): M & C {
    return { ...context, ...this.parts };
  }
}
