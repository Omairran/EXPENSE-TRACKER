from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import sqlite3
import datetime
from io import BytesIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "../backend-django/db.sqlite3"

def get_category_id(category_name: str, cursor) -> int:
    cursor.execute("SELECT id FROM finance_category WHERE name = ?", (category_name,))
    row = cursor.fetchone()
    if row:
        return row[0]
    # Default category creation if not found
    cursor.execute("INSERT INTO finance_category (name, color) VALUES (?, ?)", (category_name, "#cccccc"))
    return cursor.lastrowid

def auto_categorize(merchant: str) -> str:
    merchant = merchant.lower()
    if any(word in merchant for word in ["walmart", "target", "grocery", "food"]):
        return "Groceries"
    if any(word in merchant for word in ["netflix", "spotify", "hulu"]):
        return "Entertainment"
    if any(word in merchant for word in ["uber", "lyft", "gas", "shell"]):
        return "Transport"
    if any(word in merchant for word in ["salary", "payroll", "dividend"]):
        return "Income"
    return "Other"

@app.post("/parse-csv")
async def parse_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    contents = await file.read()
    try:
        df = pd.read_csv(BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading CSV: {e}")
    
    # Expected columns: Date, Description, Amount
    # If missing, try to map based on common names
    cols = df.columns.str.lower()
    if 'date' not in cols or 'amount' not in cols:
        raise HTTPException(status_code=400, detail="CSV must contain 'Date' and 'Amount' columns.")
    
    date_col = df.columns[cols == 'date'][0]
    amount_col = df.columns[cols == 'amount'][0]
    desc_col = df.columns[cols == 'description'][0] if 'description' in cols else df.columns[0]

    transactions_added = 0
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        for _, row in df.iterrows():
            date_val = row[date_col]
            amount_val = row[amount_col]
            desc_val = str(row[desc_col]) if pd.notna(row[desc_col]) else ""

            try:
                # Basic parsing
                parsed_date = pd.to_datetime(date_val).strftime('%Y-%m-%d')
                amount = float(amount_val)
                type_val = 'income' if amount >= 0 else 'expense'
                amount = abs(amount)

                # Auto categorize
                category_name = auto_categorize(desc_val)
                category_id = get_category_id(category_name, cursor)

                # Check for duplicates
                cursor.execute("""
                    SELECT id FROM finance_transaction
                    WHERE date = ? AND amount = ? AND description = ?
                """, (parsed_date, amount, desc_val))
                if cursor.fetchone():
                    print(f"Skipping duplicate transaction: {desc_val} on {parsed_date}")
                    continue

                cursor.execute("""
                    INSERT INTO finance_transaction (amount, date, description, type, merchant, category_id)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (amount, parsed_date, desc_val, type_val, desc_val, category_id))
                transactions_added += 1
            except Exception as e:
                print(f"Skipping row due to error: {e}")
                continue
        conn.commit()

    return {"message": f"Successfully parsed and saved {transactions_added} transactions."}