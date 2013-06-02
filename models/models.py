field_empty = T('The field name can not be empty!')

db.define_table("projects",
	Field("name"),
	Field("description", "text"),
	Field("image", "upload"),
	Field("project_type"),
	Field("team", "list:string"),
	Field("created_on", "date", default=request.now),
	Field("project_owner", db.auth_user, default=auth.user_id)
	)

db.define_table("team_function",
	Field("project_id", default=request.args(0)),
	Field("user_id"),
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