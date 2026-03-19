const { Client, GatewayIntentBits } = require('discord.js');
const { chromium } = require('playwright');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  // 🔥 RUN AUTOMATICALLY WHEN BOT STARTS
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const email = `test${Date.now()}@example.com`;
  const password = "Scott2001";

  try {
    // 👉 YOUR URL
    await page.goto('https://login.greeneking.co.uk/u/signup/identifier?state=hKFo2SA3alZKQldJWTgtMTFOVXhZM0x5c1NTeXE1VHA2VjRYOKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIDdSNFhuNTFWRmp5VGVFX0hfckloOTA0UW1hNTZJWjlSo2NpZNkgcjBFS3FMdm1ycGp3S1doM3VIR0dCWXdwNHpkRVRoZjM');

    // ⚠️ THESE SELECTORS MAY NEED CHANGING
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // wait for code input
    await page.waitForTimeout(5000); // wait 5s for next step

    // placeholder code
    const code = "123456";

    // ⚠️ UPDATE if needed
    await page.fill('input[type="text"]', code);

    console.log(`✅ DONE`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

  } catch (err) {
    console.error("❌ ERROR:", err);
  }

  await browser.close();
});

client.login(process.env.TOKEN);
