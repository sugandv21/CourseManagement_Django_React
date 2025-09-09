from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Course, Instructor
from .serializers import CourseSerializer, InstructorSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from django.shortcuts import get_object_or_404

# Course CBVs
class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all().select_related('instructor').order_by('-created_at')
    serializer_class = CourseSerializer
    filter_backends = [SearchFilter]
    search_fields = ['title', 'description', 'instructor__name']

    def get_queryset(self):
        qs = super().get_queryset()
        instructor_id = self.request.query_params.get('instructor_id')
        if instructor_id:
            qs = qs.filter(instructor_id=instructor_id)
        return qs

class CourseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all().select_related('instructor')
    serializer_class = CourseSerializer

# Instructor FBVs

@api_view(['GET', 'POST'])
def instructor_list_create(request):
    if request.method == 'GET':
        instructors = Instructor.objects.all()
        serializer = InstructorSerializer(instructors, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = InstructorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'PUT', 'DELETE'])
def instructor_detail(request, pk):
    instructor = get_object_or_404(Instructor, pk=pk)
    if request.method == 'GET':
        serializer = InstructorSerializer(instructor)
        return Response(serializer.data)
    elif request.method in ['PUT', 'PATCH']:
        serializer = InstructorSerializer(instructor, data=request.data, partial=(request.method=='PATCH'))
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        instructor.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

