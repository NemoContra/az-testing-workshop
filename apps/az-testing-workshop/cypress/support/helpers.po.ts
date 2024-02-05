export const expectCorrectTableRow = (
  index: number,
  contractNumber: string,
  firstname: string,
  lastname: string,
  dateOfBirth: string,
  start: string,
  end: string,
) => {
  cy.get('table tbody tr').eq(index).children('td').eq(0).should('contain.text', contractNumber);
  cy.get('table tbody tr').eq(index).children('td').eq(1).should('contain.text', firstname);
  cy.get('table tbody tr').eq(index).children('td').eq(2).should('contain.text', lastname);
  cy.get('table tbody tr').eq(index).children('td').eq(3).should('contain.text', dateOfBirth);
  cy.get('table tbody tr').eq(index).children('td').eq(4).should('contain.text', start);
  cy.get('table tbody tr').eq(index).children('td').eq(5).should('contain.text', end);
  cy.get('table tbody tr').eq(index).children('td').eq(6).find('button[nxIconButton="tertiary small"] nx-icon[name="ellipsis-h"]').should('be.visible');
};
