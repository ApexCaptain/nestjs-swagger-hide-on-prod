<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>
<p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

# Nestjs Swagger Hide on Prod

## Description

Exclude your nestjs controller or endpoint from swagger documentization on production env.

## Installation

```bash
$ yarn add nestjs-swagger-hide-on-prod
```

or

```bash
$ npm i --save nestjs-swagger-hide-on-prod
```

## Getting Started

In default, when `NODE_ENV` is set to `PROD` or `PRODUCTION`, following decorators will exclude the whole controller or specific endpoint

- @SwaggerHideControllerOnProd
- @SwaggerHideEndpointOnProd

To exclude whole controller on prod :

```typescript
@Controller('foo')
@ApiTags('Foo API')
@SwaggerHideControllerOnProd() // Add this line to exclude FooController from swagger when process is on production environment
export class FooController {
  constructor(private readonly fooService: FooService) {}
  @Get(':fooId')
  searchFoos(): Promise<any[]> {
    return Promise.resolve([]);
  }

  @Post()
  createFoo(): Promise<any> {
    return Promise.resolve();
  }
}
```

To Exclude specific endpoint only on prod :

```typescript
@Controller('foo')
@ApiTags('Foo API')
export class FooController {
  constructor(private readonly fooService: FooService) {}
  @Get(':fooId')
  searchFoos(): Promise<any[]> {
    return Promise.resolve([]);
  }

  @Post()
  @SwaggerHideEndpointOnProd() // Exclude POST /foo endpoint from swagger on prod env
  createFoo(): Promise<any> {
    return Promise.resolve();
  }
}
```

To customize exclusion condition you can use

- @SwaggerHideController
- @SwaggerHideEndpoint

instead.
Input parameter could be static `boolean` or a `function`, which returns a `boolean` value.

```typescript
@Controller('foo')
@ApiTags('Foo API')
export class FooController {
  constructor(private readonly fooService: FooService) {}

  @Get(':fooId')
  @ApiOperation({
    summary: 'Search foos info',
    description: 'This method is depreacted. Please, use GET "v2" instaed',
  })
  @SwaggerHideEndpoint(() => {
    return moment(new Date()).isAfter(`2022-12-31`);
    // After year 2022, this method would be excluded from swagger documentization
  })
  veryOldFooSearchApi(): Promise<any[]> {
    return Promise.resolve([]);
  }

  @Get('v2/:fooId')
  @ApiOperation({
    summary: `Search foos info`,
    description: `Get information matches id`,
  })
  brandNewFooSearchApi(): Promise<any[]> {
    return Promise.resolve([]);
  }
}
```
