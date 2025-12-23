
export async function sendOrder(provider, payload) {
  const body = new URLSearchParams({
    key: provider.apiKey,
    action: 'add',
    service: payload.providerServiceId,
    link: payload.link,
    quantity: payload.quantity.toString()
  });

  const res = await fetch(provider.apiUrl, {
    method: 'POST',
    body
  });

  return res.json();
}
