import os
import requests
import re
from urllib.parse import urljoin
import sys
import time

BASE_URL = "https://sacred-texts.com/tarot/pkt/index.htm"
IMG_BASE_URL = "https://sacred-texts.com/tarot/pkt/"
OUTPUT_DIR = "assets/tarot/pkt"

def download_file(url, filepath):
    if os.path.exists(filepath):
        print(f"Skipping {filepath}, already exists.")
        return True
    try:
        print(f"Downloading {url} to {filepath}...")
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        with open(filepath, "wb") as f:
            f.write(resp.content)
        time.sleep(0.5) # Be nice to the server
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    print(f"Fetching index from {BASE_URL}...")
    try:
        resp = requests.get(BASE_URL)
        resp.raise_for_status()
    except Exception as e:
        print(f"Failed to fetch index: {e}")
        sys.exit(1)

    # Find all card page links (pkt*.htm)
    # Pattern: <A HREF="pkt....htm">
    links = re.findall(r'href=["\'](pkt.*?\.htm)["\']', resp.text, re.IGNORECASE)
    
    # Filter out potential non-card pages if we can identify them, 
    # but visiting them to check for images is safer.
    # However, we know card pages usually look like pktarXX.htm, pktwaXX.htm, etc.
    # Let's just visit all pkt*.htm found in index and look for the main image.
    
    unique_links = sorted(list(set(links)))
    print(f"Found {len(unique_links)} potential pages.")

    count = 0
    for link in unique_links:
        page_url = urljoin(IMG_BASE_URL, link)
        # We can optimize: if link is 'pktar01.htm', image is likely 'img/ar01.jpg'
        # Let's try to derive image name first to avoid 78+ page requests if possible.
        # But for correctness, let's verify. Or maybe hybrid.
        
        # Based on previous check: pktar01.htm -> img/ar01.jpg
        # pktwaki.htm -> img/waki.jpg
        # So rule: remove 'pkt' from htm filename, change extension to .jpg, prepend img/
        
        filename = link
        if filename.startswith('pkt'):
            base_name = filename[3:].replace('.htm', '')
            # Check if it looks like a card ID
            # Cards: ar00-ar21, wa*, cu*, sw*, pe*
            if (base_name.startswith('ar') or 
                base_name.startswith('wa') or 
                base_name.startswith('cu') or 
                base_name.startswith('sw') or 
                base_name.startswith('pe')):
                
                img_url = urljoin(IMG_BASE_URL, f"img/{base_name}.jpg")
                local_path = os.path.join(OUTPUT_DIR, f"{base_name}.jpg")
                
                if download_file(img_url, local_path):
                    count += 1
                continue
        
        # If pattern doesn't match, maybe visit page?
        # Most likely non-card pages (like pkt0101.htm) don't have the card image we want.
        # So we can skip them.
        print(f"Skipping non-card page pattern: {link}")

    print(f"Downloaded {count} images.")

if __name__ == "__main__":
    main()
