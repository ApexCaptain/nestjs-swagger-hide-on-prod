import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { SwaggerHideCondition } from '@src/common/types';

export function SwaggerHideEndpoint(
  condition: SwaggerHideCondition,
): MethodDecorator {
  return ApiExcludeEndpoint(
    typeof condition == 'boolean' ? condition : condition(),
  );
}
