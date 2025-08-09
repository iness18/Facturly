#!/usr/bin/env node

/**
 * Script de test pour vérifier la configuration de production
 * Usage: node scripts/test-production.js [environment]
 */

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

// Configuration des environnements
const environments = {
  staging: {
    frontend: "https://staging--facturly.netlify.app",
    backend: "https://facturly-backend-staging.herokuapp.com",
  },
  production: {
    frontend: "https://facturly.netlify.app",
    backend: "https://facturly-backend-prod.herokuapp.com",
  },
};

// Couleurs pour les logs
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, "green");
}

function error(message) {
  log(`❌ ${message}`, "red");
}

function warning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function info(message) {
  log(`ℹ️  ${message}`, "blue");
}

// Fonction pour faire une requête HTTP/HTTPS
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const timeout = options.timeout || 10000;

    const req = protocol.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          url: url,
        });
      });
    });

    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error(`Timeout: ${url}`));
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

// Test de l'API d'authentification
async function testAuth(backendUrl) {
  try {
    const response = await makeRequest(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@facturly.com",
        password: "Admin123!",
      }),
    });

    if (response.statusCode === 200 || response.statusCode === 201) {
      success("API d'authentification fonctionnelle");
      return true;
    } else {
      warning(`API d'authentification retourne: ${response.statusCode}`);
      return false;
    }
  } catch (err) {
    error(`Erreur API d'authentification: ${err.message}`);
    return false;
  }
}

// Test de santé du backend
async function testBackendHealth(backendUrl) {
  try {
    info(`Test du backend: ${backendUrl}`);
    const response = await makeRequest(backendUrl);

    if (response.statusCode === 200) {
      success("Backend accessible");
      return true;
    } else {
      warning(`Backend retourne: ${response.statusCode}`);
      return false;
    }
  } catch (err) {
    error(`Backend inaccessible: ${err.message}`);
    return false;
  }
}

// Test de santé du frontend
async function testFrontendHealth(frontendUrl) {
  try {
    info(`Test du frontend: ${frontendUrl}`);
    const response = await makeRequest(frontendUrl);

    if (response.statusCode === 200) {
      success("Frontend accessible");

      // Vérifier que c'est bien une page Next.js
      if (
        response.data.includes("_next") ||
        response.data.includes("Next.js")
      ) {
        success("Application Next.js détectée");
      }

      return true;
    } else {
      warning(`Frontend retourne: ${response.statusCode}`);
      return false;
    }
  } catch (err) {
    error(`Frontend inaccessible: ${err.message}`);
    return false;
  }
}

// Test des headers de sécurité
async function testSecurityHeaders(url) {
  try {
    const response = await makeRequest(url);
    const headers = response.headers;

    const securityHeaders = [
      "x-frame-options",
      "x-content-type-options",
      "referrer-policy",
    ];

    let secureHeaders = 0;
    securityHeaders.forEach((header) => {
      if (headers[header]) {
        secureHeaders++;
      }
    });

    if (secureHeaders === securityHeaders.length) {
      success("Headers de sécurité configurés");
    } else {
      warning(
        `${secureHeaders}/${securityHeaders.length} headers de sécurité configurés`
      );
    }

    return secureHeaders === securityHeaders.length;
  } catch (err) {
    error(`Erreur test headers: ${err.message}`);
    return false;
  }
}

// Vérifier les fichiers de configuration
function checkConfigFiles() {
  const requiredFiles = [
    "netlify.toml",
    "Procfile",
    "backend/app.json",
    ".env.production",
    "DEPLOYMENT.md",
  ];

  let allFilesExist = true;

  requiredFiles.forEach((file) => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      success(`Fichier de configuration trouvé: ${file}`);
    } else {
      error(`Fichier de configuration manquant: ${file}`);
      allFilesExist = false;
    }
  });

  return allFilesExist;
}

// Fonction principale de test
async function runTests(environment = "production") {
  log(`\n🧪 Tests de production - Environnement: ${environment}`, "cyan");
  log("=".repeat(50), "cyan");

  if (!environments[environment]) {
    error(`Environnement non supporté: ${environment}`);
    process.exit(1);
  }

  const config = environments[environment];
  let allTestsPassed = true;

  // 1. Vérifier les fichiers de configuration
  log("\n📁 Vérification des fichiers de configuration", "magenta");
  const configCheck = checkConfigFiles();
  allTestsPassed = allTestsPassed && configCheck;

  // 2. Test du backend
  log("\n🖥️  Tests du backend", "magenta");
  const backendHealth = await testBackendHealth(config.backend);
  allTestsPassed = allTestsPassed && backendHealth;

  if (backendHealth) {
    const authTest = await testAuth(config.backend);
    allTestsPassed = allTestsPassed && authTest;
  }

  // 3. Test du frontend
  log("\n🌐 Tests du frontend", "magenta");
  const frontendHealth = await testFrontendHealth(config.frontend);
  allTestsPassed = allTestsPassed && frontendHealth;

  if (frontendHealth) {
    const securityTest = await testSecurityHeaders(config.frontend);
    allTestsPassed = allTestsPassed && securityTest;
  }

  // 4. Résumé
  log("\n📊 Résumé des tests", "magenta");
  if (allTestsPassed) {
    success("Tous les tests sont passés ! 🎉");
    log("\n✨ Votre application est prête pour la production !", "green");
  } else {
    error("Certains tests ont échoué");
    log(
      "\n🔧 Veuillez corriger les problèmes avant de déployer en production",
      "yellow"
    );
    process.exit(1);
  }

  // 5. Informations utiles
  log("\n🔗 URLs de l'application:", "cyan");
  log(`Frontend: ${config.frontend}`, "blue");
  log(`Backend:  ${config.backend}`, "blue");

  log("\n🧪 Comptes de test:", "cyan");
  log("Admin: admin@facturly.com / Admin123!", "blue");
  log("User:  user@test.com / Test123!", "blue");
}

// Exécution du script
const environment = process.argv[2] || "production";
runTests(environment).catch((err) => {
  error(`Erreur lors des tests: ${err.message}`);
  process.exit(1);
});
