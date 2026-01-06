describe('Login Spec', () => {
  it('should login successfully with valid credentials', () => {
    // 1. Visit Login Page
    cy.visit('/login');

    // 2. Mock API request if we don't want to hit real API, but E2E usually hits real API or mocked server. 
    // Given the instructions say "E2E testing", usually on local dev we might mock or use a test account.
    // However, without a real backend running or mocked, this test will fail if it depends on real network.
    // I will assume the app connects to the real `forum-api.dicoding.dev` as per api.js.
    // So I need to use a real potential account or mock the network request using cy.intercept.
    // Mocking is safer and faster.
    
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: {
          token: 'mock-token'
        }
      }
    }).as('loginRequest');

    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users/me', {
       statusCode: 200,
       body: {
          status: 'success',
          data: {
            user: {
               id: 'user-1',
               name: 'Test User',
               email: 'test@example.com',
               avatar: 'https://ui-avatars.com/api/?name=Test+User'
            }
          }
       }
    }).as('getProfile');

    // 3. Type text
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password');

    // 4. Click login
    cy.get('button[type="submit"]').click();

    // 5. Wait for Login
    cy.wait('@loginRequest');
    cy.wait('@getProfile');

    // 6. Assert redirect to home (Title or Content)
    // Assuming Home has a specific element. Let's say "Diskusi" or similar.
    // We can check URL.
    cy.url().should('eq', 'http://localhost:5173/');
    
    // Optional: Check if token is in localStorage
    cy.window().then((window) => {
       expect(window.localStorage.getItem('accessToken')).to.eq('mock-token');
    });
  });
});
