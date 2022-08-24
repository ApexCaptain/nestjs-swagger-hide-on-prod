import { Controller, Get, Post } from '@nestjs/common';
import { SwaggerExplorer } from '@nestjs/swagger/dist/swagger-explorer';
import { SwaggerHideController } from '../src/decorators/swagger-hide-controller.decorator';

describe('SwaggerHideController', () => {
  describe(`when a controller matches condition to be excluded`, () => {
    @SwaggerHideController(true)
    @Controller('MockController')
    class MockController {
      @Get('some/:thingId')
      search(): Promise<any[]> {
        return Promise.resolve([]);
      }

      @Post(`some`)
      create(): Promise<any> {
        return Promise.resolve();
      }
    }

    it(`should be correctly excluded on swagger document`, () => {});
  });
});
