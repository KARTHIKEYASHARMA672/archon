import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const TARGET_DIR_1 = path.resolve('L:/pr 15(esp)/sendiing files/screenshots/15_ARCHON');
const TARGET_DIR_2 = path.resolve('./screenshots');

if (!fs.existsSync(TARGET_DIR_1)) fs.mkdirSync(TARGET_DIR_1, { recursive: true });
if (!fs.existsSync(TARGET_DIR_2)) fs.mkdirSync(TARGET_DIR_2, { recursive: true });

async function saveScreenshot(page, filename) {
  const file1 = path.join(TARGET_DIR_1, filename);
  const file2 = path.join(TARGET_DIR_2, filename);
  await page.screenshot({ path: file1, fullPage: false });
  fs.copyFileSync(file1, file2);
  console.log(`Saved: ${filename} to both directories`);
}

async function run() {
  console.log('Launching installed Chrome on http://localhost:4288/ ...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: [
      '--headless=new',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--no-sandbox'
    ]
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('Browser console error:', msg.text());
    }
  });

  console.log('Navigating to http://localhost:4288/ ...');
  await page.goto('http://localhost:4288/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Initial Atelier Split View
  await saveScreenshot(page, '01_atelier_concept_generator.png');

  // 2. 2D Blueprint Full View
  console.log('Capturing 2D Blueprint full view...');
  await page.locator('button:has-text("2D Blueprint")').click({ force: true });
  await page.waitForTimeout(1000);
  await saveScreenshot(page, '02_interactive_2d_blueprint_drafting.png');

  // 3. 3D WebGL Studio Full View
  console.log('Capturing 3D Studio full view...');
  await page.locator('button:has-text("3D Studio")').click({ force: true });
  await page.waitForTimeout(1200);
  await saveScreenshot(page, '03_3d_webgl_dollhouse_view.png');

  // 4. Sun Study Solar Shadow Simulation
  console.log('Capturing Sun Study (Golden Hour)...');
  await page.locator('button:has-text("Sun Study")').click({ force: true });
  await page.waitForTimeout(600);
  const goldBtn = page.locator('button:has-text("Gold (17:30)")').first();
  if (await goldBtn.count() > 0) {
    await goldBtn.click({ force: true });
    await page.waitForTimeout(800);
  }
  await saveScreenshot(page, '04_solar_shadow_study_golden_hour.png');

  // Close Sun Study drawer
  await page.locator('button:has-text("Sun Study")').click({ force: true });
  await page.waitForTimeout(400);

  // 5. Tactile Material Customizer (Switch back to Split View)
  console.log('Capturing Tactile Material Customizer...');
  await page.locator('button:has-text("Split View")').click({ force: true });
  await page.waitForTimeout(600);
  const travertineBtn = page.locator('button:has-text("Honed Roman Travertine")').first();
  if (await travertineBtn.count() > 0) {
    await travertineBtn.click({ force: true });
    await page.waitForTimeout(600);
  }
  await saveScreenshot(page, '05_tactile_material_customizer.png');

  // 6. Space Utilization Analytics
  console.log('Capturing Space Analytics...');
  await page.locator('button:has-text("Space Analytics")').first().click({ force: true });
  await page.waitForTimeout(800);
  await saveScreenshot(page, '06_space_utilization_analytics.png');

  // Close Space Analytics
  const closeAnalytics = page.locator('button:has-text("Close")').first();
  if (await closeAnalytics.count() > 0) {
    await closeAnalytics.click({ force: true });
    await page.waitForTimeout(400);
  }

  // 7. Parametric Cost Estimation Engine Modal
  console.log('Capturing Cost Estimator Model...');
  await page.locator('button:has-text("Cost Model")').click({ force: true });
  await page.waitForTimeout(800);
  await saveScreenshot(page, '07_parametric_cost_estimation_engine.png');

  // Close cost modal
  const closeCost = page.locator('button:has-text("Apply & Close")').first();
  if (await closeCost.count() > 0) {
    await closeCost.click({ force: true });
    await page.waitForTimeout(400);
  }

  // 8. Architectural Specification Dossier
  console.log('Capturing Architectural Dossier...');
  await page.locator('button:has-text("Dossier")').click({ force: true });
  await page.waitForTimeout(800);
  await saveScreenshot(page, '08_architectural_dossier_spec_sheet.png');

  await browser.close();
  console.log('All 8 verified visual screenshots successfully captured and copied to 15_ARCHON and ./screenshots!');
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});