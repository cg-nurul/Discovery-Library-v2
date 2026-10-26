#!/usr/bin/env python3
import os

# Read the Homepage.jsx file
homepage_path = os.path.join("src", "Homepage.jsx")
with open(homepage_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start and end of the CSS template literal
css_start = content.find("const CSS = `")
if css_start >= 0:
    # Find the end of the CSS template literal (the closing backtick and semicolon)
    css_end = content.find("`;", css_start + 10)
    if css_end >= 0:
        css_end += 2  # Include the backtick and semicolon
        
        # Remove the CSS template literal
        new_content = content[:css_start] + content[css_end:]
        
        # Save the new Homepage.jsx
        with open(homepage_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print("CSS template literal removed from Homepage.jsx")
    else:
        print("Could not find end of CSS template literal")
else:
    print("Could not find CSS template literal in Homepage.jsx")