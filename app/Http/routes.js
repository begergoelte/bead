'use strict'

const Route = use('Route')

Route.group('ajax', function () {
   Route.delete('/title/:id/delete', 'TitleController.ajaxDelete').middleware('auth')
   Route.post('/login', 'UserController.ajaxLogin')
 }).prefix('/ajax')

Route.get('/login', 'UserController.login').as('login')
Route.post('/login', 'UserController.doLogin').as('do_login')

Route.get('/adminlogin', 'UserController.adminlogin').as('adminlogin')
Route.post('/adminlogin', 'UserController.doAdminLogin').as('do_adminlogin')


Route.get('/register', 'UserController.register').as('register')
Route.post('/register', 'UserController.doRegister').as('do_register')
Route.get('/profile', 'UserController.profile').as('profile').middleware('auth')
Route.get('/logout', 'UserController.doLogout').as('do_logout').middleware('auth')
Route.post('/profile/edit', 'UserController.doProfileEdit').as('do_profile_edit').middleware('auth')
Route.post('/profile/edit_password', 'UserController.doPasswordEdit').as('do_password_edit').middleware('auth')

Route.get('/', 'TitleController.main').as('main')
Route.get('/title', 'TitleController.index').as('title_list')
Route.get('/title', 'TitleController.doBuy').as('buy')
Route.get('/admintitle', 'TitleController.adminindex').as('admin_title_list')
Route.get('/title/create', 'TitleController.create').as('title_create').middleware('auth')
Route.post('/title/create', 'TitleController.doCreate').as('do_title_create').middleware('auth')
Route.get('/admintitle/:id', 'TitleController.adminshow').as('admin_title_page')
Route.get('/title/:id', 'TitleController.show').as('title_page')
Route.get('/title/:id/edit', 'TitleController.edit').as('title_edit')
Route.post('/title/:id/edit', 'TitleController.doEdit').as('do_title_edit')
Route.get('/title/:id/delete', 'TitleController.doDelete').as('title_delete')

