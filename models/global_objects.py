def g_return_if_empty(value):
    if value:
        return value
    else:
        return T("Undefined")

def url_get_project(url):
	if db.projects(name = url):
		return url
	elif db(db.projects).select():
		for project in db(db.projects).select(db.projects.name):
			if project.name.lower() == url:
				return project.name
			elif '_' in url:
				new_url = url.replace('_', ' ')
				if new_url == project.name:
					return url
				elif new_url == project.name.lower():
					return project.name.replace(' ', '_')
					
def is_url(url):
    from urllib2 import urlopen
    try:
        valid = urlopen(url)
    except:
        response.session = T('Please, enter an username or a valid URL!')
        return False
    else:
        return True
