field_empty = T('The field name can not be empty!')

db.define_table("projects",
	Field("name"),
	Field("short_description", "text"),
	Field("description", "text"),
	Field("image", "upload"),
	Field("project_type"),
	Field("team"),
	Field("video_url"),
	Field("slideshare_url"),
	Field("project_links", "list:string"),
	Field("project_mail"),
	Field("project_site"),
	Field("address", "text"),
	Field("phone"),
	Field("wanting_team", "boolean", default=False),
	Field("team_wanted", "string"),
	Field("wanting_other", "boolean", default=False),
	Field("other_wanted", "string"),
	Field("created_on", "date", default=request.now),
	Field("project_owner", db.auth_user, default=auth.user_id),
	Field("project_slug")
	)

db.define_table("team_function",
	Field("project_id"),
	Field("username"),
	Field("role")
	)

db.define_table("profession",
	Field("name", length=128, requires=IS_NOT_EMPTY(error_message=field_empty)),
	)

db.define_table("competence",
	Field("competence", length=128, requires=IS_NOT_EMPTY(error_message=field_empty)),
	Field("profession_id", db.profession, readable=False, writable=False)
	)

db.define_table("professional_relationship",
	Field("profession_id", db.profession, readable=False, writable=False),
	Field("competence_id", db.competence, readable=False, writable=False),
	Field("user_id", db.auth_user, default=auth.user_id, readable=False, writable=False)
    )


db.define_table('link_type',
    Field('name', 'string'),
    format='%(name)s'
)

db.define_table("links",
Field("user_id", db.auth_user),
Field("link_type_id", db.link_type, label=T('Link Type')),
Field("url", 'string')
)

db.define_table('comment_project',
   Field('title'),
   Field('body','text'),
   Field('is_reply', 'boolean', default=False),
   Field('replied_id'),
   Field('project_id'),
   auth.signature)

db.define_table('subscription_emails',
	Field('email', requires=IS_EMAIL())
	)
