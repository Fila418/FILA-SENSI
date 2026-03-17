const fs = require('fs');
const path = require('path');

const projectDir = "c:\\Users\\PC\\Desktop\\New folder";
const assetsDir = path.join(projectDir, "assets");

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

const NEW_PRIMARY_HEX = "#C4A96D";
const NEW_SECONDARY_HEX = "#3DA5D9";
const NEW_PRIMARY_RGB = "196, 169, 109";
const NEW_SECONDARY_RGB = "61, 165, 217";

const files = ["index.html", "admin.html", "script.js", "style.css"];

for (const filename of files) {
    const filePath = path.join(projectDir, filename);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf-8');

    // 1. Variable rewrites
    content = content.replace(/--neon-red/g, "--primary-color");
    content = content.replace(/--electric-blue/g, "--secondary-color");
    content = content.replace(/--bg-color/g, "--background-color");
    content = content.replace(/--glass-bg/g, "--card-bg");

    // 2. Hex replacements
    content = content.replace(/#FF0033/gi, NEW_PRIMARY_HEX);
    content = content.replace(/#00D4FF/gi, NEW_SECONDARY_HEX);

    // 3. RGB/RGBA replacements
    content = content.replace(/255, 0, 51/g, NEW_PRIMARY_RGB);
    content = content.replace(/255,0,51/g, "196,169,109");
    content = content.replace(/0, 212, 255/g, NEW_SECONDARY_RGB);
    content = content.replace(/0,212,255/g, "61,165,217");

    // 4. Card background update explicitly requested by user
    content = content.replace(/rgba\(255, 255, 255, 0\.03\)/g, "rgba(255, 255, 255, 0.05)");

    // 5. Class name changes
    content = content.replace(/neon-text/g, "primary-text");
    content = content.replace(/glow-red/g, "glow-primary");
    content = content.replace(/glow-blue/g, "glow-secondary");

    // 6. Specific modifications per file
    if (filename === "style.css") {
        if (!content.includes(".nav-logo")) {
            const logo_css = `
/* Logo Integration */
.logo { display: flex; align-items: center; }
.nav-logo {
  max-height: 45px;
  width: auto;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 5px rgba(${NEW_PRIMARY_RGB}, 0.5));
}
.nav-logo:hover {
  filter: drop-shadow(0 0 15px var(--primary-color));
  transform: scale(1.05);
}
`;
            content += logo_css;
        }
    }

    if (filename === "admin.html" || filename === "index.html") {
        const old_logo_pattern = '<div class="logo">FILA<span>SENSI</span></div>';
        const new_logo_html = '<a href="index.html" class="logo"><img src="assets/logo.png" alt="FILA SENSI" class="nav-logo"></a>';
        content = content.split(old_logo_pattern).join(new_logo_html);

        const old_footer_logo = '<div class="footer-logo">FILA<span>SENSI</span></div>';
        const new_footer_logo = '<div class="footer-logo"><img src="assets/logo.png" alt="FILA SENSI" class="nav-logo"></div>';
        content = content.split(old_footer_logo).join(new_footer_logo);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
}
console.log("Theme successfully updated!");
