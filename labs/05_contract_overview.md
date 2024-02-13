# ContractOverviewComponent

1. Check out the branch `start` (if have not done so yet).

```console
git checkout start
```

## Unit-testing of the component

1. Open the folder `apps/az-testing-workshop/src/app/routes/contract-overview`.

1. Here you will find the `ContractOverviewComponent` which is the "main" component of the application and will be rendered when opening the application in the browser. This component is responsible for fetching the contracts and passing it to the `ContractTableComponent`.

1. Have a look on it and try to get an overview how it works exactly and how you could setup a unit test for this smart component. This example contains an explicit test of the SignalStore what means that the SignalStore will be tested separately in the next task of this lab.

1. Now open the `contract-overview.component.spec.ts` and implement the already created empty unit-tests.

1. When you are finished execute the unit tests with `nx test az-testing-workshop -t ContractOverviewComponent` or use your IDE to execute the tests.

1. If you are searching for an example solution checkout the branch `final`.

```console
  git checkout final
```

## Unit-testing of the SignalStore

1. Open the folder `apps/az-testing-workshop/src/app/routes/contract-overview`.

1. Here you will find the file `contract-overview.store.ts` and `contract-overview.store.spec.ts` which contains the implementation of the store itself and the tests for it. Try to understand how the store works and implement the missing unit-tests for it.

1. When you are finished execute the unit tests with `nx test az-testing-workshop -t ContractOverviewStore` or use your IDE to execute the tests.

1. If you are searching for an example solution checkout the branch `final`.

```console
  git checkout final
```
