from django.urls import path
from .views import CourseListCreateView, CourseRetrieveUpdateDestroyView

from .views import instructor_list_create, instructor_detail

urlpatterns = [
    path('courses/', CourseListCreateView.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseRetrieveUpdateDestroyView.as_view(), name='course-detail'),
    path('instructors/', instructor_list_create, name='instructor-list-create'),
    path('instructors/<int:pk>/', instructor_detail, name='instructor-detail'),
]
