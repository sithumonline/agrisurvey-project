from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from api.models import User, Farm, Route, SoilSample, WaterSample, PestDiseaseReport


class Command(BaseCommand):
    help = '设置AgriSurvey的权限组'

    def handle(self, *args, **options):
        # 创建权限组
        admin_group, created = Group.objects.get_or_create(name='Administrators')
        enumerator_group, created = Group.objects.get_or_create(name='Enumerators')
        
        self.stdout.write(f"{'Created' if created else 'Found'} Administrators group")
        
        # 获取所有相关模型的权限
        models = [User, Farm, Route, SoilSample, WaterSample, PestDiseaseReport]
        
        # 管理员组权限 - 所有权限
        admin_permissions = []
        for model in models:
            content_type = ContentType.objects.get_for_model(model)
            permissions = Permission.objects.filter(content_type=content_type)
            admin_permissions.extend(permissions)
        
        # 添加导出权限（使用view权限来控制导出）
        admin_group.permissions.set(admin_permissions)
        
        # 采集员组权限 - 基本的CRUD权限（除了User管理）
        enumerator_permissions = []
        for model in [Farm, Route, SoilSample, WaterSample, PestDiseaseReport]:
            content_type = ContentType.objects.get_for_model(model)
            # 只给予查看、添加、修改权限，不给删除权限
            permissions = Permission.objects.filter(
                content_type=content_type,
                codename__in=[
                    f'view_{model._meta.model_name}',
                    f'add_{model._meta.model_name}',
                    f'change_{model._meta.model_name}',
                ]
            )
            enumerator_permissions.extend(permissions)
        
        # 采集员可以查看用户（但不能修改）
        user_content_type = ContentType.objects.get_for_model(User)
        view_user_perm = Permission.objects.get(
            content_type=user_content_type,
            codename='view_user'
        )
        enumerator_permissions.append(view_user_perm)
        
        enumerator_group.permissions.set(enumerator_permissions)
        
        self.stdout.write(self.style.SUCCESS(f'✓ Administrator group has {admin_group.permissions.count()} permissions'))
        self.stdout.write(self.style.SUCCESS(f'✓ Enumerator group has {enumerator_group.permissions.count()} permissions'))
        
        # 将现有管理员用户添加到管理员组
        admin_users = User.objects.filter(role='admin')
        for user in admin_users:
            user.groups.add(admin_group)
            user.is_staff = True  # 允许访问Django管理后台
            user.save()
        
        self.stdout.write(self.style.SUCCESS(f'✓ Added {admin_users.count()} admin users to Administrators group'))
        
        # 将现有采集员用户添加到采集员组
        enumerator_users = User.objects.filter(role='enumerator')
        for user in enumerator_users:
            user.groups.add(enumerator_group)
            # 采集员默认不能访问Django管理后台，除非特别设置
            user.save()
        
        self.stdout.write(self.style.SUCCESS(f'✓ Added {enumerator_users.count()} enumerator users to Enumerators group'))
        
        self.stdout.write(self.style.SUCCESS('✓ Permission setup completed!')) 