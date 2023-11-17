describe('Teste Interface em Desktop', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.viewport(1280, 720)
  })
  
  it('01 - Valida item  do catálogo é visível', () => {
    cy.get('.catalogo__item').should('be.visible');
  })

  it('02 - Valida BTN comprar e notificação de compra', () => {
    cy.get('.catalogo__item--btnComprar').first().click({ force: true });
    cy.get('#contadorCarrinho').invoke('text').then((value) => {
      const contador = parseInt(value);
      expect(contador).to.equal(1);
    });
  })

  it('03 - Valida BTN "CARREGAR MAIS" e clica para fazer verificação se carregou mais item', () => {
    cy.get('.catalogo__item').should('have.length', 9);
    cy.get('.carregarMais__desktop').should('be.visible').should('contain', 'CARREGAR MAIS');
    cy.get('.carregarMais__desktop').should('be.visible').click();
    cy.get('.catalogo__item').should('have.length.greaterThan', 9);
  })

  it('04 - Valida se BTN de ordenar está visível e tem os filtros', () => {
    cy.get('.titulo__ordenar').should('be.visible');
    cy.get('.titulo__ordenar').click();
    cy.get('#ordenar__item--recente').should('be.visible');
    cy.get('#ordenar__item--preco').should('be.visible');
    cy.get('#ordenar__item--precoMenor').should('be.visible');
  })

  it('05 - Validar filtro de cores', () => {
    cy.get('.titulos__filtro--desktop').should('be.visible').should('contain', 'Cores');
    cy.get('.filtro__cor.filtrar__list--desktop-cores').should('be.visible');
  })

  it('06 - Validar filtro de tamanhos', () => {
    cy.get('.titulos__filtro--desktop').should('be.visible').should('contain', 'Tamanhos');
    cy.get('.filtrar__list--desktop-tamanho').should('be.visible');
  })

  it('07 - Validar filtro de faixa de preço', () => {
    cy.get('.titulos__filtro--desktop').should('be.visible').should('contain', 'Faixa de preço');
    cy.get('.filtrar__list--desktop-tamanho').should('be.visible');
  })

  it('08 - Valida titulo da página', () => {
    cy.get('.title__page').should('contain', 'Blusas');
  })
})
