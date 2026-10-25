/**
 * Prisma API Documentation Portal
 * Live Interactive API Request Playground & Simulated Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- UI References ---
  const httpMethodSelect = document.getElementById('httpMethodSelect');
  const endpointInput = document.getElementById('endpointInput');
  const sendRequestBtn = document.getElementById('sendRequestBtn');

  // Request Tabs
  const reqTabs = document.querySelectorAll('.req-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const paramsCount = document.getElementById('paramsCount');
  const headersCount = document.getElementById('headersCount');
  const bodyDot = document.getElementById('bodyDot');

  // Request Body
  const requestBodyTextarea = document.getElementById('requestBodyTextarea');
  const jsonValidBadge = document.getElementById('jsonValidBadge');
  const formatJsonBtn = document.getElementById('formatJsonBtn');
  const clearBodyBtn = document.getElementById('clearBodyBtn');

  // Auth Controls
  const authTypeSelect = document.getElementById('authTypeSelect');
  const bearerTokenInput = document.getElementById('bearerTokenInput');
  const toggleTokenVisibility = document.getElementById('toggleTokenVisibility');
  const authHeaderValue = document.getElementById('authHeaderValue');
  const authTokenRow = document.getElementById('authTokenRow');

  // Tables
  const paramsTableBody = document.getElementById('paramsTableBody');
  const addParamRowBtn = document.getElementById('addParamRowBtn');
  const headersTableBody = document.getElementById('headersTableBody');
  const addHeaderRowBtn = document.getElementById('addHeaderRowBtn');

  // Recipe Buttons
  const recipeButtons = document.querySelectorAll('.recipe-btn');

  // Response UI
  const responseStatusBadge = document.getElementById('responseStatusBadge');
  const latencyValue = document.getElementById('latencyValue');
  const sizeValue = document.getElementById('sizeValue');
  const responseLoadingOverlay = document.getElementById('responseLoadingOverlay');
  const responseJsonOutput = document.getElementById('responseJsonOutput');
  const responseHeadersOutput = document.getElementById('responseHeadersOutput');
  const responseRawOutput = document.getElementById('responseRawOutput');
  const respTabs = document.querySelectorAll('.resp-tab');
  const respPanes = document.querySelectorAll('.resp-pane');
  const copyResponseBtn = document.getElementById('copyResponseBtn');
  const clearResponseBtn = document.getElementById('clearResponseBtn');

  // Toast
  const toastNotification = document.getElementById('toastNotification');

  // Stored state for current response
  let lastResponseData = null;

  // --- Pre-configured Recipe Data ---
  const RECIPES = {
    dispatch: {
      method: 'POST',
      endpoint: '/v1/agents/dispatch',
      body: JSON.stringify({
        agent_id: 'rag-worker-01',
        task: 'summarize-documents',
        parameters: {
          collection: 'sec-filings-2026',
          chunk_overlap: 64,
          temperature: 0.2
        },
        max_tokens: 1024,
        stream: false
      }, null, 2)
    },
    models: {
      method: 'GET',
      endpoint: '/v1/models',
      body: ''
    },
    embeddings: {
      method: 'POST',
      endpoint: '/v1/embeddings',
      body: JSON.stringify({
        model: 'prisma-embeddings-base',
        input: 'Decentralized multi-agent consensus protocols for real-time vector retrieval.',
        dimensions: 1536
      }, null, 2)
    },
    status: {
      method: 'GET',
      endpoint: '/v1/agents/agent-7749/status',
      body: ''
    },
    delete: {
      method: 'DELETE',
      endpoint: '/v1/agents/agent-7749',
      body: ''
    }
  };

  // --- Method Color Styling ---
  function updateMethodStyles(method) {
    httpMethodSelect.classList.remove('get', 'post', 'put', 'delete');
    httpMethodSelect.classList.add(method.toLowerCase());
  }

  httpMethodSelect.addEventListener('change', () => {
    updateMethodStyles(httpMethodSelect.value);
    if (httpMethodSelect.value === 'GET' || httpMethodSelect.value === 'DELETE') {
      if (document.querySelector('.req-tab[data-tab="tab-body"]').classList.contains('active')) {
        switchReqTab('tab-params');
      }
    } else {
      switchReqTab('tab-body');
    }
  });

  // --- Request Tabs Logic ---
  function switchReqTab(tabId) {
    reqTabs.forEach(t => {
      const isActive = t.dataset.tab === tabId;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    tabPanes.forEach(p => {
      p.style.display = p.id === tabId ? 'block' : 'none';
      p.classList.toggle('active', p.id === tabId);
    });
  }

  reqTabs.forEach(tab => {
    tab.addEventListener('click', () => switchReqTab(tab.dataset.tab));
  });

  // --- Response Tabs Logic ---
  function switchRespTab(paneId) {
    respTabs.forEach(t => t.classList.toggle('active', t.dataset.resptab === paneId));
    respPanes.forEach(p => {
      p.style.display = p.id === paneId ? 'block' : 'none';
      p.classList.toggle('active', p.id === paneId);
    });
  }

  respTabs.forEach(tab => {
    tab.addEventListener('click', () => switchRespTab(tab.dataset.resptab));
  });

  // --- Recipe Selector ---
  recipeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      recipeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const recipeKey = btn.dataset.recipe;
      const recipe = RECIPES[recipeKey];
      if (!recipe) return;

      httpMethodSelect.value = recipe.method;
      updateMethodStyles(recipe.method);
      endpointInput.value = recipe.endpoint;

      if (recipe.body) {
        requestBodyTextarea.value = recipe.body;
        switchReqTab('tab-body');
      } else {
        requestBodyTextarea.value = '';
        switchReqTab('tab-params');
      }

      validateJsonBody();
      updateBadges();
      showToast(`Loaded ${recipe.method} ${recipe.endpoint}`);
    });
  });

  // --- Body JSON Validation & Formatting ---
  function validateJsonBody() {
    const raw = requestBodyTextarea.value.trim();
    if (!raw) {
      jsonValidBadge.className = 'valid-badge valid';
      jsonValidBadge.textContent = 'Empty Body';
      bodyDot.classList.remove('has-body');
      return true;
    }

    bodyDot.classList.add('has-body');
    try {
      JSON.parse(raw);
      jsonValidBadge.className = 'valid-badge valid';
      jsonValidBadge.textContent = '✓ Valid JSON';
      return true;
    } catch (err) {
      jsonValidBadge.className = 'valid-badge invalid';
      jsonValidBadge.textContent = '⚠ Invalid JSON';
      return false;
    }
  }

  requestBodyTextarea.addEventListener('input', validateJsonBody);

  formatJsonBtn.addEventListener('click', () => {
    const raw = requestBodyTextarea.value.trim();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      requestBodyTextarea.value = JSON.stringify(parsed, null, 2);
      validateJsonBody();
      showToast('JSON formatted');
    } catch (err) {
      showToast('Cannot format: Syntax error in JSON');
    }
  });

  clearBodyBtn.addEventListener('click', () => {
    requestBodyTextarea.value = '';
    validateJsonBody();
    showToast('Request body cleared');
  });

  // --- Auth & Header Synchronization ---
  if (authTypeSelect && bearerTokenInput && authHeaderValue) {
    function syncAuth() {
      const type = authTypeSelect.value;
      if (type === 'none') {
        authTokenRow.style.display = 'none';
        authHeaderValue.value = '';
      } else {
        authTokenRow.style.display = 'flex';
        authHeaderValue.value = bearerTokenInput.value.trim() ? `Bearer ${bearerTokenInput.value.trim()}` : '';
      }
      updateBadges();
    }

    authTypeSelect.addEventListener('change', syncAuth);
    bearerTokenInput.addEventListener('input', syncAuth);

    authHeaderValue.addEventListener('input', () => {
      const val = authHeaderValue.value.trim();
      if (val.startsWith('Bearer ')) {
        authTypeSelect.value = 'bearer';
        authTokenRow.style.display = 'flex';
        bearerTokenInput.value = val.slice(7);
      } else if (!val) {
        authTypeSelect.value = 'none';
        authTokenRow.style.display = 'none';
      }
    });

    toggleTokenVisibility.addEventListener('click', () => {
      const isPassword = bearerTokenInput.type === 'password';
      bearerTokenInput.type = isPassword ? 'text' : 'password';
      toggleTokenVisibility.textContent = isPassword ? '🔒' : '👁️';
    });
  }

  // --- Dynamic Table Rows (Params & Headers) ---
  function updateBadges() {
    // Count active params
    const activeParams = paramsTableBody.querySelectorAll('.kv-enable:checked').length;
    paramsCount.textContent = activeParams;

    // Count active headers
    const activeHeaders = headersTableBody.querySelectorAll('.kv-enable:checked').length;
    headersCount.textContent = activeHeaders;
  }

  function addRow(tbody, defaultKey = '', defaultVal = '') {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="checkbox" checked class="kv-enable" /></td>
      <td><input type="text" class="kv-input kv-key" value="${defaultKey}" placeholder="key" /></td>
      <td><input type="text" class="kv-input kv-val" value="${defaultVal}" placeholder="value" /></td>
      ${tbody === paramsTableBody ? '<td><span class="kv-desc">Custom parameter</span></td>' : ''}
      <td><button type="button" class="btn-del-row" title="Remove">×</button></td>
    `;
    tbody.appendChild(tr);

    tr.querySelector('.btn-del-row').addEventListener('click', () => {
      tr.remove();
      updateBadges();
      syncEndpointQueryParams();
    });

    tr.querySelector('.kv-enable').addEventListener('change', () => {
      updateBadges();
      syncEndpointQueryParams();
    });

    tr.querySelectorAll('.kv-input').forEach(inp => {
      inp.addEventListener('input', syncEndpointQueryParams);
    });

    updateBadges();
  }

  addParamRowBtn.addEventListener('click', () => addRow(paramsTableBody));
  addHeaderRowBtn.addEventListener('click', () => addRow(headersTableBody));

  // Bind initial delete and checkbox events
  document.querySelectorAll('.kv-table').forEach(tbl => {
    tbl.addEventListener('click', e => {
      if (e.target.classList.contains('btn-del-row')) {
        const row = e.target.closest('tr');
        if (row) {
          row.remove();
          updateBadges();
          syncEndpointQueryParams();
        }
      }
    });

    tbl.addEventListener('change', e => {
      if (e.target.classList.contains('kv-enable')) {
        updateBadges();
        syncEndpointQueryParams();
      }
    });

    tbl.addEventListener('input', e => {
      if (e.target.classList.contains('kv-input')) {
        syncEndpointQueryParams();
      }
    });
  });

  // Synchronize endpoint query params with table
  function syncEndpointQueryParams() {
    let base = endpointInput.value.split('?')[0];
    const pairs = [];

    paramsTableBody.querySelectorAll('tr').forEach(tr => {
      const isEnabled = tr.querySelector('.kv-enable')?.checked;
      const key = tr.querySelector('.kv-key')?.value.trim();
      const val = tr.querySelector('.kv-val')?.value.trim();
      if (isEnabled && key) {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(val || '')}`);
      }
    });

    endpointInput.value = pairs.length > 0 ? `${base}?${pairs.join('&')}` : base;
  }

  // --- Syntax Highlighter for JSON ---
  function syntaxHighlightJson(jsonObj) {
    const jsonStr = JSON.stringify(jsonObj, null, 2);
    const escaped = jsonStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?|[{}\[\],:])/g,
      match => {
        let cls = 'json-num';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-str';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-bool';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        } else if (/[{}\[\],:]/.test(match)) {
          cls = 'json-punct';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  }

  // --- Realistic Simulated Response Engine ---
  function generateMockResponse(method, endpoint, bodyText, headers) {
    const cleanEndpoint = endpoint.split('?')[0].replace(/\/+$/, '');
    const hasAuth = !!headers['authorization'];

    // 1. Check Authentication
    if (!hasAuth || !headers['authorization'].includes('prisma_live_')) {
      return {
        status: 401,
        statusText: 'Unauthorized',
        body: {
          error: {
            code: 'unauthorized',
            message: 'Invalid or missing Bearer token. Please provide a valid authorization key in your request header.',
            docs: 'https://docs.prisma.io/authentication'
          }
        }
      };
    }

    // 2. Validate JSON body for POST / PUT
    let parsedBody = null;
    if ((method === 'POST' || method === 'PUT') && bodyText.trim()) {
      try {
        parsedBody = JSON.parse(bodyText.trim());
      } catch (err) {
        return {
          status: 400,
          statusText: 'Bad Request',
          body: {
            error: {
              code: 'invalid_json',
              message: 'Failed to parse JSON body payload: ' + err.message
            }
          }
        };
      }
    }

    // 3. Dispatch Agent Task
    if (cleanEndpoint === '/v1/agents/dispatch' && method === 'POST') {
      const agentId = parsedBody?.agent_id || 'rag-worker-01';
      const task = parsedBody?.task || 'unnamed-task';
      return {
        status: 201,
        statusText: 'Created',
        body: {
          status: 'success',
          job_id: 'job_disp_' + Math.random().toString(36).substring(2, 9),
          agent: {
            id: agentId,
            cluster: 'us-east-cluster-primary',
            worker_node: 'worker-node-4b',
            state: 'dispatched'
          },
          task: {
            type: task,
            priority: 'high',
            max_tokens: parsedBody?.max_tokens || 1024,
            concurrency_slots: 1
          },
          metrics: {
            queue_position: 1,
            estimated_latency_ms: Math.floor(Math.random() * 80 + 140),
            billing_tier: 'enterprise-prime'
          },
          created_at: new Date().toISOString()
        }
      };
    }

    // 4. List Models
    if (cleanEndpoint === '/v1/models' && method === 'GET') {
      return {
        status: 200,
        statusText: 'OK',
        body: {
          object: 'list',
          data: [
            {
              id: 'prisma-agent-orchestrator-v2',
              object: 'model',
              created: 1729000000,
              owned_by: 'prisma',
              context_window: 131072,
              capabilities: ['multi-agent', 'function-calling', 'streaming', 'vision']
            },
            {
              id: 'prisma-embeddings-base',
              object: 'model',
              created: 1728500000,
              owned_by: 'prisma',
              context_window: 8192,
              capabilities: ['vector-embeddings', 'dense-retrieval']
            },
            {
              id: 'prisma-reasoning-preview',
              object: 'model',
              created: 1729500000,
              owned_by: 'prisma',
              context_window: 65536,
              capabilities: ['extended-chain-of-thought', 'code-execution']
            }
          ]
        }
      };
    }

    // 5. Generate Vector Embeddings
    if (cleanEndpoint === '/v1/embeddings' && method === 'POST') {
      const textInput = parsedBody?.input || 'Sample text';
      // Generate realistic preview vector floats
      const vectorPreview = [
        0.024518, -0.013982, 0.089124, -0.045129, 0.003419,
        0.051283, -0.038192, 0.019482, -0.062194, 0.041837
      ];

      return {
        status: 200,
        statusText: 'OK',
        body: {
          object: 'list',
          data: [
            {
              object: 'embedding',
              index: 0,
              embedding_dimensions: parsedBody?.dimensions || 1536,
              preview_values: vectorPreview,
              truncated: '... (1526 remaining floats omitted for display)'
            }
          ],
          model: parsedBody?.model || 'prisma-embeddings-base',
          usage: {
            prompt_tokens: Math.max(12, Math.floor(textInput.length / 4)),
            total_tokens: Math.max(12, Math.floor(textInput.length / 4))
          }
        }
      };
    }

    // 6. Agent Status
    if (cleanEndpoint.startsWith('/v1/agents/') && cleanEndpoint.endsWith('/status') && method === 'GET') {
      const parts = cleanEndpoint.split('/');
      const agentId = parts[3] || 'agent-7749';

      return {
        status: 200,
        statusText: 'OK',
        body: {
          agent_id: agentId,
          health: 'healthy',
          uptime_seconds: 184920,
          active_workers: 8,
          memory_load_pct: 42.6,
          last_heartbeat: new Date().toISOString(),
          assigned_cluster: 'us-east-1'
        }
      };
    }

    // 7. Delete Agent
    if (cleanEndpoint.startsWith('/v1/agents/') && method === 'DELETE') {
      const parts = cleanEndpoint.split('/');
      const agentId = parts[3] || 'agent-7749';

      return {
        status: 200,
        statusText: 'OK',
        body: {
          status: 'terminated',
          agent_id: agentId,
          memory_freed_mb: 2048,
          terminated_at: new Date().toISOString()
        }
      };
    }

    // 8. Fallback Generic 200 for custom endpoint
    return {
      status: 200,
      statusText: 'OK',
      body: {
        message: 'Request successfully received by Prisma Gateway.',
        request: {
          method,
          endpoint: cleanEndpoint,
          headers: Object.keys(headers),
          payload: parsedBody || null
        },
        timestamp: new Date().toISOString()
      }
    };
  }

  // --- Send Request Action ---
  function executeRequest() {
    const method = httpMethodSelect.value;
    const endpoint = endpointInput.value.trim() || '/';
    const bodyText = requestBodyTextarea.value;

    // Collect active headers
    const headers = {};
    headersTableBody.querySelectorAll('tr').forEach(tr => {
      const isEnabled = tr.querySelector('.kv-enable')?.checked;
      const key = tr.querySelector('.kv-key')?.value.trim().toLowerCase();
      const val = tr.querySelector('.kv-val')?.value.trim();
      if (isEnabled && key) {
        headers[key] = val;
      }
    });

    // Show loading indicator
    responseLoadingOverlay.style.display = 'flex';
    sendRequestBtn.classList.add('loading');
    sendRequestBtn.disabled = true;

    // Simulate realistic network latency between 190ms and 380ms
    const simulatedLatencyMs = Math.floor(Math.random() * 190 + 190);

    setTimeout(() => {
      const mockResult = generateMockResponse(method, endpoint, bodyText, headers);
      lastResponseData = mockResult;

      // Update Status Badge
      const isSuccess = mockResult.status >= 200 && mockResult.status < 300;
      responseStatusBadge.className = `status-badge status-${mockResult.status}`;
      responseStatusBadge.textContent = `${mockResult.status} ${mockResult.statusText}`;

      // Update Latency
      latencyValue.textContent = `${simulatedLatencyMs} ms`;

      // Formatted JSON String
      const jsonStr = JSON.stringify(mockResult.body, null, 2);
      const byteSize = new Blob([jsonStr]).size;
      sizeValue.textContent = byteSize >= 1024 ? `${(byteSize / 1024).toFixed(2)} KB` : `${byteSize} B`;

      // Render Syntax-Highlighted JSON
      responseJsonOutput.querySelector('code').innerHTML = syntaxHighlightJson(mockResult.body);

      // Render Raw
      responseRawOutput.textContent = JSON.stringify(mockResult.body);

      // Render Headers
      const respHeaders = [
        'content-type: application/json; charset=utf-8',
        `content-length: ${byteSize}`,
        'server: prisma-gateway/v2.4',
        `x-request-id: req_${Math.random().toString(36).substring(2, 12)}`,
        'x-ratelimit-limit: 1000',
        'x-ratelimit-remaining: ' + Math.floor(Math.random() * 50 + 940),
        `x-response-time: ${simulatedLatencyMs}ms`,
        'access-control-allow-origin: *',
        `date: ${new Date().toUTCString()}`
      ];
      responseHeadersOutput.textContent = respHeaders.join('\n');
      document.getElementById('respHeadersCount').textContent = respHeaders.length;

      // Remove loading overlay
      responseLoadingOverlay.style.display = 'none';
      sendRequestBtn.classList.remove('loading');
      sendRequestBtn.disabled = false;

      // Ensure Body tab is active on new response
      switchRespTab('resptab-body');
    }, simulatedLatencyMs);
  }

  sendRequestBtn.addEventListener('click', executeRequest);

  // Keyboard shortcut: Ctrl + Enter or Cmd + Enter inside composer
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) {
        e.preventDefault();
        executeRequest();
      }
    }
  });

  // --- Copy Response ---
  copyResponseBtn.addEventListener('click', () => {
    if (!lastResponseData) {
      showToast('No response to copy');
      return;
    }
    const textToCopy = JSON.stringify(lastResponseData.body, null, 2);
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Response JSON copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy to clipboard');
    });
  });

  // --- Clear Response ---
  clearResponseBtn.addEventListener('click', () => {
    responseJsonOutput.querySelector('code').innerHTML = '<span class="json-punct">// Response cleared. Send a request to see output.</span>';
    responseRawOutput.textContent = '';
    responseHeadersOutput.textContent = '';
    responseStatusBadge.className = 'status-badge status-empty';
    responseStatusBadge.textContent = '--- No Request';
    latencyValue.textContent = '0 ms';
    sizeValue.textContent = '0 B';
    lastResponseData = null;
    showToast('Response console cleared');
  });

  // --- Toast Notification Helper ---
  let toastTimer = null;
  function showToast(msg) {
    if (!toastNotification) return;
    toastNotification.textContent = msg;
    toastNotification.style.display = 'block';
    toastNotification.classList.add('visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('visible');
      setTimeout(() => {
        toastNotification.style.display = 'none';
      }, 250);
    }, 2400);
  }

  // --- Initial Setup ---
  validateJsonBody();
  updateBadges();
  console.log('Prisma API Request Playground ready');
});

// --- Global Snippet Copy Helper ---
function copySnippet(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`Copied to clipboard:\n${text}`);
  }).catch(() => {
    prompt('Copy snippet:', text);
  });
}
