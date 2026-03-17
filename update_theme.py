import os
import re

project_dir = r"c:\Users\PC\Desktop\New folder"
os.makedirs(os.path.join(project_dir, "assets"), exist_ok=True)

# Colors extracted from the provided logo to match the theme perfectly
NEW_PRIMARY_HEX = "#C4A96D" # Gold from the logo text/ring
NEW_SECONDARY_HEX = "#3DA5D9" # Electric Blue from the logo wings
NEW_PRIMARY_RGB = "196, 169, 109"
NEW_SECONDARY_RGB = "61, 165, 217"

for filename in ["index.html", "admin.html", "script.js", "style.css"]:
    path = os.path.join(project_dir, filename)
    if not os.path.exists(path): continue
    
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Variable rewrites
    content = content.replace("--neon-red", "--primary-color")
    content = content.replace("--electric-blue", "--secondary-color")
    content = content.replace("--bg-color", "--background-color")
    content = content.replace("--glass-bg", "--card-bg")
    
    # 2. Hex replacements
    content = re.sub(r'#FF0033', NEW_PRIMARY_HEX, content, flags=re.IGNORECASE)
    content = re.sub(r'#00D4FF', NEW_SECONDARY_HEX, content, flags=re.IGNORECASE)

    # 3. RGB/RGBA replacements
    content = content.replace("255, 0, 51", NEW_PRIMARY_RGB)
    content = content.replace("255,0,51", "196,169,109")
    content = content.replace("0, 212, 255", NEW_SECONDARY_RGB)
    content = content.replace("0,212,255", "61,165,217")

    # 4. Card background update explicitly requested by user
    content = content.replace("rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.05)")

    # 5. Class name changes
    content = content.replace("neon-text", "primary-text")
    content = content.replace("glow-red", "glow-primary")
    content = content.replace("glow-blue", "glow-secondary")

    # 6. Specific modifications per file
    if filename == "style.css":
        if ".nav-logo" not in content:
            logo_css = f"""
/* Logo Integration */
.logo {{ display: flex; align-items: center; }}
.nav-logo {{
  max-height: 45px;
  width: auto;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 5px rgba({NEW_PRIMARY_RGB}, 0.5));
}}
.nav-logo:hover {{
  filter: drop-shadow(0 0 15px var(--primary-color));
  transform: scale(1.05);
}}
"""
            content += logo_css

    if filename in ["admin.html", "index.html"]:
        # Update text logo to image logo in nav
        old_logo_pattern = r'<div class="logo">FILA<span>SENSI</span></div>'
        new_logo_html = r'<a href="index.html" class="logo"><img src="assets/logo.png" alt="FILA SENSI" class="nav-logo"></a>'
        content = content.replace(old_logo_pattern, new_logo_html)
        
        # Update text logo to image logo in footer
        old_footer_logo = r'<div class="footer-logo">FILA<span>SENSI</span></div>'
        new_footer_logo = r'<div class="footer-logo"><img src="assets/logo.png" alt="FILA SENSI" class="nav-logo"></div>'
        content = content.replace(old_footer_logo, new_footer_logo)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Theme successfully updated!")
