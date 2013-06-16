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
			elif '-' in url:
				new_url = url.replace('-', ' ')
				if new_url == project.name:
					return url
				elif new_url == project.name.lower():
					return project.name.replace(' ', '-')


