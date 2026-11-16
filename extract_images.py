import os
import zipfile
import pandas as pd
import shutil

EXCEL_FILE = "Women_SHG_Handmade_Dataset.xlsx"
ZIP_FILE = "product_images.zip"
IMAGE_FOLDER = "public/images"

os.makedirs(IMAGE_FOLDER, exist_ok=True)

df = pd.read_excel(EXCEL_FILE, sheet_name="Product Dataset")

def normalize(filename):
    name = os.path.basename(str(filename)).lower()
    name = os.path.splitext(name)[0]

    # Remove product ID (P002_ or 02_)
    if "_" in name:
        name = name.split("_", 1)[1]

    return name.strip()

matched = 0
missing = []

with zipfile.ZipFile(ZIP_FILE, "r") as z:
    zip_images = {}

    for name in z.namelist():
        if name.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
            zip_images[normalize(name)] = name

    for filename in df["Image File Name"].dropna().astype(str):
        key = normalize(filename)

        if key in zip_images:
            destination = os.path.join(
                IMAGE_FOLDER, os.path.basename(filename)
            )

            with z.open(zip_images[key]) as source:
                with open(destination, "wb") as target:
                    shutil.copyfileobj(source, target)

            matched += 1
            print("Extracted:", os.path.basename(filename))
        else:
            missing.append(filename)

print("\nExcel image names:", df["Image File Name"].notna().sum())
print("Successfully extracted:", matched)
print("Missing:", len(missing))

if missing:
    print("Missing filenames:", missing)
