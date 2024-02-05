export const expectCorrectTableRow = (
  index: number,
  icon: 'error_outline' | 'check',
  lastname: string,
  firstname: string,
  contractNumber: string,
) => {
  cy.get('table tbody tr').eq(index).children('td').eq(0).find(`fonl-icon[data-testid="${icon}"]`).should('be.visible');
  cy.get('table tbody tr').eq(index).children('td').eq(1).should('contain.text', lastname);
  cy.get('table tbody tr').eq(index).children('td').eq(2).should('contain.text', firstname);
  cy.get('table tbody tr').eq(index).children('td').eq(3).should('contain.text', contractNumber);
  cy.get('table tbody tr').eq(index).children('td').eq(4).find('nx-formfield input').should('be.visible');
  cy.get('table tbody tr').eq(index).children('td').eq(5).find('nx-dropdown').should('be.visible');
  cy.get('table tbody tr').eq(index).children('td').eq(6).should('contain.text', '');
};
