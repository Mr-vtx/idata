export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const fileId = url.pathname.split("/")[2];

    if (!fileId) {
      return new Response(JSON.stringify({ error: "Missing fileId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // force download param
    const dl = url.searchParams.get("dl") || "1";
    const rangeHeader = request.headers.get("Range") || "";

    const upstream = await fetch(
      `https://idata-8jhr.onrender.com/v1/download/${fileId}?dl=${dl}`,
      {
        headers: {
          ...(rangeHeader && { Range: rangeHeader }),
        },
      }
    );

    if (!upstream.ok && upstream.status !== 206) {
      return new Response("File not found", { status: upstream.status });
    }

    const headers = new Headers();
    headers.set("Content-Type", upstream.headers.get("Content-Type") || "video/mp4");
    headers.set("Content-Disposition", upstream.headers.get("Content-Disposition") || "attachment");
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "no-store");
    headers.set("Access-Control-Allow-Origin", "*");

    const contentLength = upstream.headers.get("Content-Length");
    if (contentLength) headers.set("Content-Length", contentLength);

    const contentRange = upstream.headers.get("Content-Range");
    if (contentRange) headers.set("Content-Range", contentRange);

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  },
};
