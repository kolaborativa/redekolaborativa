#projects
db.projects.name.requires = IS_NOT_EMPTY(error_message='Cannot be empty!')
db.projects.description.requires = IS_NOT_EMPTY(error_message='Cannot be empty!')
db.projects.image.requires = IS_IMAGE(extensions=('jpeg', 'png', 'jpg', 'gif'))
db.projects.project_type.requires = IS_IN_SET(['OpenSource', T('Enterprising'), 'Social', T('Other')])
db.projects.team.requires = IS_IN_DB(db, 'auth_user.id', '%(username)s', zero=T('Choose one'), multiple=True)
db.projects.created_on.requires = IS_DATE(format=T('%Y-%m-%d'), error_message='Must be YYYY-MM-DD!')
db.projects.created_on.writable = db.projects.created_on.readable = False
db.projects.project_owner.requires = IS_IN_DB(db, 'auth_user.id', '%(username)s', zero=T('Choose one'))
db.projects.project_owner.writable = db.projects.project_owner.readable = False