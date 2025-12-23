
export async function fetchStatus(provider, providerOrderId) {
  const body = new URLSearchParams({
    key: provider.apiKey,
    action: 'status',
    order: providerOrderId
  });

  const res = await fetch(provider.apiUrl, {
    method: 'POST',
    body
  });

  return res.json();
}
