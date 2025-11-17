// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Login global com sessão para otimizar os testes
beforeEach(() => {
  // Não faz login se o teste estiver no arquivo de login
  const specName = Cypress.spec.name;
  if (!specName.includes('login.cy.ts')) {
    const email = 'admin@unifapce.edu.br';
    const password = 'Teste123!';
    
    cy.session(
      `login-${email}`,
      () => {
        cy.login(email, password);
      }
    );
  }
});