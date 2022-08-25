import { Controller, Get, Post } from '@nestjs/common';
import { ApplicationConfig } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor';
import { SchemaObjectFactory } from '@nestjs/swagger/dist/services/schema-object-factory';
import { SwaggerTypesMapper } from '@nestjs/swagger/dist/services/swagger-types-mapper';
import { SwaggerExplorer } from '@nestjs/swagger/dist/swagger-explorer';
import { SwaggerHideController } from '../src/decorators/swagger-hide-controller.decorator';

describe('SwaggerHideController', () => {
  const schemaObjectFactory = new SchemaObjectFactory(
    new ModelPropertiesAccessor(),
    new SwaggerTypesMapper(),
  );

  describe(`when a controller matches condition to be excluded`, () => {
    describe(`when it is a static boolean`, () => {
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

      it(`should be correctly excluded on swagger document`, () => {
        const explorer = new SwaggerExplorer(schemaObjectFactory);
        const routes = explorer.exploreController(
          {
            instance: new MockController(),
            metatype: MockController,
          } as InstanceWrapper<MockController>,
          new ApplicationConfig(),
          'path',
        );
        expect(routes).toHaveLength(0);
      });
    });
    describe(`when it is a functional callback`, () => {
      @SwaggerHideController(() => true)
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

      it(`should be correctly excluded on swagger document`, () => {
        const explorer = new SwaggerExplorer(schemaObjectFactory);
        const routes = explorer.exploreController(
          {
            instance: new MockController(),
            metatype: MockController,
          } as InstanceWrapper<MockController>,
          new ApplicationConfig(),
          'path',
        );
        expect(routes).toHaveLength(0);
      });
    });
  });

  describe(`when a controller does not match condition to be excluded`, () => {
    describe(`when it is a static boolean`, () => {
      @SwaggerHideController(false)
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

      it(`should not be excluded on swagger document`, () => {
        const explorer = new SwaggerExplorer(schemaObjectFactory);
        const routes = explorer.exploreController(
          {
            instance: new MockController(),
            metatype: MockController,
          } as InstanceWrapper<MockController>,
          new ApplicationConfig(),
          'path',
        );
        expect(routes).toHaveLength(2);
      });
    });
    describe(`when it is a functional callback`, () => {
      @SwaggerHideController(() => false)
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

      it(`should not be excluded on swagger document`, () => {
        const explorer = new SwaggerExplorer(schemaObjectFactory);
        const routes = explorer.exploreController(
          {
            instance: new MockController(),
            metatype: MockController,
          } as InstanceWrapper<MockController>,
          new ApplicationConfig(),
          'path',
        );
        expect(routes).toHaveLength(2);
      });
    });
  });
});
