// testAnalytics.ts
import { AnalyticsModel } from "./models/analyticsModel.ts";

const runTest = async () => {
  try {
    console.log("Running getSiteAnalytics() test...");

    const stats = await AnalyticsModel.getSiteAnalytics();

    console.log("✅ Site Analytics Result:", stats);
  } catch (error) {
    console.error("❌ Test Error:", error);
  }
};

await runTest();