# ContractDetailsComponent

1. Check out the branch `start` (if have not done so yet).

```console
git checkout start
```

1. Open the folder `apps/az-testing-workshop/src/app/routes/contract-details`.

1. Here you will find the `ContractDetailsComponent` which is the component which displays details of contract. This component is responsible for fetching a contract and passing it to the `ContractDisplayComponent`.

1. Have a look on it and try to get an overview how it works exactly and how you could setup a unit test for this smart component. This example contains an implicit test of the SignalStore what means that the SignalStore will be tested together with the tests of the component itself and not with an explicit unit test for the store.

1. Now open the `contract-details.component.spec.ts` and implement the already created empty unit-tests.

1. When you are finished execute the unit tests with `nx test az-testing-workshop -t ContractDetailsComponent` or use your IDE to execute the tests.

1. If you are searching for an example solution checkout the branch `final`.

```console
  git checkout final
```
