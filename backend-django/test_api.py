import requests

base_url = 'http://localhost:8000/api'
resp = requests.post(f"{base_url}/token/", json={'username': 'omair', 'password': 'password'})
print("Token resp:", resp.status_code)
if resp.status_code == 200:
    token = resp.json()['access']
    summary_resp = requests.get(f"{base_url}/transactions/summary/", headers={'Authorization': f'Bearer {token}'})
    print("Summary:", summary_resp.status_code)
    
    admin_resp = requests.get(f"{base_url}/admin-dashboard/overview/", headers={'Authorization': f'Bearer {token}'})
    print("Admin:", admin_resp.status_code)
    if admin_resp.status_code != 200:
        print(admin_resp.content)
