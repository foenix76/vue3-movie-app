describe('첫 번째 테스트', () => {
  it('프로젝트 페이지 이동합니다', () => {
    // cy.visit('http://localhost:8080')
    // cypress.json에 baseUrl을 설정하면 아래와 같이 작성할 수 있습니다.
    cy.visit('/')
    cy.get('header .logo')
    cy.get('#app')
    //cy.get('#fail')
  })
})