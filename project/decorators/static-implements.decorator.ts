export const StaticImplements = <TargetInterfaceType>() => {
  return <ResultInterfaceType extends TargetInterfaceType>(
    constructor: ResultInterfaceType,
  ) => {
    constructor;
  };
};
