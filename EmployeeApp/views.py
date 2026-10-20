import json

from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser

from .models import Departments, Employees
from .serializers import DepartmentSerializer, EmployeeSerializer


@csrf_exempt
def departmentApi(request, id=0):
    if request.method == 'GET':
        departments = Departments.objects.all().order_by('DepartmentId')
        serializer = DepartmentSerializer(departments, many=True)
        return JsonResponse(serializer.data, safe=False)

    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = DepartmentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    if request.method == 'PUT':
        dept = Departments.objects.get(DepartmentId=id)
        data = JSONParser().parse(request)
        serializer = DepartmentSerializer(dept, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    if request.method == 'DELETE':
        dept = Departments.objects.get(DepartmentId=id)
        dept.delete()
        return JsonResponse({'message': 'Department deleted successfully'}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def employeeApi(request, id=0):
    if request.method == 'GET':
        employees = Employees.objects.all().order_by('EmployeeId')
        serializer = EmployeeSerializer(employees, many=True)
        return JsonResponse(serializer.data, safe=False)

    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = EmployeeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    if request.method == 'PUT':
        employee = Employees.objects.get(EmployeeId=id)
        data = JSONParser().parse(request)
        serializer = EmployeeSerializer(employee, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    if request.method == 'DELETE':
        employee = Employees.objects.get(EmployeeId=id)
        employee.delete()
        return JsonResponse({'message': 'Employee deleted successfully'}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def SaveFile(request):
    if request.method == 'POST' and request.FILES.get('file'):
        file = request.FILES['file']
        filename = default_storage.save(file.name, file)
        return JsonResponse({'filename': filename})
    return JsonResponse({'error': 'No file uploaded'}, status=400)
