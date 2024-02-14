# ContractTableComponent

## Unit-testing

1. Check out the branch `start` (if have not done so yet).

```console
git checkout start
```

1. Open the folder `apps/az-testing-workshop/src/app/shared/contract-table`.

1. Here you will find the `ContractTableComponent` which renders a search input field and all contracts within a table.

1. Have a look on it and try to get an overview how it works exactly and how you could setup a unit test.

1. Now open the `contract-table.component.spec.ts` and implement the already created empty unit-tests. Hint: When you want to test the table content there is a helper function called `expectCorrectTableRow` which you can use within your test. Just try to find out what it does.

1. When you are finished execute the unit tests with `nx test az-testing-workshop -t ContractTableComponent` or use your IDE to execute the tests.

1. If you are searching for an example solution checkout the branch `final`.

```console
  git checkout final
```
