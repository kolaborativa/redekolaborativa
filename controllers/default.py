# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

#########################################################################
## This is a samples controller
## - index is the default action of any application
## - user is required for authentication and authorization
## - download is for downloading files uploaded in the db (does streaming)
## - call exposes all registered services (none by default)
#########################################################################

def index():
    #retirar esse if quando for lancado. Junto com o html da landing page
    if request.env.http_host == 'rede.kolaborativa.com':
        redirect(URL('landing'))

    form_register = auth.register()

    return dict(form_register=form_register)

@auth.requires_login()
def panel():

    return dict()

def landing():
    '''Landing page
    '''
    form = SQLFORM(db.subscription_emails, name='email')
    if form.process().accepted:
        message = response.render('email.html')
        mail.send(to=request.vars.email,
            subject=str(T('Welcome to Kolaborativa!')),
            message=message)
        session.flash = T("Thank you and welcome to Kolaborativa!")
        redirect(URL('default', 'index'))
    elif form.errors:
        response.flash = T("Form has errors!")
    return dict(form=form)


def principal():
    projeto = db(db.projects).select().first()
    return dict(projeto=projeto)

@auth.requires_login()
def edit_perfil():
    form=auth.profile()

    my_links = db(db.links.user_id == auth.user.id).select()
    my_links_id = [i.link_type_id for i in my_links]
    count_type_other = db( (db.links.user_id == auth.user.id) & \
        (db.links.link_type_id == 10) ).count()
    list_link_types = db(db.link_type.id>0).select()

    others_links = {}

    for i in list_link_types:
        if not i.id in my_links_id:
            others_links[i.id] = i.name
    if count_type_other < 2 and 10 not in others_links:
        others_links[10] = 'Outro'

    my_professions_id = [i.profession_id for i in db(db.professional_relationship).select()]
    list_professions = [i for i in db(db.profession).select() if not i.id in my_professions_id ]
    my_avatar = db.auth_user[auth.user.id].avatar

    professional_relation = db(db.professional_relationship.user_id ==  auth.user.id).select()
    professional_data = {}
    if professional_relation:
        for i in professional_relation:
            if i.profession_id.name in professional_data:
                professional_data[i.profession_id.name]['my_competencies'].append((i.competence_id, i.competence_id.competence))

            else:
                try:
                    professional_data[i.profession_id.name] = {
                        'profession_id': i.profession_id,
                    }
                    professional_data[i.profession_id.name]['my_competencies'] = [(i.competence_id, i.competence_id.competence)]

                except:
                    professional_data[i.profession_id.name] = {
                        'profession_id': i.profession_id,
                        'my_competencies': [],
                        'others_competencies': []

                    }

        for pro in professional_data:
            professional_data[pro]['others_competencies'] = []
            others_comp = [(i.id, i.competence) for i in db(db.competence.profession_id==professional_data[pro]['profession_id']).select()]
            for oc in others_comp:
                if not oc in professional_data[pro]['my_competencies']:
                    professional_data[pro]['others_competencies'].append(oc)


    form_links = SQLFORM.factory(
        db.links,
        )

    form_profession = SQLFORM.factory(
        db.profession,
        table_name='professions',
        submit_button=T('add')
        )
    form_competencies = SQLFORM.factory(
        Field("profession_id",label="profession_id"),
        db.competence,
        table_name='competencies',
        )

    # auth form
    if form.process().accepted:
        redirect(URL("user_info"))
    elif form.errors:
        response.session = 'form has errors'

    # professions form
    if form_profession.process().accepted:
        # id_professions = [i.id for i in professions]
        # if not request.vars.profession in id_professions:
        db.profession.insert(
            profession=request.vars.profession,
            user_id=auth.user.id
            )
        # else:
        #     db(db.profession.id == ).update(
        #         profession=request.vars.profession,
        #         )

        response.flash = 'form accepted'
        redirect(URL("user",args=["profile"]))
    elif form_profession.errors:
        response.flash = 'form has errors'

    # competencies form
    if form_competencies.process().accepted:
        db.competence.insert(
            competence=request.vars.competence,
            profession_id=request.vars.profession_id,
            )

        response.flash = 'form accepted'
        redirect(URL("user",args=["profile"]))
    elif form_competencies.errors:
        response.flash = 'form has errors'

    #networking form

    return dict(form=form,
                form_profession=form_profession,
                form_competencies=form_competencies,
                form_links=form_links,
                list_professions=list_professions,
                professional_data=professional_data,
                my_avatar=my_avatar,
                my_links=my_links,
                others_links=others_links,
                )


