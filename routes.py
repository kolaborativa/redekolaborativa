#coding: utf-8

BASE = ''
routes_in = (
    (BASE + '/index', BASE + '/kolaborativa/default/index'),
    (BASE + '/principal', BASE + '/kolaborativa/default/principal'),
    (BASE + '/user/$anything', BASE + '/kolaborativa/default/user/$anything'),
    (BASE + '/user_info/$anything', BASE + '/kolaborativa/default/user_info/$anything'),
    (BASE + '/projects/$anything', BASE + '/kolaborativa/default/projects/$anything'),
    (BASE + '/create_project', BASE + '/kolaborativa/default/create_project'),
    (BASE + '/edit_project/$anything', BASE + '/kolaborativa/default/edit_project/$anything'),
    (BASE + '/download/$anything', BASE + '/kolaborativa/default/download/$anything'),
    (BASE + '/call/$anything', BASE + '/kolaborativa/default/call$anything'),
    (BASE + '/call/json/$anything', BASE + '/kolaborativa/default/call/json/$anything'),
    (BASE + '/data/$anything', BASE + '/kolaborativa/default/data/$anything'),
    (BASE + '/$username', BASE + '/kolaborativa/default/user_info/$username'),
    (BASE + '/search/user/$anything', BASE + '/kolaborativa/default/search/user/$user'),
    (BASE + '/search/projcts/$anything', BASE + '/kolaborativa/default/search/projects/$project'),
    (BASE + '/search/$anything', BASE + '/kolaborativa/default/search/$q'),
)

routes_out = [(x, y) for (y, x) in routes_in]
