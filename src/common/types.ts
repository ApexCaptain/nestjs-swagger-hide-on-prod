export type SwaggerHideCondition = boolean | (() => boolean);

export const DefaultSwaggerHideCondition: SwaggerHideCondition = () => {
  const nodeEnv = process.env.NODE_ENV;
  return (
    nodeEnv != undefined &&
    ['PROD', 'PRODUCTION'].includes(nodeEnv.toUpperCase())
  );
};