def _image_converter(img64, upload_folder, type_upload):
    '''Funcao que converte uma imagem base64 e retorna a imagem convertida
    '''
    import subprocess
    from convertImage import convertBase64String

    img_base64 = img64
    upload_folder = upload_folder
    img_converted = convertBase64String(img_base64, upload_folder, type_upload)

    return img_converted


@auth.requires_login()
def ajax_edit_profile():
    try:
        field_db =  request.vars.field
        new_value =  request.vars.value
        dic_update = {field_db:new_value}

        if field_db == 'availability':
            dados = db(db.auth_user.id==auth.user.id).select().first()
            value = dados.availability
            if new_value in value:
                value.remove(new_value)
            else:
                value.append(new_value)
            db.auth_user[auth.user.id] = {field_db: value}

        elif field_db == 'born_on':
            from datetime import date

            field_db =  request.vars.field
            new_value =  request.vars.value

            list_date=new_value.split('/')
            year = int(list_date[2])
            month = int(list_date[1])
            day = int(list_date[0])
            new_value = date(year, month, day)

            dic_update = {field_db: new_value}
            db.auth_user[auth.user.id] = dic_update

        elif field_db == 'avatar':
            field_db =  request.vars.field
            img64 =  request.vars.image64
            upload_folder = '{}uploads/'.format(request.folder)
            img_converted = _image_converter(img64, upload_folder)

            #grava no banco
            if img_converted:
                user = db(db.auth_user.id == auth.user.id).select().first()

                if user.avatar:
                    # Deleta o avatar antigo
                    import subprocess
                    subprocess.call('rm %s/%s' % (upload_folder, user.avatar), shell=True)

               # Salva o avatar novo
                db(db.auth_user.id == user.id).update(avatar=img_converted)
                return True

        else:
            db.auth_user[auth.user.id] = dic_update

            if field_db == 'username':
                auth.logout()

            elif field_db == 'user_available' and new_value == 'true':
                dados = db(db.auth_user.id==auth.user.id).select().first()
                if not dados.availability:
                    db.auth_user[auth.user.id] = {'availability': 'Others'}

        return True

    except:
        return False


@auth.requires_login()
def ajax_add_profission():
    try:
        profession_id = request.vars.value
        # Record profession in the database
        dic_insert = {
            'profession_id': profession_id,
            'user_id': auth.user.id,
            }
        db.professional_relationship[0] = dic_insert

        #Taking competencies related to profession inserted
        competencies = db(db.competence.profession_id==profession_id).select()
        dic_competencies = {}
        for c in competencies:
            dic_competencies[str(c.id)] = c.competence

        return dict(competencies=dic_competencies)
    except:
        return False


@auth.requires_login()
def ajax_add_competence():
    import json
    try:
        profession_id = request.vars.profession
        my_competencies_id = json.loads(request.vars.competence)
        list_competencies =[i.id for i in db(db.competence.profession_id==profession_id).select(db.competence.id)]
        user_id = auth.user.id

        # inserts the new competencies
        for competence_id in my_competencies_id:
            row = db( (db.professional_relationship.user_id == user_id) & \
                    (db.professional_relationship.profession_id == profession_id) & \
                    (db.professional_relationship.competence_id == None) \
                ).select().first()

            if row:
                #update
                db.professional_relationship[row.id] = {'competence_id': competence_id}
            else:
                #insert
                record = db( (db.professional_relationship.user_id == user_id) & \
                        (db.professional_relationship.profession_id == profession_id) & \
                        (db.professional_relationship.competence_id == competence_id) \
                    ).select().first()
                if not record:
                    #insert
                    db.professional_relationship.insert(
                        profession_id = profession_id,
                        competence_id = competence_id,
                        user_id = user_id,
                    )
        # excludes competencies unused
        for competence_id in list_competencies:
            if not competence_id in my_competencies_id:
                count = db((db.professional_relationship.user_id == user_id) & \
                           (db.professional_relationship.profession_id==profession_id) \
                ).count()
                if count == 1:
                    # updates if there is 1 record
                    db( (db.professional_relationship.user_id == user_id) & \
                            (db.professional_relationship.profession_id == profession_id) & \
                            (db.professional_relationship.competence_id == competence_id) \
                        ).update(competence_id=None)

                else:
                    # delete if more than 1 record
                    db( (db.professional_relationship.user_id == user_id) & \
                            (db.professional_relationship.profession_id == profession_id) & \
                            (db.professional_relationship.competence_id == competence_id) \
                        ).delete()

        return True
    except:
        return False

