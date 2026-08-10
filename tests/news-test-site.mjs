import { cp, copyFile, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const projectRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const fixturePath = new URL("./fixtures/news-data.json", import.meta.url);
const fixtureNotices = JSON.parse(await readFile(fixturePath, "utf8"));

function run(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: "inherit", ...options });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolvePromise();
      } else {
        reject(new Error(`${command} exited with ${code ?? signal}`));
      }
    });
  });
}

async function createTestSite(notices) {
  const siteRoot = await mkdtemp(join(tmpdir(), "mycraft-news-site-"));
  await cp(projectRoot, siteRoot, {
    recursive: true,
    filter(source) {
      const relativePath = relative(projectRoot, source);
      return ![
        ".git",
        "node_modules",
        "dist",
        "assets",
        "news",
        "playwright-report",
        "test-results",
      ].some((excluded) => relativePath === excluded || relativePath.startsWith(`${excluded}/`));
    },
  });
  await symlink(resolve(projectRoot, "node_modules"), join(siteRoot, "node_modules"), "dir");

  const noticesSourcePath = join(siteRoot, "src/data/notices.js");
  const noticesSource = await readFile(noticesSourcePath, "utf8");
  const noticesDeclaration = `export const notices = ${JSON.stringify(notices, null, 2)};`;
  if (!noticesSource.includes("export const notices = [];")) {
    throw new Error("The test site source does not have the expected empty notice declaration.");
  }
  await writeFile(
    noticesSourcePath,
    noticesSource.replace("export const notices = [];", noticesDeclaration),
  );

  await copyFile(
    join(projectRoot, "20260709_180604.jpg"),
    join(siteRoot, "public/news-test-image.jpg"),
  );
  await run("npm", ["run", "build"], { cwd: siteRoot });

  // deploy-root only copies known production files; keep this fixture asset temporary.
  await copyFile(
    join(siteRoot, "dist/news-test-image.jpg"),
    join(siteRoot, "news-test-image.jpg"),
  );
  return siteRoot;
}

async function startServer(siteRoot) {
  const server = spawn("python3", ["-u", "-m", "http.server", "0", "--bind", "127.0.0.1"], {
    cwd: siteRoot,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const address = await new Promise((resolvePromise, reject) => {
    let output = "";
    const timeout = setTimeout(() => reject(new Error("Timed out starting the temporary HTTP server.")), 10_000);
    server.stdout.on("data", (chunk) => {
      output += chunk.toString();
      const match = output.match(/port (\d+)/);
      if (match) {
        clearTimeout(timeout);
        resolvePromise(`http://127.0.0.1:${match[1]}`);
      }
    });
    server.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
  return { server, address };
}

async function runPlaywright(spec, address, fixtureSite) {
  await run("npx", ["playwright", "test", spec], {
    cwd: projectRoot,
    env: {
      ...process.env,
      NEWS_TEST_SITE: fixtureSite ? "1" : "",
      PLAYWRIGHT_BASE_URL: address,
      PLAYWRIGHT_EXTERNAL_SERVER: "1",
    },
  });
}

async function testSite(notices, spec, fixtureSite) {
  const siteRoot = await createTestSite(notices);
  try {
    const { server, address } = await startServer(siteRoot);
    try {
      await runPlaywright(spec, address, fixtureSite);
    } finally {
      server.kill();
    }
  } finally {
    await rm(siteRoot, { recursive: true, force: true });
  }
}

await testSite(fixtureNotices, "tests/news.spec.js", true);
await testSite([], "tests/news-empty.spec.js", false);
