const RECIPIENTS = {
  matias: "matias.ryynanen@lviloisto.fi",
  miro: "miro.sorjonen@lviloisto.fi",
};

const LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  location: 160,
  message: 5000,
};

const json = (data, status = 200) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

const clean = (value, maxLength) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function onRequestPost({ request, env }) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 20_000) {
    return json({ message: "Lomakkeen sisältö on liian pitkä." }, 413);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ message: "Lomakkeen tietoja ei voitu lukea." }, 400);
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const phone = clean(body.phone, LIMITS.phone);
  const location = clean(body.location, LIMITS.location);
  const message = clean(body.message, LIMITS.message);
  const company = clean(body.company, 120);
  const recipient = RECIPIENTS[body.recipient];

  // Bots commonly fill this field even though it is hidden from visitors.
  if (company) {
    return json({ ok: true });
  }

  if (!name || !isEmail(email) || !message || !recipient) {
    return json(
      { message: "Tarkista nimi, sähköpostiosoite, viesti ja vastaanottaja." },
      400,
    );
  }

  if (!env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY binding");
    return json(
      { message: "Viestin lähetys ei ole juuri nyt käytettävissä. Ota yhteyttä puhelimitse." },
      503,
    );
  }

  const lines = [
    "Uusi yhteydenottopyyntö LVI-Loiston verkkosivulta",
    "",
    `Nimi: ${name}`,
    `Sähköposti: ${email}`,
    `Puhelin: ${phone || "Ei annettu"}`,
    `Kohteen sijainti: ${location || "Ei annettu"}`,
    "",
    "Viesti:",
    message,
  ];

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL || "LVI-Loisto <verkkosivut@lviloisto.fi>",
      to: [recipient],
      reply_to: email,
      subject: `Uusi yhteydenottopyyntö: ${name.replace(/[\r\n]+/g, " ")}`,
      text: lines.join("\n"),
    }),
  });

  if (!resendResponse.ok) {
    const providerMessage = await resendResponse.text();
    console.error("Resend rejected contact form email", resendResponse.status, providerMessage);
    return json(
      { message: "Viestin lähetys ei onnistunut. Yritä uudelleen tai ota yhteyttä puhelimitse." },
      502,
    );
  }

  return json({ ok: true });
}
