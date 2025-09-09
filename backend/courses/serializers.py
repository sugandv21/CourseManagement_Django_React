# courses/serializers.py
from rest_framework import serializers
from .models import Course, Instructor

class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instructor
        fields = ['id', 'name', 'bio', 'email']

class CourseSerializer(serializers.ModelSerializer):
    # nested read-only instructor representation
    instructor = InstructorSerializer(read_only=True)
    # allow passing instructor by id when creating/updating
    instructor_id = serializers.PrimaryKeyRelatedField(
        queryset=Instructor.objects.all(), source='instructor', write_only=True, required=True
    )
    # Make total_lessons an integer field that can be written to
    total_lessons = serializers.IntegerField(required=False)

    class Meta:
        model = Course
        # include both read and write fields
        fields = [
            'id',
            'title',
            'description',
            'instructor',
            'instructor_id',
            'total_lessons',
            'created_at',
            'updated_at',
        ]

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Course title cannot be empty.")
        return value
