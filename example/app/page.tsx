
import Checkbox from "./components/checkbox";
import Input from "./components/input";
import { HookInput, HookLoginForm } from "./components/hook-form";

export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>react-unique-id-generator — Example</h1>

      <section>
        <h2>nextId() — Imperative API</h2>
        <Checkbox />
        <Checkbox />
        <Checkbox />
        <br />
        <Input />
        <Input />
        <Input />
      </section>

      <hr />

      <section>
        <h2>useUniqueId() — Hook API</h2>
        <HookInput label="First Name" />
        <HookInput label="Last Name" />
        <HookInput label="Email" />
      </section>

      <hr />

      <section>
        <h2>useUniqueIds() — Multiple IDs Hook</h2>
        <HookLoginForm />
      </section>
    </main>
  );
}
