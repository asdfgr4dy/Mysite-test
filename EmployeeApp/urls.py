from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('department', views.departmentApi, name='department-api'),
    path('department/<int:id>', views.departmentApi, name='department-detail-api'),
    path('employees', views.employeeApi, name='employees-api'),
    path('employee/<int:id>', views.employeeApi, name='employee-detail-api'),
    path('employee/savefile', views.SaveFile, name='save-file'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
