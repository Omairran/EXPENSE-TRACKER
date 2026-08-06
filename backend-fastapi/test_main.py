from fastapi.testclient import TestClient
from main import app, get_category_id, auto_categorize
import io

client = TestClient(app)

def test_auto_categorize():
    assert auto_categorize("walmart store") == "Groceries"
    assert auto_categorize("netflix subscription") == "Entertainment"
    assert auto_categorize("uber ride") == "Transport"
    assert auto_categorize("random store") == "Other"

def test_parse_csv_invalid_file_type():
    response = client.post("/parse-csv", files={"file": ("test.txt", b"some content", "text/plain")})
    assert response.status_code == 400
    assert response.json()["detail"] == "Only CSV files are allowed."

def test_parse_csv_missing_columns():
    csv_content = b"WrongCol1,WrongCol2\nVal1,Val2"
    response = client.post("/parse-csv", files={"file": ("test.csv", csv_content, "text/csv")})
    assert response.status_code == 400
    assert "must contain 'Date' and 'Amount' columns" in response.json()["detail"]
