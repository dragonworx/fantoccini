type WithProps<P> = {
  props: P;
};

function extend<Base, BaseProps extends WithProps<BaseProps>, SubProps>(
  base: Base,
  props: SubProps
) {
  return {
    ...base,
    props: {
      ...(base as unknown as BaseProps).props,
      ...props,
    },
  };
}

function Control<T, Props>(proto: T & WithProps<Props>) {
  return function (props: Partial<Props> = proto.props): typeof proto {
    return {
      ...proto,
      props: {
        ...proto.props,
        ...props,
      },
    };
  };
}

const baseProto = {
  props: {
    baseProp: 1,
  },
  baseMethod() {
    this.props.baseProp++;
    return 'base';
  },
};

const subProto = {
  ...extend(baseProto, {
    subProp: 2,
  }),
  subMethod() {
    return this.baseMethod() + '?';
  },
};

const subProto1 = {
  ...extend(subProto, { subProp1: 3 }),
  sub1Method() {
    return this.subMethod() + '!';
  },
};

const subProto2 = {
  ...extend(subProto, { subProp2: 4 }),
  sub2Method() {
    return this.subMethod() + '@';
  },
};

const subProto3 = {
  ...extend(subProto2, { subProp3: 5 }),
  sub3Method() {
    return this.sub2Method() + '@';
  },
};

const Sub = Control(subProto);
const sub = Sub();

const Sub1 = Control(subProto1);
const sub1 = Sub1({ subProp1: 7 });
const sub1Method = sub1.subMethod();
const sub1BaseProp = sub1.props.baseProp;
const sub1SubProp1 = sub1.sub1Method() + sub1.props.subProp1;
sub1Method;
sub1BaseProp;
sub1SubProp1;

const Sub2 = Control(subProto2);
const sub2 = Sub2({ subProp2: 8 });
const sub2SubProp2 = sub2.sub2Method();
const sub2Prop2 = sub2.props.subProp2;
sub2SubProp2;
sub2Prop2;

const Sub3 = Control(subProto3);
const sub3 = Sub3({ baseProp: 5, subProp3: 4 });
const sub3Prop = sub3.props.subProp3;
