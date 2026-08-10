import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from rest_framework.test import force_authenticate
from rest_framework.test import APIRequestFactory
from django.contrib.auth.models import User
from finance.views import AdminDashboardView

factory = APIRequestFactory()
request = factory.get('/api/admin-dashboard/overview/')
user = User.objects.get(username='omair')
force_authenticate(request, user=user)

view = AdminDashboardView.as_view()
response = view(request)
print("Admin view response status:", response.status_code)
if response.status_code != 200:
    print(response.rendered_content if hasattr(response, 'rendered_content') else response.data)
else:
    print("Success")
