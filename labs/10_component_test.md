# ContractTableComponent

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
