db.define_table("projects",
	Field("name"),
	Field("description", "text"),
	Field("image", "upload"),
	Field("project_type"),
	Field("team", "list:string"),
	Field("created_on", "date", default=request.now),
	Field("project_owner", db.auth_user, default=auth.user_id)
	)