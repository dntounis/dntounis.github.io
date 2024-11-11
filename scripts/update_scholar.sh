#!/bin/bash

# Navigate to your site directory
cd /path/to/your/site

# Activate virtual environment if you're using one
source venv/bin/activate

# Run the scholar update script
python scripts/update_scholar.py

# Commit and push changes if there are any
git add _data/scholar_*.yml _data/citation_history.json
git commit -m "Update Google Scholar data" || exit 0
git push origin main
