describe("Must be able to do login", () => {
  beforeEach(() => {
    cy.visit("/entrar");
  });

  it("should be able to render page", () => {
    cy.contains("Login");
    cy.contains("Entre com seu email e senha para acessar o sistema");
    cy.contains("label", "Email");
    cy.contains("label", "Senha");
    cy.contains("button", "Entrar");
  });

  it("should be able to do login with valid credentials", () => {
    cy.login("rianlandim@unifapce.edu.br", "teste123!");
    cy.url().should("include", "/app");
  });

  it("should show error message when email is empty", () => {
    cy.contains("label", "Senha")
      .parent()
      .find('input[type="password"]')
      .type("teste123!");
    cy.contains("button", "Entrar").click();
    cy.contains("Email é obrigatório");
  });

  it("should show error message when password is empty", () => {
    cy.contains("label", "Email")
      .parent()
      .find('input[type="email"]')
      .type("rianlandim@unifapce.edu.br");
    cy.contains("button", "Entrar").click();
    cy.contains("Senha é obrigatória");
  });

  it("should show error message when email is invalid", () => {
    cy.contains("label", "Email")
      .parent()
      .find('input[type="email"]')
      .type("email-invalido");
    cy.contains("label", "Senha")
      .parent()
      .find('input[type="password"]')
      .type("teste123!");
    cy.contains("button", "Entrar").click();
    cy.contains("Email inválido");
  });

  it("should show error message when credentials are invalid", () => {
    cy.contains("label", "Email")
      .parent()
      .find('input[type="email"]')
      .type("rianlandim@unifapce.edu.br");
    cy.contains("label", "Senha")
      .parent()
      .find('input[type="password"]')
      .type("SenhaIncorreta123!");
    cy.contains("button", "Entrar").click();
    cy.contains("Email ou senha inválidos");
  });
});
