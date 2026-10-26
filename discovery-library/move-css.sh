#!/bin/bash

# Read the Homepage.jsx file
homepage_path="src/Homepage.jsx"
index_css_path="src/index.css"

# Extract the CSS template literal from Homepage.jsx
# Find the start of the CSS template literal
css_start=$(grep -n "const CSS = `" "$homepage_path" | cut -d: -f1)

if [ -n "$css_start" ]; then
    # Extract the CSS template literal
    tail -n +$css_start "$homepage_path" > temp_css.txt
    
    # Find where the CSS template literal ends (the backtick and semicolon)
    # Look for the closing pattern
    css_end_line=$(grep -n "^`;$" temp_css.txt | cut -d: -f1)
    
    if [ -n "$css_end_line" ]; then
        # Extract just the CSS content (lines between the opening and closing backticks)
        # Skip the first 3 lines (const CSS = ` and the newlines)
        tail -n +4 temp_css.txt | head -n "$((css_end_line - 4))" > css_content.txt
        
        # Append the CSS content to index.css
        echo "" >> "$index_css_path"
        echo "/* CSS from Homepage.jsx */" >> "$index_css_path"
        cat css_content.txt >> "$index_css_path"
        
        # Remove the CSS template literal from Homepage.jsx
        # Create a new Homepage.jsx without the CSS
        head -n $((css_start - 1)) "$homepage_path" > temp_homepage_new.txt
        
        # Find the line where the closing brace is (just before the CSS)
        # Look for the "}" that closes the component function
        grep -n "^  }$" temp_homepage_new.txt | tail -n 1 | cut -d: -f1 > closing_brace_line.txt
        
        closing_brace_line=$(cat closing_brace_line.txt)
        if [ -n "$closing_brace_line" ]; then
            # Insert the CSS moved comment after the closing brace
            sed -i "${closing_brace_line}a // CSS moved to index.css" temp_homepage_new.txt
            mv temp_homepage_new.txt "$homepage_path"
        else
            # If we can't find the closing brace, just append a comment
            echo "// CSS moved to index.css" >> "$homepage_path"
        fi
        
        echo "CSS successfully moved from Homepage.jsx to index.css"
    else
        echo "Could not find end of CSS template literal"
    fi
    
    rm -f temp_css.txt css_content.txt closing_brace_line.txt
else
    echo "Could not find CSS template literal in Homepage.jsx"
fi