field_empty = T('The field name can not be empty!')

db.define_table("projects",
	Field("name"),
	Field("description", "text"),
	Field("image", "upload"),
	Field("project_type"),
	Field("team", "list:string"),
	Field("video_url"),
	Field("slideshare_url"),
	Field("project_links", "list:string"),
	Field("project_mail"),
	Field("address", "text"),
	Field("phone"),
	Field("wanting_team", "boolean"),
	Field("team_wanted", "list:string"),
	Field("wanting_other", "boolean"),
	Field("other_wanted", "list:string"),
	Field("created_on", "date", default=request.now),
	Field("project_owner", db.auth_user, default=auth.user_id)
	)

db.define_table("team_function",
	Field("project_id"),
	Field("username"),
	Field("role")
	)

db.define_table("profession",
	Field("profession", length=128, requires=IS_NOT_EMPTY(error_message=field_empty)),
	Field("user_id", db.auth_user, default=auth.user_id, readable=False, writable=False)
	)

db.define_table("competence",
	Field("competence", length=128, requires=IS_NOT_EMPTY(error_message=field_empty)),
	Field("profession_id", db.profession, readable=False, writable=False)
	)