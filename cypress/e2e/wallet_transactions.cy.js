describe('Wallet Transaction API Tests', () => {
  const WALLET_ID = 'wallet_123';
  const TRANSACTION = { amount: 100.0, currency: 'USD', description: 'Test transaction' };

  it('should process a successful transaction', () => {
    cy.apiRequest('POST', `/wallet/${WALLET_ID}/transaction`, TRANSACTION).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.include.keys('status', 'transaction_id');
      expect(response.body.status).to.eq('success');
      expect(response.body.transaction_id).to.match(/^txn_/);
    });
  });

  it('should handle a slow response gracefully', () => {
    cy.intercept('POST', `/wallet/${WALLET_ID}/transaction`, (req) => {
      req.reply((res) => {
        res.delay(5000); // Simulate timeout delay
        res.send({ statusCode: 408, body: { error: 'Request Timeout' } });
      });
    }).as('delayedTransaction');
    
    cy.apiRequest('POST', `/wallet/${WALLET_ID}/transaction`, TRANSACTION, true);
    cy.wait('@delayedTransaction').then((interception) => {
      expect(interception.response.statusCode).to.eq(408);
      expect(interception.response.body).to.have.property('error', 'Request Timeout');
    });
  });

  it('should reject a transaction with insufficient balance', () => {
    const invalidTransaction = { ...TRANSACTION, amount: 1000000.0 };
    cy.apiRequest('POST', `/wallet/${WALLET_ID}/transaction`, invalidTransaction, true).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.include({ error: 'Insufficient balance', code: 'INSUFFICIENT_BALANCE' });
    });
  });

  it('should reject a transaction with an invalid currency', () => {
    const invalidTransaction = { ...TRANSACTION, currency: 'XYZ' };
    cy.apiRequest('POST', `/wallet/${WALLET_ID}/transaction`, invalidTransaction, true).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.include({ error: 'Invalid currency', code: 'INVALID_CURRENCY' });
    });
  });

  it('should reject a transaction with missing required fields', () => {
    const invalidTransaction = { amount: 100.0 };
    cy.apiRequest('POST', `/wallet/${WALLET_ID}/transaction`, invalidTransaction, true).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.include({ error: 'Missing required fields', code: 'MISSING_FIELDS' });
    });
  });

  it('should retrieve wallet details', () => {
    cy.apiRequest('GET', `/wallet/${WALLET_ID}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include.keys('wallet_id', 'balance', 'currency');
      expect(response.body.wallet_id).to.eq(WALLET_ID);
      expect(response.body.balance).to.be.a('number');
      expect(response.body.currency).to.eq('USD');
    });
  });

  it('should update wallet details', () => {
    const updatedWalletData = { currency: 'EUR', description: 'Updated wallet details' };
    cy.apiRequest('PUT', `/wallet/${WALLET_ID}`, updatedWalletData).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.include(updatedWalletData);
    });
  });

  it('should delete a wallet and verify deletion', () => {
    cy.apiRequest('DELETE', `/wallet/${WALLET_ID}`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('message', 'Wallet deleted successfully');
    });
    
    cy.apiRequest('GET', `/wallet/${WALLET_ID}`, null, true).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.include({ error: 'Wallet not found', code: 'WALLET_NOT_FOUND' });
    });
  });
});
