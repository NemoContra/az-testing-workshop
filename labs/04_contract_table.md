# ContractTableComponent

## Unit-testing

1. Check out the branch `start` (if have not done so yet).

  ```console
  git checkout start
  ```

1. Open the folder `apps/az-testing-workshop/src/app/components/contract-table`.

1. Here you will find the ContractTableComponent which renders a search input field and all contracts within a table.

1. Have a look on it and try to get an overview how it works exactly and how you could setup a unit test.

1. Now open the `contract-table.component.spec.ts` and implement the already created empty unit-tests. Hint: When you want to test the table content there is a helper function called `expectCorrectTableRow` which you can use within your test. Just try to find out what it does.

1. When you are finished execute the unit tests with `nx test az-testing-workshop -t ContractTableComponent` or use your IDE to execute the tests.

1. If you are searching for an example solution checkout the branch `final`.

  ```console
    git checkout final
  ```

## Component-testing

Now as we are finished with the unit-tests for this component we want to test this component with Cypress component-tests to have a comparison between these two ways for testing Angular components.

1. Open the file `contract-table.component.cy.ts` and have a look on the test setup and how it differs to a jest unit test.

1. For Cypress component-tests you can already start the test suite and you will see how the tests are executed in realtime. To do this execute `nx run az-testing-workshop:component-test --watch` in your terminal and click on the `contracts-table.component` tests in the opened Chrome Window to execute them.

1. Now have a look at all empty tests again. This file contains the exact same test cases as the unit test file but the syntax will be different. Try to test the component with the same test cases but with Cypress component-tests now. Hint: We will again have the helper function `expectCorrectTableRow` which does the very same as for the unit tests. Also have a look into the code of this function.

1. Implement all tests until they are all running successfully.

1. If you are searching for an example solution checkout the branch `final`.

  ```console
    git checkout final
  ```