@auth.requires_login()
def ajax_add_location():
    if request.vars.field == "country_id":
        try:
            field_db =  request.vars.field
            new_value =  request.vars.value
            user_id = auth.user.id
            dic_update = {field_db:new_value}
            db.auth_user[user_id] = dic_update

            rows = db(db.states.country_id==new_value).select(db.states.id, db.states.name)
            states = {}

            for row in rows:
                states[str(row.id)] = row.name

            return states
        except:
            return False

    elif request.vars.field == "states_id":
        try:
            field_db =  request.vars.field
            new_value =  request.vars.value
            user_id = auth.user.id
            dic_update = {field_db:new_value}
            db.auth_user[user_id] = dic_update

            rows = db(db.city.states_id==new_value).select(db.city.id, db.city.name)
            citys = {}

            for row in rows:
                citys[str(row.id)] = row.name

            # first city record for default
            citys_id = citys.keys()
            citys_id.sort()
            db.auth_user[user_id] = {'city_id': citys_id[0]}
            return citys
        except:
            return False

    else:
        try:
            field_db =  request.vars.field
            new_value =  request.vars.value
            user_id = auth.user.id
            dic_update = {field_db:new_value}
            db.auth_user[user_id] = dic_update

            return True
        except:
            return False

@auth.requires_login()
def ajax_add_link():
    try:
        link_type_id =  request.vars.link_type_id
        url =  request.vars.url
        user_id = auth.user.id
        dic_update = dict(user_id=user_id, link_type_id=link_type_id, url=url)

        db.links[0] = dic_update
        return True
    except:
        return False


@auth.requires_login()
def ajax_remove_profission():
    try:
        id_profission =  request.vars.id
        user_id = auth.user.id
        db( (db.professional_relationship.profession_id==id_profission) & \
            (db.professional_relationship.user_id==user_id)
        ).delete()
        return True
    except:
        return False


@auth.requires_login()
def ajax_remove_link():
    try:
        id_link_type =  request.vars.id
        user_id = auth.user.id
        db( (db.links.link_type_id==id_link_type) & \
            (db.links.user_id==user_id)
        ).delete()
        return True
    except:
        return False


@auth.requires_login()
def ajax_edit_project():
    #try:
    field_db =  request.vars.field
    new_value =  request.vars.value
    dic_update = {field_db:new_value}

    if field_db == 'image':
        request.vars.img = request.vars.image64
        image_converted = converter_imagem_projeto()
        if image_converted:
            project = db(db.projects.id == session.project_id).select().first()

            if project.image:
                # Deleta o avatar antigo
                import subprocess
                subprocess.call('rm %suploads/%s' % (request.folder,project.image), shell=True)

                #Salva o avatar novo
                db(db.projects.id  == project.id).update(image=image_converted)
                return True
    if field_db == 'project_links':
        if type(request.vars['value[]']) == str:
            new_value = [request.vars['value[]']]
        else:
            new_value = request.vars['value[]']
        dic_update[field_db] = new_value

    print field_db, ':', new_value
    db.projects[session.project_id] = dic_update

    #except:
        #return False

@auth.requires_login()
def ajax_add_members_project():
    import json
    # buscar: funcao_atual

    #recebe qual o projeto (id? slug? session?)
    # grava no banco os bagulhos do time
    # pega pelo id do cara a foto e o cargo
    # retorna um dict ( {'id': [nome completo, foto, cargo]} )
    # qual profissao ? #### perguntar na reuniao

    # ==== project_id = session.project_id

#    project_id = 1
#    new_team_member = '{"1":"r4bugento"}' #pegar via ajax '{"1":"r4bugento", "2": "diego"}'
    member_added = '{"1": ["nome do cara", "foto do cara", "cargo do cara"]}'
#
#    project = db(db.projects.id == project_id).select().first()
#    team = json.loads(project.team)
#    new_team = new_team_member.split(",")
#    d = {}
#    for i in new_team:
#        x = i.split(":")
#        d[x[0]] = x[1]
#    team.update(d)
#    myjson = json.dumps(team)
#
#    # ==== db(db.projects.id == project_id).update(team=myjson)
#
#    user_added_id = json.loads(new_team_member).keys()[0]
#    print user_added_id
#    # ==== user = db(db.auth_user.id==user_added_id).select().first()
    

    return member_added



