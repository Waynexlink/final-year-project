const crypto = require("crypto");

function sha256(value) {
  if (!value) return null;
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const {
    event_id,
    event_name = "Lead",
    event_source_url,
    fbp,
    fbc,
    client_user_agent,
    content_name,
  } = body;

  const client_ip_address =
    event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    event.headers["client-ip"] ||
    null;

  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.error("[meta-capi] Missing env vars");
    return { statusCode: 500, body: "Server configuration error" };
  }

  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        event_source_url,
        action_source: "website",
        user_data: {
          client_ip_address,
          client_user_agent,
          fbp: fbp || null,
          fbc: fbc || null,
        },
        custom_data: {
          content_name: content_name || "",
          content_category: "Car Enquiry",
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    const result = await res.json();

    if (!res.ok) {
      console.error("[meta-capi] Meta API error:", result);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: result }),
      };
    }

    console.log("[meta-capi] Event sent successfully:", result);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("[meta-capi] Fetch error:", err);
    return { statusCode: 500, body: "Internal error" };
  }
};

//EAANtyMvF4CoBRg3QH28U2pFbUNnO3zKrPtfvjlPblmvPb1DrkTjsqVftsD27cdKozMom6wxaux2i2JPZBlXtpZAJxh4sb2a3kPABMPnJbijrtGZBGZAg81rgBcSaSFfoBqlxI4h2E3ryObYI47QI3LmkWBTd1wUhBD7GgbFAdQRQ7yfQxgt14YXAZAww23gZDZD
