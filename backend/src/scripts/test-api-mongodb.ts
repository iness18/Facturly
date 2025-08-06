import axios from 'axios';

const API_BASE = 'http://localhost:3001/test';

interface TestResult {
  test: string;
  status: 'PASS' | 'FAIL';
  data?: any;
  error?: string;
}

class MongoDBAPITester {
  private results: TestResult[] = [];

  private async makeRequest(
    method: string,
    url: string,
    data?: any,
  ): Promise<any> {
    try {
      const response = await axios({
        method,
        url: `${API_BASE}${url}`,
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  private addResult(
    test: string,
    status: 'PASS' | 'FAIL',
    data?: any,
    error?: string,
  ) {
    this.results.push({ test, status, data, error });
    const emoji = status === 'PASS' ? '✅' : '❌';
    console.log(`${emoji} ${test}`);
    if (error) console.log(`   Error: ${error}`);
    if (data && status === 'PASS')
      console.log(`   Data: ${JSON.stringify(data, null, 2)}`);
  }

  async testHealthCheck() {
    try {
      const data = await this.makeRequest('GET', '/health');
      this.addResult('Health Check', 'PASS', data);
      return data;
    } catch (error: any) {
      this.addResult('Health Check', 'FAIL', null, error.message);
      return null;
    }
  }

  async testUserOperations() {
    try {
      // Test création utilisateur
      const newUser = {
        email: 'test@mongodb.com',
        name: 'Test MongoDB User',
        password: 'testpassword123',
      };

      const createdUser = await this.makeRequest('POST', '/users', newUser);
      this.addResult('Create User', 'PASS', {
        id: createdUser.id,
        email: createdUser.email,
      });

      // Test récupération utilisateur
      const fetchedUser = await this.makeRequest(
        'GET',
        `/users/${createdUser.id}`,
      );
      this.addResult('Get User by ID', 'PASS', {
        id: fetchedUser.id,
        email: fetchedUser.email,
      });

      // Test recherche utilisateur par email
      const foundUser = await this.makeRequest(
        'GET',
        `/users/email/${newUser.email}`,
      );
      this.addResult('Find User by Email', 'PASS', {
        id: foundUser.id,
        email: foundUser.email,
      });

      return createdUser;
    } catch (error: any) {
      this.addResult('User Operations', 'FAIL', null, error.message);
      return null;
    }
  }

  async testClientOperations(userId: string) {
    try {
      // Test création client
      const newClient = {
        name: 'MongoDB Test Client',
        email: 'client@mongodb.com',
        phone: '+33123456789',
        address: '123 Test Street, MongoDB City',
        siret: '12345678901234',
      };

      const createdClient = await this.makeRequest(
        'POST',
        `/clients/${userId}`,
        newClient,
      );
      this.addResult('Create Client', 'PASS', {
        id: createdClient.id,
        name: createdClient.name,
      });

      // Test récupération client
      const fetchedClient = await this.makeRequest(
        'GET',
        `/clients/${createdClient.id}`,
      );
      this.addResult('Get Client by ID', 'PASS', {
        id: fetchedClient.id,
        name: fetchedClient.name,
      });

      // Test recherche client
      const searchResults = await this.makeRequest(
        'GET',
        `/clients/search/${userId}/MongoDB`,
      );
      this.addResult('Search Clients', 'PASS', { count: searchResults.length });

      // Test comptage clients
      const clientCount = await this.makeRequest(
        'GET',
        `/clients/count/${userId}`,
      );
      this.addResult('Count Clients', 'PASS', { count: clientCount });

      return createdClient;
    } catch (error: any) {
      this.addResult('Client Operations', 'FAIL', null, error.message);
      return null;
    }
  }

  async testInvoiceOperations(userId: string, clientId: string) {
    try {
      // Test création facture
      const newInvoice = {
        clientId,
        title: 'Test MongoDB Invoice',
        description: 'Facture de test pour MongoDB',
        amount: 1000,
        taxAmount: 200,
        totalAmount: 1200,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            description: 'Service de test MongoDB',
            quantity: 1,
            unitPrice: 1000,
            total: 1000,
          },
        ],
        notes: 'Facture générée automatiquement pour test MongoDB',
      };

      const createdInvoice = await this.makeRequest(
        'POST',
        `/invoices/${userId}`,
        newInvoice,
      );
      this.addResult('Create Invoice', 'PASS', {
        id: createdInvoice.id,
        invoiceNumber: createdInvoice.invoiceNumber,
        totalAmount: createdInvoice.totalAmount,
      });

      // Test récupération facture
      const fetchedInvoice = await this.makeRequest(
        'GET',
        `/invoices/${createdInvoice.id}`,
      );
      this.addResult('Get Invoice by ID', 'PASS', {
        id: fetchedInvoice.id,
        invoiceNumber: fetchedInvoice.invoiceNumber,
      });

      // Test récupération factures par utilisateur
      const userInvoices = await this.makeRequest(
        'GET',
        `/invoices/user/${userId}`,
      );
      this.addResult('Get Invoices by User', 'PASS', {
        count: userInvoices.length,
      });

      // Test recherche factures
      const searchResults = await this.makeRequest(
        'GET',
        `/invoices/search/${userId}/MongoDB`,
      );
      this.addResult('Search Invoices', 'PASS', {
        count: searchResults.length,
      });

      // Test factures par statut
      const pendingInvoices = await this.makeRequest(
        'GET',
        `/invoices/status/${userId}/pending`,
      );
      this.addResult('Get Invoices by Status', 'PASS', {
        count: pendingInvoices.length,
      });

      // Test statistiques factures
      const stats = await this.makeRequest('GET', `/invoices/stats/${userId}`);
      this.addResult('Get Invoice Stats', 'PASS', stats);

      // Test mise à jour statut facture
      const updatedInvoice = await this.makeRequest(
        'PUT',
        `/invoices/${createdInvoice.id}/${userId}/status`,
        {
          status: 'paid',
        },
      );
      this.addResult('Update Invoice Status', 'PASS', {
        id: updatedInvoice.id,
        status: updatedInvoice.status,
      });

      return createdInvoice;
    } catch (error: any) {
      this.addResult('Invoice Operations', 'FAIL', null, error.message);
      return null;
    }
  }

  async runAllTests() {
    console.log('🚀 Démarrage des tests API MongoDB...\n');

    // Test de santé
    const health = await this.testHealthCheck();
    if (!health) {
      console.log('\n❌ Impossible de continuer - API non disponible');
      return;
    }

    console.log('\n📊 Tests des opérations utilisateurs...');
    const user = await this.testUserOperations();
    if (!user) {
      console.log(
        '\n❌ Impossible de continuer - Échec des opérations utilisateurs',
      );
      return;
    }

    console.log('\n👥 Tests des opérations clients...');
    const client = await this.testClientOperations(user.id);
    if (!client) {
      console.log(
        '\n❌ Impossible de continuer - Échec des opérations clients',
      );
      return;
    }

    console.log('\n📄 Tests des opérations factures...');
    await this.testInvoiceOperations(user.id, client.id);

    // Résumé final
    console.log('\n' + '='.repeat(50));
    console.log('📋 RÉSUMÉ DES TESTS');
    console.log('='.repeat(50));

    const passed = this.results.filter((r) => r.status === 'PASS').length;
    const failed = this.results.filter((r) => r.status === 'FAIL').length;
    const total = this.results.length;

    console.log(`✅ Tests réussis: ${passed}/${total}`);
    console.log(`❌ Tests échoués: ${failed}/${total}`);
    console.log(`📊 Taux de réussite: ${Math.round((passed / total) * 100)}%`);

    if (failed > 0) {
      console.log('\n❌ Tests échoués:');
      this.results
        .filter((r) => r.status === 'FAIL')
        .forEach((r) => console.log(`   - ${r.test}: ${r.error}`));
    }

    console.log('\n🎉 Tests terminés!');

    if (passed === total) {
      console.log(
        '✅ Tous les tests sont passés - MongoDB API fonctionne parfaitement!',
      );
    } else {
      console.log(
        '⚠️  Certains tests ont échoué - Vérifiez les erreurs ci-dessus',
      );
    }
  }
}

// Exécution des tests
async function main() {
  const tester = new MongoDBAPITester();
  await tester.runAllTests();
}

if (require.main === module) {
  main().catch(console.error);
}

export { MongoDBAPITester };