# Usando essa função para testar os ajax por favor não deletar
def testaAjax():

    print "Olá mundo"
    print request.vars

    # varJson = 
    # users.append({"1": "r4bugento", "7": "vinnywan"})
    # return dict(users=users)
    # return dict(varJson)
    return True


def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    """

    if 'register' in request.args:
        fields_to_hide = [
        'last_name', 'age', 'localization', 'bio', 'user_available', 'availability']

        for fieldname in fields_to_hide:
            field = db.auth_user[fieldname]
            field.readable = field.writable = False

    elif 'login' in request.args:
        db.auth_user.username.label = T("Username or Email")
        auth.settings.login_userfield = 'username'
        if request.vars.username and not IS_EMAIL()(request.vars.username)[1]:
            auth.settings.login_userfield = 'email'
            request.vars.email = request.vars.username
            request.post_vars.email = request.vars.email
            request.vars.username = None
            request.post_vars.username = None

        return dict(form=auth())

    elif 'profile' in request.args:
        form=auth()
        professions = db(db.profession.user_id == auth.user.id).select()
        networking = db(db.network_type.user_id == auth.user.id).select()

        form_networking = SQLFORM.factory(
            db.network_type,
            fields = ['network', 'network_type'],
            submit_button=T('add')
            )

        competencies = []
        if professions:
            for i in professions:
                this_competence = db(db.competence.profession_id == i.id).select()
                if this_competence:
                    competencies.append(this_competence)

        form_profession = SQLFORM.factory(
            db.profession,
            table_name='professions',
            submit_button=T('add')
            )
        form_competencies = SQLFORM.factory(
            Field("profession_id",label="profession_id"),
            db.competence,
            table_name='competencies',
            )

        # auth form
        if form.process().accepted:
            redirect(URL("user_info"))
        elif form.errors:
            response.session = 'form has errors'

        # professions form
        if form_profession.process().accepted:
            # id_professions = [i.id for i in professions]
            # if not request.vars.profession in id_professions:
            db.profession.insert(
                profession=request.vars.profession,
                user_id=auth.user.id
                )
            # else:
            #     db(db.profession.id == ).update(
            #         profession=request.vars.profession,
            #         )

            response.flash = 'form accepted'
            redirect(URL("user",args=["profile"]))
        elif form_profession.errors:
            response.flash = 'form has errors'

        # competencies form
        if form_competencies.process().accepted:
            db.competence.insert(
                competence=request.vars.competence,
                profession_id=request.vars.profession_id,
                )

            response.flash = 'form accepted'
            redirect(URL("user",args=["profile"]))
        elif form_competencies.errors:
            response.flash = 'form has errors'

        #networking form
        if form_networking.process().accepted:
            db.network_type.insert(
                user_id = auth.user.id,
                network = request.vars.network,
                network_type = request.vars.network_type
                )
            response.flash = 'fom accepted'
            redirect(URL("user",args=["profile"]))
        elif form_networking.errors:
            response.flash = 'form has errors'


        return dict(
            form=form,form_profession=form_profession,form_competencies=form_competencies,form_networking=form_networking,
            professions=professions,competencies=competencies,networking=networking)

    return dict(form=auth())


def message_register():
    if auth.is_logged_in():
        redirect(URL('user_info'))
    return dict()


@auth.requires_login()
def edit_profession():
    profession = db.profession(request.vars.id)
    form = SQLFORM.factory(Field('profession'))
    form.vars.profession = profession.profession
    if form.accepts(request.vars):
        db(db.profession.id == profession.id).update(profession=request.vars.profession)
        redirect(URL("user",args=["profile"]))
    return dict(form=form)

@auth.requires_login()
def delete_profession():
    profession_id = request.vars.id
    if db(db.profession.id == profession_id).select():
        db(db.profession.id == profession_id).delete()
        redirect(URL("user",args=["profile"]))
    else:
        redirect(URL("user",args=["profile"]))

@auth.requires_login()
def edit_network():
    network = db.network_type(request.vars.id)
    form = SQLFORM.factory(Field('network'), Field('network_type', requires=IS_EMPTY_OR(IS_IN_SET(['Skype', 'Facebook', 'Google+', 'LinkedIn', 'Twitter', 'E-mail']))))
    form.vars.network = network.network
    form.vars.network_type = network.network_type
    if form.accepts(request.vars):
        db(db.network_type.id == network.id).update(network=request.vars.network, network_type=request.vars.network_type)
        redirect(URL("user",args=["profile"]))
    return dict(form=form)

@auth.requires_login()
def delete_network():
    network_id = request.vars.id
    if db(db.network_type.id == network_id).select():
        db(db.network_type.id == network_id).delete()
        redirect(URL("user",args=["profile"]))
    else:
        redirect(URL("user",args=["profile"]))

def user_info():
    message = T("User doesn't exist.")
    if auth.is_logged_in():
        seach_user = auth.user.username
    else:
        seach_user = request.args(0) or redirect(URL('index'))

    user = db.auth_user(username=seach_user) or message

    if user != message:
        my_links = db(db.links.user_id == auth.user.id).select()
        professional_relation = db(db.professional_relationship.user_id == user.id).select()
        professional_data = {}
        if professional_relation:
            for i in professional_relation:
                if i.profession_id.name in professional_data:
                    try:
                        professional_data[i.profession_id.name].append(i.competence_id.competence)
                    except:
                        professional_data[i.profession_id.name].append({})
                else:
                    try:
                        professional_data[i.profession_id.name] = [i.competence_id.competence]
                    except:
                        professional_data[i.profession_id.name] = {}

        last_project = db(db.projects.project_owner == user).select(orderby='created_on').last()
        my_projects = db(db.projects.project_owner == user).select(orderby='created_on', limitby=(0,5))
        team = db(db.projects).select(orderby='created_on', limitby=(0,5))
        colaborate_projects = {}
        if team != None:
            for n,i in enumerate(team):
                if i.team.count(str(user.id)):
                    colaborate_projects[n] = i
        return dict(
                user=user, message=message,
                professional_data=professional_data,
                last_project=last_project,
                my_projects=my_projects,
                my_links=my_links,
                colaborate_projects=colaborate_projects,
                )

    else:
        if db.projects(project_slug = request.args(0)):
            redirect(URL('projects', args=request.args(0)))
        else:
            return dict(user=user, message=message)


def projects():
    import json
    message = T("Project not found.")
    project = db.projects(project_slug = request.args(0)) or message
    session.project_id = project

    if project != message:
        collaborators = []
        if project.team:
            for i in json.loads(project.team):
                collaborator = db(db.auth_user.id == i).select().first()
                user_role = db((db.team_function.username == collaborator.username)&(db.team_function.project_id == project.id)).select().first()
                # listar profissoes do colaborador
                #profession = db(db.professional_relationship.user_id == i).select(db.professional_relationship.profession_id)

                collaborator.username = collaborator.username
                if user_role:
                    collaborator.role = user_role.role
                else:
                    collaborator.role = user_role

                #if profession:
                #    collaborator.professions = profession
                #else:
                #    collaborator.profession = profession

                collaborators.append(collaborator)
                user_role = SQLFORM.factory(Field("username"), Field("role"), _id='user_role')
                myteam = json.loads(project.team)
                mystring = ""
        for i in myteam:
            mystring += "%s:%s," % (i,myteam[i])
            project.team = mystring[0:-1]

        new_colaborator = ''
        if auth.user and auth.user.id == project.project_owner:
            new_colaborator = SQLFORM.factory(db.projects.team)

            if new_colaborator.process().accepted:
                project = db(db.projects.id == session.project_id).select().first()
                team = json.loads(project.team)
                new_team = new_colaborator.vars.team.split(",")
                d = {}
                for i in new_team:
                    x = i.split(":")
                    d[x[0]] = x[1]
                team.update(d)
                myjson = json.dumps(team)
                project_id = session.project_id
                db(db.projects.id  == project_id).update(team=myjson)
                session.flash = T("Project edited!")
                redirect(URL('projects', args=request.args(0)))
            elif new_colaborator.errors:
                response.flash = T("Form has errors!")

        if user_role.accepts(request.vars):
            if not db((db.team_function.username == request.vars.username)&(db.team_function.project_id == project.id)).select():
                db.team_function.insert(project_id = project.id, username = request.vars.username, role = request.vars.role)
            else:
                db((db.team_function.username == request.vars.username)&(db.team_function.project_id == project.id)).update(role=request.vars.role)

            redirect(URL(f="projects", args=request.args(0)))
        elif user_role.errors:
            response.flash = T("Form has errors!")

        searching_team = SQLFORM(db.projects, project, fields=["wanting_team", "team_wanted", "wanting_other", "other_wanted"],
                                labels = {'wanting_team':'Searching for team', 'team_wanted':'Kind of team',
                                'wanting_other':'Searching for other members', 'other_wanted':'Kind of members'},
                                showid=False,
                                _id="searching_team")
        if searching_team.process().accepted:
            response.flash = T('Form accepted!')
            redirect(URL(f='projects', args=request.args(0)))
        elif searching_team.errors:
            response.flash = T('Form has errors!')

        return dict(
                project=project, message=message, user_role=user_role, collaborators=collaborators,
                searching_team=searching_team, new_colaborator = new_colaborator)

    else:
        return dict(project=project, message=message)


def converter_imagem_projeto():
    import subprocess

    upload_folder = '{}uploads/'.format(request.folder)
    type_upload = 'image_project'
    img_converted = _image_converter(request.vars.img, upload_folder, type_upload)

    return img_converted or ''


@auth.requires_login()
def create_project():
    import json
    form = SQLFORM(db.projects)
    # faz o insert do carinha no time


    if form.process().accepted:
        project_id = form.vars.id
        session.flash = T('Project created!')
        #pegar os colaboradores do projeto.
        # code
        # pegando os funcionarios a SEREM ADICIONADOS.
        # {'id','id'}
        if form.vars.team:
            team = form.vars.team.split(",")
            team.append('{_id}:{_username}'.format(_id=auth.user.id, _username=auth.user.username))
        else:
            team = ['{_id}:{_username}'.format(_id=auth.user.id, _username=auth.user.username)]
        d = {}
        for i in team:
            x = i.split(":")
            d[x[0]] = x[1]  #d[x[tamanhoDoDicionadio]
        myjson = json.dumps(d)
        # juntar o MYJSON(funcionarios a serem adicionados) com o json dos colaboradores já existentes.
        #fazendo o update.
        db(db.projects.id  == project_id).update(team=myjson)

        # record imagem from upload
        image_converted = converter_imagem_projeto()
        if image_converted:
            db(db.projects.id  == project_id).update(image=image_converted)

        project_created = db.projects[project_id]

        redirect(URL('edit_project', args=project_created.project_slug, vars={'stage': '2'}))

    elif form.errors:
        response.flash = T('Form has errors!')
        print form.errors
    return dict(form=form)

@auth.requires_login()
def edit_project():
    import json
    project_slug = request.args(0) or redirect(URL('user_info'))
    project = db.projects(project_slug=project_slug) or redirect(URL('user_info'))
    session.project_id = project.id

    #if auth.user_id == project.project_owner:
    new_colaborator = ''
    if auth.user and auth.user.id == project.project_owner:
        new_colaborator = SQLFORM.factory(db.projects.team)

        # ====== colocar numa funcao que sera chamada via ajax
        if new_colaborator.process().accepted:
            project = db(db.projects.id == session.project_id).select().first()
            team = json.loads(project.team)
            new_team = new_colaborator.vars.team.split(",")
            d = {}
            for i in new_team:
                x = i.split(":")
                d[x[0]] = x[1]
            team.update(d)
            myjson = json.dumps(team)
            project_id = session.project_id
            db(db.projects.id  == project_id).update(team=myjson)
            session.flash = T("Project edited!")
            redirect(URL('edit_project', args=[request.args(0)], vars={'stage':2}))
        elif new_colaborator.errors:
            response.flash = T("Form has errors!")
        # ====== colocar numa funcao que sera chamada via ajax

#######################################3
        # comentando isso, estarei mandando para a view o dicionario mesmo
        #if user_role.accepts(request.vars):
        #if project.team:
        #    myteam = json.loads(project.team)
        #    mystring = ""
        #    for i in myteam:
        #        mystring += "%s:%s," % (i,myteam[i])
        #    project.team = mystring[0:-1]

        form = SQLFORM(db.projects,
               project,
               showid=False
               )
        if form.process().accepted:
            # aqui pega a string e reparte ela para gravar o team
            team = form.vars.team.split(",")
            d = {}
            for i in team:
                x = i.split(":")
                d[x[0]] = x[1]
            myjson = json.dumps(d)
            project_id = form.vars.id
            db(db.projects.id  == project_id).update(team=myjson)
            session.flash = T("Project edited!")
            redirect(URL('projects', args=request.args(0)))
        elif form.errors:
            response.flash = T("Form has errors!")

        return dict(form=form, project=project, new_colaborator=new_colaborator)
    else:
        redirect(URL('user_info'))

@auth.requires_login()
def remove_person():
    '''Remove user from a project
    '''
    import json

    user_id = request.vars.user_id or redirect(URL('user_info'))
    project_id = request.vars.project_id or redirect(URL('user_info'))
    project = db(db.projects.id==project_id).select().first() or redirect(URL('user_info'))

    if int(user_id) == auth.user.id or project.project_owner == auth.user.id:
        dic_team = json.loads(project.team)
        try:
            del dic_team[user_id]
        except:
            pass
        team = json.dumps(dic_team)
        db(db.projects.id==project.id).update(team=team)

    redirect(URL('user_info'))


def comments():
    message = T("Be the first to make a comment!")
    project = session.project_id
    comments = db(db.comment_project.project_id == project.id).select()
    form=SQLFORM.factory(db.comment_project, fields=['title', 'body'])
    if form.accepts(request.vars):
        db.comment_project.insert(title=request.vars.title, body=request.vars.body, project_id=project.id)
        redirect(URL('default', 'comments.load'))

    replied = []
    if comments:
        for comment in comments:
            if comment.is_reply:
                replied += db(db.comment_project.id == comment.replied_id).select()

    return dict(message=message, project=project, comments=comments, replied=replied, form=form)

@auth.requires_login()
def edit_comment():
    comment = db.comment_project(request.vars.id)
    project = session.project_id
    form = SQLFORM.factory(Field('title'), Field('body', 'text'))
    form.vars.title = comment.title
    form.vars.body = comment.body
    if form.accepts(request.vars):
        db(db.comment_project.id == comment.id).update(title=request.vars.title, body=request.vars.body)
        redirect(URL('projects', args=project.name, extension=False))
    return dict(form=form)

@auth.requires_login()
def delete_comment():
    comment = db.comment_project(request.vars.id)
    project = session.project_id
    if db(db.comment_project.id == comment.id).select():
        db(db.comment_project.id == comment.id).delete()
        redirect(URL('projects', args=project.name, extension=False))
    else:
        redirect(URL('projects', args=project.name, extension=False))

@auth.requires_login()
def reply_comment():
    comment = db.comment_project(request.vars.id)
    project = session.project_id
    form = SQLFORM.factory(db.comment_project, fields=['title', 'body'])
    if form.accepts(request.vars):
        db.comment_project.insert(title=request.vars.title, body=request.vars.body, is_reply=True, replied_id=comment.id, project_id=project.id)
        redirect(URL('projects', args=project.name))
    return dict(form=form)

def search():
    search = SQLFORM.factory(Field('search'), submit_button="Search")
    if search.process().accepted:
        query = request.vars.search
        redirect(URL('results', vars={'q':query}, extension=False), client_side=True)
    return dict(search=search)

def results():
    query = request.vars.q
    message = T('Your search returned no results.')
    projects = db(db.projects.name.like('%'+query+'%')).select()
    users = db(db.auth_user.username.like('%'+query+'%')).select()
    return dict(users=users, projects=projects, message=message)

@service.json
def get_users():
    term = request.vars.q
    rows = db(db.auth_user.username.lower().like(term+'%')).select()
    users = []
    for i in rows:
        users.append({"id": i.id, "title" : i.username})
    return dict(users=users)

@service.json
def get_user_name():
    # This functions gets the first name of user.
    term = request.vars.q
    rows = db(db.auth_user.first_name.like(term+'%')).select()
    users = []
    for i in rows:
        users.append({"id":i.id,"title":i.first_name})
    return dict(users = users)

def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request, db)


def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()


@auth.requires_signature()
def data():
    """
    http://..../[app]/default/data/tables
    http://..../[app]/default/data/create/[table]
    http://..../[app]/default/data/read/[table]/[id]
    http://..../[app]/default/data/update/[table]/[id]
    http://..../[app]/default/data/delete/[table]/[id]
    http://..../[app]/default/data/select/[table]
    http://..../[app]/default/data/search/[table]
    but URLs must be signed, i.e. linked with
      A('table',_href=URL('data/tables',user_signature=True))
    or with the signed load operator
      LOAD('default','data.load',args='tables',ajax=True,user_signature=True)
    """
    return dict(form=crud())
