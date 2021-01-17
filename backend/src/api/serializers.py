from django.contrib.auth.models import User, Group
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied


from .models import *



class UserShortSerializer(serializers.RelatedField):

    def to_representation(self, value):
        return {
            'id': value.id, 
            'email': value.email,
            'name': value.first_name + ' ' + value.last_name
        }

class UserDetailsSerializer(serializers.ModelSerializer):
    """
    User model w/o password
    """
    class Meta:
        model = User
        fields = ('pk', 'username', 'email', 'first_name',
                  'last_name','is_staff')
        read_only_fields = ('email', 'is_staff')

class ProjectNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'parent_id']

    id = serializers.ReadOnlyField()
    name = serializers.ReadOnlyField()


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'first_name', 'last_name', 'username', 'email', 
                  'created_projects',
                  'my_projects', 
                  'groups']

    created_projects = ProjectNameSerializer(many=True, read_only=True)
    my_projects = ProjectNameSerializer(many=True, read_only=True)


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']




class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = '__all__'

class ProjectStakeHolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectStakeHolder
        fields = ['id', 'user', 'state']

    user = UserShortSerializer(read_only=True)


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

    class EmailListField(serializers.ListField):
        child = serializers.EmailField()

    created_by = UserShortSerializer(read_only=True)
    owners = serializers.SerializerMethodField()
    path = serializers.ReadOnlyField()
    children = serializers.SerializerMethodField()
    emails = EmailListField(write_only=True,required=False)

    def get_owners(self, obj):
        qset = ProjectStakeHolder.objects.filter(project=obj)
        return [ProjectStakeHolderSerializer(o, context=self.context).data for o in qset]


    def get_children(self, obj):
        qset = obj.children.all()
        return [ProjectNameSerializer(o, context=self.context).data for o in qset]

                


