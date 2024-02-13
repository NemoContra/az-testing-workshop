# AZ-Testing-Workshop Repository

This repository contains two application inside the `apps directory`. An Angular app (az-testing-workshop) and a a Nest.js app which acts as a mock-backend. For this workshop we wil focus on the Angular app only.

## Here you will find some commands you need to run during the workshop:

### Starting the application

```console
  yarn start
```

### Running Unit-Tests

```console
  nx test az-testing-workshop
```

### Running Component-Tests

Without watch-option:

```console
  nx run az-testing-workshop:component-test
```

With watch-option:

```console
  nx run az-testing-workshop:component-test --watch
```

### Running E2E-Tests

Without watch-option:

```console
  nx e2e az-testing-workshop
```

With watch-option:

```console
  nx e2e az-testing-workshop --watch
```
