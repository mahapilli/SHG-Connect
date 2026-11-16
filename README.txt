SHG CONNECT — CLEAN 50-RECORD DEMONSTRATION DATASET
==================================================

Contents:
- Product_Dataset.csv: 50 products
- SHG_Member_Details.csv: 50 member records
- Sales_Dataset.csv: 50 sales records
- Financial_Dataset.csv: 50 financial records
- public/images/: 50 separate, unique product images (product_01.jpg ... product_50.jpg)

Image convention:
- Product_Dataset.csv Image column contains /images/product_XX.jpg
- For a Vite/React app, copy the public/images folder into your frontend public folder.
- Images are individually cropped from a generated product catalog collage and saved as separate high-resolution 512x512 JPG files.
- Image filenames are unique and no image file is reused across product rows.

Data notes:
- This is synthetic demonstration data, not real people, SHGs, transactions, or verified financial histories.
- Sales Product_ID and Member_ID references are aligned to the selected product records; Order_Amount is Quantity multiplied by the corresponding product Price.
- Financial records are matched to the selected member IDs.
