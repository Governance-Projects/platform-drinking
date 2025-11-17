describe("Must render the create user page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/app/usuarios/novo");

    cy.get('[data-test="submit-button"]').as("submit-button");
    cy.get('[data-test="name-input"]').as("name-input");
    cy.get('[data-test="email-input"]').as("email-input");
    cy.get('[data-test="password-input"]').as("password-input");
    cy.get('[data-test="confirm-password-input"]').as("confirm-password-input");
  });

  it("should be able to open the create user page", () => {
    cy.contains("Novo Usuário");
    cy.contains("Cadastre um novo worker no sistema");
  });

  it("should be able to create an user", () => {
    const timestamp = Date.now();
    const email = `teste${timestamp}@example.com`;

    cy.get("@name-input").type("Usuário Teste");
    cy.get("@email-input").type(email);
    cy.get("@password-input").type("Senha123");
    cy.get("@confirm-password-input").type("Senha123");
    cy.get("@submit-button").click();
    cy.contains("Usuário criado com sucesso!");
  });

  it("should show error message on name input when empty", () => {
    cy.get("@submit-button").click();
    cy.contains("Nome é obrigatório");
  });

  it("should show error message on email input when empty", () => {
    cy.get("@name-input").type("Usuário Teste");
    cy.get("@submit-button").click();
    cy.contains("Email é obrigatório");
  });

  it("should show error message on email input when invalid", () => {
    cy.get("@name-input").type("Usuário Teste");
    cy.get("@email-input").type("email-invalido");
    cy.get("@submit-button").click();
    cy.contains("Email inválido");
  });

  it("should show error message on password input when empty", () => {
    cy.get("@name-input").type("Usuário Teste");
    cy.get("@email-input").type("teste@example.com");
    cy.get("@submit-button").click();
    cy.contains("Senha deve ter no mínimo 8 caracteres");
  });

  it("should show error message on password input when too short", () => {
    cy.get("@name-input").type("Usuário Teste");
    cy.get("@email-input").type("teste@example.com");
    cy.get("@password-input").type("Senha1");
    cy.get("@submit-button").click();
    cy.contains("Senha deve ter no mínimo 8 caracteres");
  });

  it("should show error message on password input when missing requirements", () => {
    cy.get("@name-input").type("Usuário Teste");
    cy.get("@email-input").type("teste@example.com");
    cy.get("@password-input").type("senha123");
    cy.get("@confirm-password-input").type("senha123");
    cy.get("@submit-button").click();
    cy.contains(
      "Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
    );
  });

  it("should show error message when passwords do not match", () => {
    cy.get("@name-input").type("Usuário Teste");
    cy.get("@email-input").type("teste@example.com");
    cy.get("@password-input").type("Senha123");
    cy.get("@confirm-password-input").type("Senha456");
    cy.get("@submit-button").click();
    cy.contains("As senhas não coincidem");
  });

  it("should show error message when email already exists", () => {
    const email = "teste@example.com";

    // Primeiro, criar um usuário
    cy.get("@name-input").type("Usuário Teste 1");
    cy.get("@email-input").type(email);
    cy.get("@password-input").type("Senha123");
    cy.get("@confirm-password-input").type("Senha123");
    cy.get("@submit-button").click();
    cy.contains("Usuário criado com sucesso!");

    // Tentar criar outro com o mesmo email
    cy.visit("http://localhost:3000/app/usuarios/novo");
    cy.get('[data-test="name-input"]').type("Usuário Teste 2");
    cy.get('[data-test="email-input"]').type(email);
    cy.get('[data-test="password-input"]').type("Senha123");
    cy.get('[data-test="confirm-password-input"]').type("Senha123");
    cy.get('[data-test="submit-button"]').click();
    cy.contains("Email já cadastrado");
  });
});


