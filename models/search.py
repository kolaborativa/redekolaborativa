
def search_user(user, conditions=[],fields=[], filters={}):
    """
    Example of usage.
        # Search user by name.
        search_user('name')
        # Input a orderby filter.
        search_user('name',filters{'orderby':db.auth_user.id})
        
    """
    return db((db.auth_user.first_name.like(user+'%')),*conditions).select(*fields,**filters)

def search_projects(project, conditions=[],fields=[], filters={}):
    
    return db((db.projects.name.like(project+'%')),
            *conditions).select(*fields,**filters)
