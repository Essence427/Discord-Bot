const { chromium } = require('playwright');
const { MailSlurp } = require('mailslurp-client');
const { Client, GatewayIntentBits } = require('discord.js');

// ===== YOUR EXAMPLE VALUES =====
const API_KEY = "6c50b2e6cbaeefd8a82f4e4755d4afe593b3ab2aed77421bd4e63d6f84d6dc29";
const DISCORD_TOKEN = "MTQ4NDE2MDI2MDEzMzYxNzc2Ng.GVDm3g.emfHNCqe5DxbTupfKT-eiDZzfgGHpFqSXi6ZAA";
const CHANNEL_ID = "1483769428473675857";
// ==============================

const mailslurp = new MailSlurp({ apiKey: API_KEY });

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);

  try {
    // CREATE EMAIL
    const inbox = await mailslurp.createInbox();
    const email = inbox.emailAddress;
    const inboxId = inbox.id;

    const password = "Scott2001@";

    console.log("📧 Email:", email);

    // LAUNCH BROWSER (Render compatible)
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // GO TO SITE (CHANGE THIS URL)
    await page.goto("https://YOUR-SITE.com/signup", { waitUntil: "domcontentloaded" });

    // STEP 1 — EMAIL
    await page.waitForSelector('input[type="email"]', { timeout: 15000 });
    await page.fill('input[type="email"]', email);
    await page.click('button[type="submit"]');

    // STEP 2 — PASSWORD
    await page.waitForSelector('input[type="password"]', { timeout: 15000 });
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // WAIT FOR EMAIL CODE
    console.log("⏳ Waiting for OTP...");
    const mail = await mailslurp.waitForLatestEmail(inboxId, 60000);

    const match = mail.body.match(/\d{6}/);
    const code = match ? match[0] : null;

    if (!code) {
      console.log("❌ No code found");
      return;
    }

    console.log("🔢 Code:", code);

    // STEP 3 — ENTER CODE
    await page.waitForSelector('input[type="text"]', { timeout: 15000 });
    await page.fill('input[type="text"]', code);
    await page.click('button[type="submit"]');

    console.log("✅ Account created");

    // SEND TO DISCORD
    const channel = await client.channels.fetch(CHANNEL_ID);

    await channel.send(
      `✅ Account Created\n\n📧 Email: ${email}\n🔑 Password: ${password}`
    );

    console.log("📤 Sent to Discord");

    await browser.close();

  } catch (err) {
    console.error("❌ ERROR:", err);
  }
});

client.login(DISCORD_TOKEN);
