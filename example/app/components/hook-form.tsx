"use client";

import React from "react";
import { useUniqueId, useUniqueIds } from "../../../lib/index";

/**
 * Demonstrates the useUniqueId hook — each component instance
 * gets a stable, unique ID that persists across re-renders.
 */
export const HookInput: React.FC<{ label: string }> = ({ label }) => {
  const id = useUniqueId("hook-input-");

  return (
    <div style={{ marginBottom: 8 }}>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" placeholder={`id = ${id}`} />
    </div>
  );
};

/**
 * Demonstrates the useUniqueIds hook — generate multiple stable IDs
 * at once for forms with several fields.
 */
export const HookLoginForm: React.FC = () => {
  const [emailId, passwordId] = useUniqueIds(2, "login-");

  return (
    <form style={{ marginBottom: 16 }}>
      <h3>Login Form (useUniqueIds)</h3>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor={emailId}>Email</label>
        <input id={emailId} type="email" placeholder={`id = ${emailId}`} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label htmlFor={passwordId}>Password</label>
        <input id={passwordId} type="password" placeholder={`id = ${passwordId}`} />
      </div>
    </form>
  );
};
