describe("Must render the create sink page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/app/bebedouros/novo");

    cy.get('[data-test="submit-button"]').as("submit-button");
    cy.get('[data-test="name-input"]').as("name-input");
    cy.get('[data-test="location-input"]').as("location-input");
    cy.get('[data-test="description-input"]').as("description-input");
  });

  it("should be able to open the create sink page", () => {
    cy.contains("Novo Bebedouro");
  });

  it("should be able to create an sink", () => {
    cy.get("@name-input").type("Bebedouro A");
    cy.get("@location-input").type("Localização A");
    cy.get("@description-input").type("Descricao A");
    cy.get("@submit-button").click();
    cy.contains(`Salvo com sucesso`);
  });

  it("should show errors message on name input", () => {
    cy.get("@submit-button").click();
    cy.contains("Nome é obrigatorio");
  });

  it("should show errors message on location input", () => {
    cy.get("@name-input").type("Bebedouro B");
    cy.get("@submit-button").click();
    cy.contains("Descrição é obrigatorio");
  });

  it("should show errors messages on name input", () => {
    cy.get("@name-input").type("Bebedouro B");
    cy.get("@location-input").type("Localização B");
    cy.get("@submit-button").click();
    cy.contains("Descrição é obrigatorio");
  });
});
