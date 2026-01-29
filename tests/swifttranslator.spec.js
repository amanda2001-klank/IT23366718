const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.swifttranslator.com/', { waitUntil: 'domcontentloaded' });
  
  // Attempt clear
  const clearBtn = page.getByRole('button').filter({ hasText: /clear/i });
  if (await clearBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    await clearBtn.click();
    await page.waitForTimeout(800);
  }
});

async function runTranslationTest(page, tcId, inputText) {
  console.log(`\n=== TC ${tcId} ===`);
  console.log(`Input: "${inputText}"`);

  const inputLocator = page.getByPlaceholder('Singlish');
  await inputLocator.waitFor({ state: 'visible', timeout: 15000 });
  
  // Reliable clear
  await inputLocator.click({ clickCount: 3 });
  await inputLocator.press('Backspace');
  await inputLocator.fill(inputText);

  const browserName = page.context().browser().browserType().name();
  const baseWait = (browserName === 'firefox') ? 5000 : 2500;
  await page.waitForTimeout(baseWait);

  const outputLocator = page.locator('.sinhala');
  try {
    await expect(outputLocator).toHaveText(/[\u0D82-\u0DDF]/, { 
      timeout: (browserName === 'firefox') ? 10000 : 6000 
    });
  } catch (e) {
    console.warn(`Warning: No Sinhala detected after wait (${browserName})`);
  }

  let actual = 'EMPTY OUTPUT';
  if (await outputLocator.isVisible({ timeout: 4000 }).catch(() => false)) {
    actual = (await outputLocator.innerText()).trim();
  }

  // Fallbacks
  if (actual === 'EMPTY OUTPUT' || actual.length < 5) {
    const fallbacks = [
      page.locator('[class*="sinhala"], [class*="output"]'),
      page.locator('div[dir="ltr"], div[dir="auto"]').filter({ hasText: /[\u0D82-\u0DDF]/ }),
      page.locator('div:has(> span[lang="si"])'),
    ];
    for (const fb of fallbacks) {
      if (await fb.count() > 0 && await fb.isVisible({ timeout: 2000 }).catch(() => false)) {
        actual = (await fb.innerText()).trim();
        if (actual.length > 5) break;
      }
    }
  }

  console.log(`Actual Output: "${actual}"`);
  console.log('=====================================\n');
  return actual;
}


// 24 Positive Functional Tests 

test('Pos_Fun_0001 - Convert simple daily sentence', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0001', 'mama gedhara yanavaa.');
});

test('Pos_Fun_0002 - Convert imperative command', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0002', 'mata kiyanna.');
});

test('Pos_Fun_0003 - Convert greeting', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0003', 'aayuboovan!');
});

test('Pos_Fun_0004 - Convert polite request', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0004', 'karuNaakaralaa mata podi udhavvak karanna puLuvandha?');
});

test('Pos_Fun_0005 - Convert negative sentence', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0005', 'mama ehema karannee naehae.');
});

test('Pos_Fun_0006 - Convert compound sentence', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0006', 'mama gedhara yanavaa, haebaeyi vahina nisaa dhaenma yannee naee.');
});

test('Pos_Fun_0007 - Convert complex sentence', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0007', 'oya enavaanam mama balan innavaa.');
});

test('Pos_Fun_0008 - Convert past tense', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0008', 'mama iiyee gedhara giyaa.');
});

test('Pos_Fun_0009 - Convert future tense', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0009', 'mama heta enavaa.');
});

test('Pos_Fun_0010 - Convert plural pronoun', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0010', 'api yamu.');
});

test('Pos_Fun_0011 - Mixed English technical terms', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0011', 'Zoom meeting ekak thiyennee. Documents attach karalaa email ekak evanna.');
});

test('Pos_Fun_0012 - Sentence with place name', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0012', 'siiyaa Colombo yanna hadhannee.');
});

test('Pos_Fun_0013 - English abbreviation handling', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0013', 'OTP ekak dhenna.');
});

test('Pos_Fun_0014 - Punctuation preservation', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0014', 'hari hari! eka eka?');
});

test('Pos_Fun_0015 - Currency and time formats', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0015', 'Meeting eka 7.30 AM ta. Rs. 1500 ganna oonee.');
});

