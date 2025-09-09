from django.contrib import admin
from .models import Course, Instructor

@admin.register(Instructor)
class InstructorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'instructor', 'total_lessons', 'created_at')
    list_filter = ('instructor',)
    search_fields = ('title','description')
