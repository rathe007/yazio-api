export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>YAZIO Meal Logger</h1>
      <p>API backend for ChatGPT Custom GPT integration.</p>
      <p>
        See{" "}
        <a href="/.well-known/openapi.json">OpenAPI Spec</a>{" "}
        for available endpoints.
      </p>
    </main>
  );
}
