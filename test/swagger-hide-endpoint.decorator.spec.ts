import { Controller, Get, Post } from '@nestjs/common';
import { ApplicationConfig } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { ModelPropertiesAccessor } from '@nestjs/swagger/dist/services/model-properties-accessor';
import { SchemaObjectFactory } from '@nestjs/swagger/dist/services/schema-object-factory';
import { SwaggerTypesMapper } from '@nestjs/swagger/dist/services/swagger-types-mapper';
import { SwaggerExplorer } from '@nestjs/swagger/dist/swagger-explorer';
import { SwaggerHideEndpoint } from '../src/decorators/swagger-hide-endpoint.decorator';

describe('SwaggerHideController', () => {
  const schemaObjectFactory = new SchemaObjectFactory(
    new ModelPropertiesAccessor(),
    new SwaggerTypesMapper(),
  );

  describe(`when an endpoint matches condition to be excluded`, () => {
    describe(`when it is a static boolean`, () => {
      @Controller(`MockController`)
      class MockController {
        @Get('some/:thingId')
        search(): Promise<any[]> {
          return Promise.resolve([]);
        }

        @SwaggerHideEndpoint(true)
        @Post(`some`)
        create(): Promise<any> {
          return Promise.resolve();
        }
      }

      it(`should exactly have 1 endpoint route`, () => {
        const explorer = new SwaggerExplorer(schemaObjectFactory);
        const routes = explorer.exploreController(
          {
            instance: new MockController(),
            metatype: MockController,
          } as InstanceWrapper<MockController>,
          new ApplicationConfig(),
          'path',
        );
        expect(routes).toHaveLength(1);
      });
    });

    describe(`when it is a functional callback`, () => {
      @Controller(`MockController`)
      class MockController {
        @Get('some/:thingId')
        search(): Promise<any[]> {
          return Promise.resolve([]);
        }

        @SwaggerHideEndpoint(() => true)
        @Post(`some`)
        create(): Promise<any> {
          return Promise.resolve();
        }
      }

      it(`should exactly have 1 endpoint route`, () => {
        const explorer = new SwaggerExplorer(schemaObjectFactory);
        const routes = explorer.exploreController(
          {
            instance: new MockController(),
            metatype: MockController,
          } as InstanceWrapper<MockController>,
          new ApplicationConfig(),
          'path',
        );
        expect(routes).toHaveLength(1);
      });
    });
  });

  describe(`when no endpoint matches the condition to be excluded`, () => {
    describe(`when it is a static boolean`, () => {
      @Controller(`MockController`)
      class MockController {
        @Get('some/:thingId')
        search(): Promise<any[]> {
          return Promise.resolve([]);
        }

        @SwaggerHideEndpoint(false)
        @Post(`some`)
        create(): Promise<any> {
          return Promise.resolve();
        }
      }

      it(`should exactly have 2 endpoint routes`, () => {
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
      @Controller(`MockController`)
      class MockController {
        @Get('some/:thingId')
        search(): Promise<any[]> {
          return Promise.resolve([]);
        }

        @SwaggerHideEndpoint(() => false)
        @Post(`some`)
        create(): Promise<any> {
          return Promise.resolve();
        }
      }

      it(`should exactly have 2 endpoint routes`, () => {
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
