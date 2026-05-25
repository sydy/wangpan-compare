import { validateAllData } from "../src/data/validate";

try {
  validateAllData();
  console.log("Data validation passed.");
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
