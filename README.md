# Cypress API Testing for Wallet Transactions

## Project Overview
This project implements an automated test suite for a Wallet Transactions API using Cypress. The test suite verifies various wallet-related operations such as processing transactions, retrieving wallet details, and handling invalid inputs.

## Installation
To set up and run the project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/stefannikolic/testingAPI.git
   cd testingAPI

2. Install dependencies:
    npm install

3. Running Tests
    Open Cypress UI
    To run the tests interactively in Cypress Test Runner:  
    
    npm run cypress:open

    Run Tests in Headless Mode
    To execute tests in a headless browser:

    npm run cypress:run

4. Project Structure

    .
├── cypress/
│   ├── e2e/
│   │   ├── wallet_transactions.cy.js  # Test cases for wallet transactions
│   ├── support/
│   │   ├── commands.js                # Custom Cypress commands
├── cypress.config.js                  # Cypress configuration
├── package.json                        # Project dependencies and scripts
├── README.md                           # Project documentation



