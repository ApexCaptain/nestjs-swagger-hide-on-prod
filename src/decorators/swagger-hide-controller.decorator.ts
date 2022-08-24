import { ApiExcludeController } from '@nestjs/swagger';
import { SwaggerHideCondition } from '@src/common/types';
export function SwaggerHideController(
  condition: SwaggerHideCondition,
): ClassDecorator {
  return ApiExcludeController(
    typeof condition == 'boolean' ? condition : condition(),
  );
}
