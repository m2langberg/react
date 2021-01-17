from django.db import models
from django_mysql.models import EnumField
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ObjectDoesNotExist
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.core.exceptions import PermissionDenied, FieldError

from django.utils import timezone
from datetime import datetime, timedelta



class SystemSetting(models.Model):

    name = models.CharField(max_length=40)
    str_value = models.TextField(null=True, blank=True)
    num_value = models.FloatField(null=True, blank=True)
    int_value = models.IntegerField(null=True, blank=True)


OWNER_STATE_CHOICE = (
    ("A", "Assigned"), 
    ("P", "Pending"), 
    ("R", "Rejected")
)

class ProjectStakeHolder(models.Model):
    project = models.ForeignKey(
        'Project', 
        related_name='stakeholders', 
        on_delete=models.CASCADE)

    user = models.ForeignKey(
        User, 
        related_name='projects', 
        on_delete=models.CASCADE)

    state = EnumField(
        choices=OWNER_STATE_CHOICE,
        default='P')

    def __str__(self):
        return f'({self.project})-[{self.state}]->({self.user})'

class Project(models.Model):

    name = models.CharField(
        max_length=100)

    resource = models.CharField(
        max_length=100,
        blank=True,
        null=True)

    created_by = models.ForeignKey(
        User, 
        related_name='created_projects',
        null=True,
        on_delete=models.SET_NULL)

    parent = models.ForeignKey(
        'Project', 
        related_name='children', 
        null=True, blank=True, 
        on_delete=models.CASCADE)

    owners = models.ManyToManyField(
        User, through='ProjectStakeHolder',
        blank=True, 
        related_name='stakeholders')


    @property
    def path(self):
        if self.parent:
            return f'{self.parent.path}/{self.id}'
        else:
            return f'{self.id}'

    def user_is_stakeholder(self, user):
        if user.is_staff: return True
        o = None
        try:
            o = ProjectStakeHolder.objects.get(
                project=self,
                user=user, state='A')
        except ProjectStakeHolder.DoesNotExist:
            pass
        return o is not None

    def __str__(self):
        return f'P{self.id}: {self.name}'

    def save(self, *args, **kwargs):
        self.save_base(*args, **kwargs)

        # Make sure project always has atleast one stake holder
        sh = ProjectStakeHolder.objects.filter(
            project=self,
            state='A')
        if (len(sh) == 0):
            ProjectStakeHolder.objects.get_or_create(
                project=self,
                user=self.created_by,
                defaults={
                    'state': 'A'
                }
            )

