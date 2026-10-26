#!/usr/bin/env python3
import os
import re

# Read the Homepage.jsx file
homepage_path = os.path.join("src", "Homepage.jsx")
index_css_path = os.path.join("src", "index.css")

with open(homepage_path, 'r') as f:
    homepage_content = f.read()

# Extract the CSS template literal from Homepage.jsx
# Find the start of the CSS template literal
css_start = homepage_content.find("const CSS = `")

if css_start >= 0:
    # Find the end of the CSS template literal (the closing backtick and semicolon)
    css_end = homepage_content.find("`;", css_start + 10)
    
    if css_end >= 0:
        css_end += 2  # Include the backtick and semicolon
        
        # Extract the CSS template literal content
        css_template = homepage_content[css_start:css_end]
        
        # Extract just the CSS content (remove the const CSS = ` and the closing `;
        css_content_start = css_template.find("\n\n\n")
        if css_content_start >= 0:
            css_content_start += 3  # Skip the newlines
            css_content = css_template[css_content_start:css_end - css_content_start]
            
            # Read the current index.css
            with open(index_css_path, 'r') as f:
                index_css_content = f.read()
            
            # Append the CSS content to index.css
            # Add a separator comment before appending
            index_css_content += "\n\n/* CSS from Homepage.jsx */\n" + css_content
            
            # Write the updated index.css
            with open(index_css_path, 'w') as f:
                f.write(index_css_content)
            
            # Remove the CSS template literal from Homepage.jsx
            new_homepage_content = homepage_content[:css_start]
            
            # Find where to insert the closing brace after removing the CSS
            # Look for the "}" that closes the component function
            closing_brace_pos = new_homepage_content.rfind("}")
            if closing_brace_pos >= 0:
                new_homepage_content = (new_homepage_content[:closing_brace_pos + 1] + 
                                      "\n// CSS moved to index.css\n" + 
                                      new_homepage_content[closing_brace_pos + 1:])
            
            # Write the updated Homepage.jsx
            with open(homepage_path, 'w') as f:
                f.write(new_homepage_content)
            
            print("CSS successfully moved from Homepage.jsx to index.css")
        else:
            print("Could not find CSS content in template literal")
    else:
        print("Could not find end of CSS template literal")
else:
    print("Could not find CSS template literal in Homepage.jsx")