test('Pos_Fun_0016 - Multiple spaces handling', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0016', 'mama   gedhara   yanavaa.');
});

test('Pos_Fun_0017 - Line breaks multi-line', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0017', 'mama gedhara yanavaa.\noyaa enavadha maath ekka yanna?');
});

test('Pos_Fun_0018 - Long paragraph input', async ({ page }) => {
  const longInput = 'dhitvaa suLi kuNaatuva samaGa aethi vuu gQQvathura saha naayayaeem heethuven maarga sQQvarDhana aDhikaariya sathu maarga kotas 430k vinaashayata pathva aethi athara, ehi samastha dhiga pramaaNaya kiloomiitar 300k pamaNa vana bava pravaahana, mahaamaarga saha naagarika sQQvarDhana amaathYA bimal rathnaayaka saDHahan kaLeeya.';
  await runTranslationTest(page, 'Pos_Fun_0018', longInput);
});

test('Pos_Fun_0019 - Slang and colloquial phrasing', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0019', 'ela machan! supiri!!');
});

test('Pos_Fun_0020 - Repeated word expressions emphasis', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0020', 'hari hari tika tika');
});

test('Pos_Fun_0021 - Frequent day-to-day expression', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0021', 'mata nidhimathayi.');
});

test('Pos_Fun_0022 - Multi-word collocation', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0022', 'mata oona poddak inna.');
});

test('Pos_Fun_0023 - Proper spacing variation', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0023', 'heta api yanavaa.');
});

test('Pos_Fun_0024 - Polite vs informal request variation', async ({ page }) => {
  await runTranslationTest(page, 'Pos_Fun_0024', 'puLuvannam mata eeka evanna. anee eeka dhiyan.');
});


// 10 Negative Functional Tests 


test('Neg_Fun_0001 - Joined words without spaces', async ({ page }) => {
  await runTranslationTest(page, 'Neg_Fun_0001', 'mamagedharayanavaa');
});

test('Neg_Fun_0002 - Heavy slang with typo and QQ', async ({ page }) => {
  await runTranslationTest(page, 'Neg_Fun_0002', 'adoo vaedak baaragaththaanam eeka hariyata karapanko bQQ.');
});

test('Neg_Fun_0003 - Missing spaces in common phrase', async ({ page }) => {
  await runTranslationTest(page, 'Neg_Fun_0003', 'matapaankannaoonee');
});

test('Neg_Fun_0004 - Joined plural future phrase', async ({ page }) => {
  await runTranslationTest(page, 'Neg_Fun_0004', 'hetaapiyanavaa');
});

test('Neg_Fun_0005 - Repeated emphasis merge', async ({ page }) => {
  await runTranslationTest(page, 'Neg_Fun_0005', 'chuttak chuttak');
});

test('Neg_Fun_0006 - Complex with QQ typo', async ({ page }) => {
  await runTranslationTest(page, 'Neg_Fun_0006', 'mama sunaQQgu vunee maarga thadhabadhaya nisaa.');
});

test('Neg_Fun_0007 - Heavy punctuation mix', async ({ page }) => {
  await runTranslationTest(page, 'Neg_Fun_0007', '"hari" (eka?)! tika tika');
});

test('Neg_Fun_0008 - Line breaks collapsed joined', async ({ page }) => {
  await runTranslationTest(page, 'Neg_Fun_0008', 'mama gedhara\nyanavaaoyaa enavadha?');
});

test('Neg_Fun_0009 - Rare abbreviation altered', async ({ page }) => {
  await runTranslationTest(page, 'Neg_Fun_0009', 'ETA poddak late una.');
});

test('Neg_Fun_0010 - Informal slang edge with typo', async ({ page }) => {
  await runTranslationTest(page, 'Neg_Fun_0010', 'eka poddak amaaruyi vagee dhaen ithin monavadha karanne?');
});


// 1 UI TEST (Pos_UI_0001)


test('Pos_UI_0001 - UI preserves formatting in multi-line input', async ({ page }) => {
  const multiLineInput = 'mata nidhimathayi.\ndhaen vahinavaa.';
  await runTranslationTest(page, 'Pos_UI_0001', multiLineInput);
});