// createAdminUser.ts
import { hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { db } from "../config/db.ts";

// Helper to prompt for user input
const prompt = async (label: string): Promise<string> => {
  const input = promptSync(`${label}: `);
  if (!input) throw new Error(`${label} is required`);
  return input.trim();
};

// Sync console prompt
const promptSync = (message: string): string | null => {
  const buf = new Uint8Array(1024);
  Deno.stdout.writeSync(new TextEncoder().encode(message));
  const n = <number> Deno.stdin.readSync(buf);
  return new TextDecoder().decode(buf.subarray(0, n)).trim();
};

try {
  console.log("\n=== Admin User Creation Utility ===");

  const username = await prompt("Username");
  const siteKey = await prompt("Site Key");
  const password = await prompt("Password");

  // Check if username already exists
  const [existing] = await db.query(
    "SELECT id FROM admin_users WHERE username = ? AND site_key = ?",
    [username, siteKey],
  );

  if (existing) {
    console.error("❌ That username already exists for this site.");
    Deno.exit(1);
  }

  // Hash password securely
  const hashed = await hash(password);

  await db.execute(
    "INSERT INTO admin_users (username, site_key, password_hash) VALUES (?, ?, ?)",
    [username, siteKey, hashed],
  );

  console.log(`✅ Admin user "${username}" created successfully for site "${siteKey}".`);
  Deno.exit(0);
} catch (err) {
  console.error("❌ Error:", err.message);
  Deno.exit(1);
}