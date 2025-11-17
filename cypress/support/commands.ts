/// <reference types="cypress" />

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/entrar");

  cy.contains("label", "Email")
    .parent()
    .find('input[type="email"]')
    .type(email);

  cy.contains("label", "Senha")
    .parent()
    .find('input[type="password"]')
    .type(password);

  cy.contains("button", "Entrar").click();

  // Aguarda o redirecionamento para /app
  cy.url().should("include", "/app");
});
