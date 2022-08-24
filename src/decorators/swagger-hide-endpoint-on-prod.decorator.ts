import { DefaultSwaggerHideCondition } from '@src/common/types';
import { SwaggerHideEndpoint } from '@src/decorators/swagger-hide-endpoint.decorator';

export function SwaggerHideEndpointOnProd(): MethodDecorator {
  return SwaggerHideEndpoint(DefaultSwaggerHideCondition);
}
