const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

const startTime = new Date();

// JSON middleware
app.use(express.json());

// Health check endpoint (Readiness & Liveness Probe for Cloud Run)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'dockerized-app-cloudrun-deploy',
    region: process.env.K_SERVICE ? 'asia-south1 (Cloud Run)' : 'local',
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100
  });
});

// Diagnostic & Runtime Info
app.get('/api/info', (req, res) => {
  res.json({
    project: 'Containerized App Deployment on GCP Cloud Run',
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    port: PORT,
    cloudRunMetadata: {
      service: process.env.K_SERVICE || 'local-dev',
      revision: process.env.K_REVISION || 'none',
      configuration: process.env.K_CONFIGURATION || 'none'
    },
    bootTime: startTime.toISOString()
  });
});

// Root route: Assessment Presentation Dashboard
app.get('/', (req, res) => {
  const isCloudRun = Boolean(process.env.K_SERVICE);
  const serviceName = process.env.K_SERVICE || 'dockerized-app-cloudrun-deploy';
  const revision = process.env.K_REVISION || 'local-test';

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Containerized App Deployment on GCP Cloud Run</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(22, 29, 47, 0.7);
      --card-border: rgba(255, 255, 255, 0.08);
      --accent-blue: #3b82f6;
      --accent-cyan: #06b6d4;
      --accent-green: #10b981;
      --accent-purple: #8b5cf6;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --code-bg: #0f172a;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: var(--bg);
      background-image: 
        radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%);
      color: var(--text-main);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2.5rem 1.5rem;
    }
    .container {
      width: 100%;
      max-width: 960px;
    }
    header {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--accent-green);
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      margin-bottom: 1.25rem;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      background-color: var(--accent-green);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--accent-green);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.2); }
    }
    h1 {
      font-size: 2.4rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      line-height: 1.2;
      background: linear-gradient(135deg, #ffffff 30%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.75rem;
    }
    .subtitle {
      color: var(--text-muted);
      font-size: 1.1rem;
      max-width: 640px;
      margin: 0 auto;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      backdrop-filter: blur(16px);
      border-radius: 16px;
      padding: 1.5rem;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .card:hover {
      transform: translateY(-2px);
      border-color: rgba(59, 130, 246, 0.4);
    }
    .card-title {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .metric-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-main);
      font-family: 'JetBrains Mono', monospace;
    }
    .metric-sub {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.35rem;
    }
    .card-full {
      grid-column: 1 / -1;
    }
    .pipeline-steps {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .step-item {
      background: var(--code-bg);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 1rem;
    }
    .step-num {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--accent-cyan);
      margin-bottom: 0.3rem;
    }
    .step-name {
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
    .step-desc {
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.4;
    }
    .actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
      color: white;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
    .btn:hover {
      opacity: 0.9;
    }
    .btn-outline {
      background: transparent;
      border: 1px solid var(--card-border);
      color: var(--text-main);
    }
    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    #probe-result {
      margin-top: 1rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.82rem;
      background: var(--code-bg);
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: none;
      overflow-x: auto;
    }
    footer {
      margin-top: auto;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
      padding-top: 2rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge">
        <span class="pulse-dot"></span>
        <span>Service Active • ${isCloudRun ? 'Cloud Run Managed' : 'Local Container'}</span>
      </div>
      <h1>Containerized App Deployment on GCP Cloud Run</h1>
      <p class="subtitle">End-to-End Docker container build, Artifact Registry push, and serverless Cloud Run orchestration in region <strong>asia-south1</strong>.</p>
    </header>

    <div class="grid">
      <div class="card">
        <div class="card-title">Runtime Environment</div>
        <div class="metric-value">${isCloudRun ? 'Google Cloud Run' : 'Docker Local'}</div>
        <div class="metric-sub">Revision: <code>${revision}</code></div>
      </div>

      <div class="card">
        <div class="card-title">Target Region</div>
        <div class="metric-value">asia-south1</div>
        <div class="metric-sub">Mumbai, India</div>
      </div>

      <div class="card">
        <div class="card-title">Container Port</div>
        <div class="metric-value">:${PORT}</div>
        <div class="metric-sub">Listening on 0.0.0.0</div>
      </div>

      <div class="card card-full">
        <div class="card-title">CI/CD Deployment Pipeline Flow</div>
        <div class="pipeline-steps">
          <div class="step-item">
            <div class="step-num">STEP 01</div>
            <div class="step-name">Local Build</div>
            <div class="step-desc">Docker multi-arch build with <code>--platform linux/amd64</code></div>
          </div>
          <div class="step-item">
            <div class="step-num">STEP 02</div>
            <div class="step-name">Local Verify</div>
            <div class="step-desc">Test health-check on <code>:8080/health</code></div>
          </div>
          <div class="step-item">
            <div class="step-num">STEP 03</div>
            <div class="step-name">Artifact Registry</div>
            <div class="step-desc">Push to <code>asia-south1-docker.pkg.dev</code></div>
          </div>
          <div class="step-item">
            <div class="step-num">STEP 04</div>
            <div class="step-name">Cloud Run Deploy</div>
            <div class="step-desc">Auto-scaling HTTPS microservice</div>
          </div>
        </div>
      </div>

      <div class="card card-full">
        <div class="card-title">Interactive Live Health Probe</div>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.75rem;">
          Trigger the live health check API endpoint used by Cloud Run probes to confirm microservice readiness.
        </p>
        <div class="actions">
          <button class="btn" onclick="testHealth()">Probe /health Endpoint</button>
          <a class="btn btn-outline" href="/api/info" target="_blank">View Runtime Metadata (/api/info)</a>
        </div>
        <pre id="probe-result"></pre>
      </div>
    </div>

    <footer>
      Assessment Project • Containerized App Deployment on GCP Cloud Run • asia-south1
    </footer>
  </div>

  <script>
    async function testHealth() {
      const display = document.getElementById('probe-result');
      display.style.display = 'block';
      display.textContent = 'Probing /health endpoint...';
      try {
        const start = performance.now();
        const res = await fetch('/health');
        const duration = Math.round(performance.now() - start);
        const data = await res.json();
        display.innerHTML = '<span style="color: #10b981;">HTTP ' + res.status + ' OK (' + duration + 'ms)</span>\\n' + JSON.stringify(data, null, 2);
      } catch (err) {
        display.innerHTML = '<span style="color: #ef4444;">Error probing endpoint:</span> ' + err.message;
      }
    }
  </script>
</body>
</html>`);
});

// Start Server
app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
  console.log(`Region: asia-south1 | Ready for traffic.`);
});
