'use strict'

const Hash = use('Hash')
const User = use('App/Model/User')
const Validator = use('Validator')

class UserController {
  /**
   *
   */
  * doLogin (request, response) {
    const username = request.input('username')
    const password = request.input('password')

    try {
      const login = yield request.auth.attempt(username, password)

      if (login) {
        response.route('login')
        return
      }

      throw new Error('Invalid credentails')
    }
	catch (err) {
      yield request.withAll().andWith({ error: err }).flash()
      response.route('login')
    }
  }

   * doAdminLogin (request, response) {
    const username = request.input('username')
    const password = request.input('password')

    try {
      const adminlogin = yield request.auth.attempt(username, password)

      if (adminlogin) {
        response.route('adminlogin')
        return
      }

      throw new Error('Invalid credentails')
    }
	catch (err) {
      yield request.withAll().andWith({ error: err }).flash()
      response.route('adminlogin')
    }
  }


  /**
   *
   */
  * doRegister (request, response) {
    const userData = request.all()

    const validation = yield Validator.validateAll(userData, {
      username: 'required|alpha_numeric|unique:users',
      email: 'required|email|unique:users',
      address: 'required|alpha_numeric',
      phone: 'required|alpha_numeric',
      password: 'required|min:4',
      password_again: 'required|same:password'
    })

    if (validation.fails()) {
      yield request
        .withOut('password', 'password_again')
        .andWith({ errors: validation.messages() })
        .flash()

      response.route('register')
	  return;

    
    }
	
    const user = new User()
    user.username = userData.username
    user.email = userData.email
    user.address = userData.address
    user.phone = userData.phone
    user.password = yield Hash.make(userData.password)

    yield user.save()

    yield request.auth.login(user)
    
    response.route('register')
  }

  /**
   *
   */
  * doLogout (request, response) {
    yield request.auth.logout()
    response.route('main')
  }

  /**
   *
   */
  * login (request, response) {
    if (request.currentUser) {
      response.route('main')
      return
    }

    yield response.sendView('login')
  }

* adminlogin (request, response) {
    if (request.currentUser) {
      response.route('title_create')
      return
    }

    yield response.sendView('adminlogin')
  }
  /**
   *
   */
  * register (request, response) {
    if (request.currentUser) {
      response.route('main')
      return
    }

    yield response.sendView('register')
  }

  * doBuy (request, response) {
    const titleData = request.all()
    const title = new Title()
    title.name = titleData.name

    const user =  request.currentUser
    const purchased = new Purchased()

    purchased.username = user.username
    purchased.titlename = title.username
    purchased.email = user.email
    purchased.address = user.address
    purchased.phone = user.phone

    yield purchased.save()
   
      response.route('title')
      return
    }

 //   yield response.sendView('register')
 // }

  /**
   *
   */
  * profile (request, response) {
    yield response.sendView('profile')
  }

  /**
   *
   */
  * doPasswordEdit (request, response) {
    const userData = request.all()

    const validation = yield Validator.validateAll(userData, {
      old_password: 'required',
      new_password: 'required|min:4',
      new_password_again: 'required|same:new_password'
    })

    if (validation.fails()) {
      yield request
        .with({ errors: validation.messages() })
        .flash()
		
     response.route('profile')
	 return;
    }
    
    const user = request.currentUser
    const isSame = yield Hash.verify(userData.old_password, user.password)

    if (!isSame) {
      yield request
        .with({ errors: [{ message: 'Bad actual password.' }] })
        .flash()
		
      response.route('profile')
	  return
    }

    user.password = yield Hash.make(userData.new_password)

    yield user.update()

    yield request
      .with({ success: 'Password changed successfully.' })
      .flash()
	
    response.route('profile')
  }

  /**
   *
   */
  * doProfileEdit (request, response) {
    const userData = request.all()
    const user = request.currentUser

    if (userData.username !== user.username) {
      rules.username = 'required|alpha_numeric|unique:users'
    }

    if (userData.email !== user.email) {
      rules.email = 'required|email|unique:users'
    }
     if (userData.address !== user.address) {
      rules.address = 'required|alpha_numeric'
    }
     if (userData.phone !== user.phone) {
      rules.phone = 'required|alpha_numeric'
    }

    const validation = yield Validator.validateAll(userData, rules)

    if (validation.fails()) {
      yield request
        .with({ errors: validation.messages() })
        .flash()

      response.route('profile')
	  return;
    }
	
    user.username = userData.username
    user.email = userData.email
    user.address = userData.address
    user.phone = userData.phone

    yield user.update()

    yield request
      .with({ success: 'Profile changed successfully.' })
      .flash()
	
    response.route('profile')
  }
}

module.exports = UserController
