import { DefaultSwaggerHideCondition } from '@src/common/types';
import { SwaggerHideController } from '@src/decorators/swagger-hide-controller.decorator';
export function SwaggerHideControllerOnProd(): ClassDecorator {
  return SwaggerHideController(DefaultSwaggerHideCondition);
}
