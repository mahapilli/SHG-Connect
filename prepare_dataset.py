import pandas as pd
import os
from pathlib import Path

EXCEL = "Women_SHG_Handmade_Dataset.xlsx"
IMAGE_DIR = Path("public/images")
OUTPUT_DIR = Path("backend/data_new")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Read all four Excel sheets
products = pd.read_excel(EXCEL, sheet_name="Product Dataset")
members = pd.read_excel(EXCEL, sheet_name="SHG Member Details")
sales = pd.read_excel(EXCEL, sheet_name="Sales Dataset")
financial = pd.read_excel(EXCEL, sheet_name="Financial Dataset")

# 1. PRODUCT DATASET - Keep only products with images
products = products.dropna(subset=["Image File Name"]).copy()

products["Image"] = products["Image File Name"].apply(
    lambda x: "/images/" + os.path.basename(str(x))
)

products["Image_Exists"] = products["Image File Name"].apply(
    lambda x: (IMAGE_DIR / os.path.basename(str(x))).exists()
)

products = products[products["Image_Exists"]].copy()

product_output = pd.DataFrame({
    "Product_ID": products["Product ID"],
    "Member_ID": products["Maker Member ID"],
    "Product_Name": products["Product Name"],
    "Category": products["Category"],
    "Price": products["MRP (₹)"],
    "Stock": products["Stock (Units)"],
    "Image": products["Image"],
    "Material": products["Material"],
    "Description": products["Description"],
    "Cost_Price": products["Cost Price (₹)"],
    "Margin": products["Margin (%)"],
    "Maker_Name": products["Maker Name"]
})

# 2. MEMBER DATASET
# Use financial sheet to obtain savings and outstanding loans
financial_member = financial.drop_duplicates(
    subset=["Member ID"]
)[["Member ID", "Savings Balance (₹)", "Loan Outstanding (₹)"]]

members = members.merge(
    financial_member,
    on="Member ID",
    how="left"
)

member_output = pd.DataFrame({
    "Member_ID": members["Member ID"],
    "Name": members["Member Name"],
    "Age": members["Age"],
    "Contact": members["Mobile (Sample)"],
    "Location": (
        members["Village"].fillna("").astype(str) + ", " +
        members["Mandal"].fillna("").astype(str) + ", " +
        members["District"].fillna("").astype(str) + ", " +
        members["State"].fillna("").astype(str)
    ),
    "SHG_Name": members["SHG Group Name"],
    "Role": members["Role"],
    "Savings": members["Savings Balance (₹)"],
    "Loans": members["Loan Outstanding (₹)"],
    "Join_Date": members["Joined On"],
    "Craft_Skill": members["Craft / Skill Category"],
    "Education": members["Education"],
    "Family_Occupation": members["Family Occupation"],
    "Product_ID_Made": members["Product ID Made"]
})

# 3. SALES DATASET
sales_output = pd.DataFrame({
    "Order_ID": sales["Sale ID"],
    "Order_Date": sales["Sale Date"],
    "Product_ID": sales["Product ID"],
    "Member_ID": sales["Maker Member ID"],
    "Quantity": sales["Qty"],
    "Order_Amount": sales["Total Amount (₹)"],
    "Customer": "Not Provided",
    "Payment_Status": "Not Provided",
    "Delivery_Status": "Not Provided",
    "Delivery_City": sales["Buyer City"],
    "Sales_Channel": sales["Sales Channel"],
    "Payment_Mode": sales["Payment Mode"],
    "Discount": sales["Discount (%)"]
})

# 4. FINANCIAL DATASET
savings = financial["Savings Balance (₹)"]
loans = financial["Loan Outstanding (₹)"]
expenses = (
    financial["Raw Material Cost (₹)"] +
    financial["Other Expenses (₹)"]
)
revenue = financial["Monthly Revenue (₹)"]
emi = financial["Monthly EMI (₹)"]

def safe_ratio(numerator, denominator):
    return numerator.div(denominator.replace(0, float("nan"))).fillna(0)

financial_output = pd.DataFrame({
    "Member_ID": financial["Member ID"],
    "Record_ID": financial["Record ID"],
    "Savings": savings,
    "Loans": loans,
    "Expenses": expenses,
    "Loan_Repayment": emi,
    "Income_Records": revenue,
    "Business_Income": revenue,
    "Net_Balance": savings - loans,
    "Loan_Savings_Ratio": safe_ratio(loans, savings),
    "Expense_Income_Ratio": safe_ratio(expenses, revenue),
    "Repayment_Income_Ratio": safe_ratio(emi, revenue),
    "Business_Income_Ratio": safe_ratio(revenue, revenue),
    "Risk_Label": "Not Available",
    "Record_Date": "",
    "Credit_Rating": financial["Credit Rating"],
    "Monthly_Profit": financial["Monthly Profit (₹)"],
    "Profit_Margin": financial["Profit Margin (%)"],
    "Loan_Repaid": financial["Loan Repaid (%)"],
    "Bank_Linkage": financial["Bank Linkage"]
})

# Save all four CSV files in staging folder
datasets = {
    "Product_Dataset.csv": product_output,
    "SHG_Member_Details.csv": member_output,
    "Sales_Dataset.csv": sales_output,
    "Financial_Dataset.csv": financial_output
}

for filename, data in datasets.items():
    data.to_csv(OUTPUT_DIR / filename, index=False, encoding="utf-8-sig")
    print(filename, "->", len(data), "records")

print("\nAll four CSV files prepared successfully!")
print("Output folder:", OUTPUT_DIR.resolve())
print("Products without matching images:", len(pd.read_excel(EXCEL, sheet_name="Product Dataset")) - len(product_output))

