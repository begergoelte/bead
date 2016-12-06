'use strict'

const Category = use('App/Model/Category')
const Title = use('App/Model/Title')
const User = use('App/Model/User')
const Validator = use('Validator')
const Helpers = use('Helpers')
const fs = use('fs')

class TitleController {

  * main (request, response) {

    const categories = yield Category.all()

 
    for (let category of categories) {
      const latestTitle = yield category.titles().active().orderBy('id', 'desc').limit(5).fetch()
      category.latestTitle = latestTitle.toJSON()
    }

    yield response.sendView('main', {
      categories: categories
        .filter(category => category.latestTitle.length > 0)
        .toJSON()
    })
  }

   * adminindex (request, response) {
    const page = Math.max(1, request.input('p'))
    const filters = {
      titleName: request.input('titleName') || '',
      category: request.input('category') || 0,
      createdBy: request.input('createdBy') || 0
    }

    const titles = yield Title.query()
      .active()
      .where(function () {
        if (filters.category > 0) this.where('category_id', filters.category)
        if (filters.createdBy > 0) this.where('created_by_id', filters.createdBy)
        if (filters.titleName.length > 0) this.where('name', 'LIKE', `%${filters.titleName}%`)
      })
      .with('created_by')
      .paginate(page, 9)

    const categories = yield Category.all()
    const users = yield User.all()

    yield response.sendView('admintitles', {
      titles: titles.toJSON(),
      categories: categories.toJSON(),
      users: users.toJSON(),
      filters
    })
  }

  * index (request, response) {
    const page = Math.max(1, request.input('p'))
    const filters = {
      titleName: request.input('titleName') || '',
      category: request.input('category') || 0,
      createdBy: request.input('createdBy') || 0
    }

    const titles = yield Title.query()
      .active()
      .where(function () {
        if (filters.category > 0) this.where('category_id', filters.category)
        if (filters.createdBy > 0) this.where('created_by_id', filters.createdBy)
        if (filters.titleName.length > 0) this.where('name', 'LIKE', `%${filters.titleName}%`)
      })
      .with('created_by')
      .paginate(page, 9)

    const categories = yield Category.all()
    const users = yield User.all()

    yield response.sendView('titles', {
      titles: titles.toJSON(),
      categories: categories.toJSON(),
      users: users.toJSON(),
      filters
    })
  }


  * create (request, response) {
    const categories = yield Category.all()

    yield response.sendView('title_create', { categories: categories.toJSON() })
  }


  * doCreate (request, response) {
    const titleData = request.all()
    const validation = yield Validator.validateAll(titleData, {
      name: 'required',
      description: 'required'
    })

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({ errors: validation.messages() })
        .flash()

      response.route('title_create')
	  return;
    }
    const category = yield Category.find(titleData.category)

    if (!category) {
      yield request
        .withAll()
        .andWith({ errors: [{ message: 'category doesn\'t exist' }] })
        .flash()

      response.route('title_create')
	  return;
    }
	
    const titleImage = request.file('image', { maxSize: '1mb', allowedExtensions: ['jpg', 'JPG'] })

    if (titleImage.clientSize() > 0 && !titleImage.validate()) {
      yield request
        .withAll()
        .andWith({ errors: [{ message: titleImage.errors() }] })
        .flash()

      response.route('title_create')
      return
    }
  
    const title = new Title()
    title.name = titleData.name
    title.description = titleData.description
    title.category_id = titleData.category
    title.created_by_id = request.currentUser.id

  
    yield title.save()
    yield titleImage.move(Helpers.publicPath() + '/images', `${title.id}.jpg`)

    response.route('admin_title_page', { id: title.id })
  }

  * show (request, response) {
    const titleId = request.param('id')
    const title = yield Title.find(titleId)

    if (title) {
      yield title.related('category').load()
      yield title.related('created_by').load()

      const fileName = `/images/${title.id}.jpg`
      const imageExists = yield fileExists(`${Helpers.publicPath()}/${fileName}`)
      const titleImage = imageExists ? fileName : false

      yield response.sendView('title', { title: title.toJSON(), titleImage })
    } else {
      response.notFound('title not found.')
    }
  }


  * adminshow (request, response) {
    const titleId = request.param('id')
    const title = yield Title.find(titleId)

    if (title) {
      yield title.related('category').load()
      yield title.related('created_by').load()

      const fileName = `/images/${title.id}.jpg`
      const imageExists = yield fileExists(`${Helpers.publicPath()}/${fileName}`)
      const titleImage = imageExists ? fileName : false

      yield response.sendView('admintitle', { title: title.toJSON(), titleImage })
    } else {
      response.notFound('title not found.')
    }
  }
 
  * edit (request, response) {
    const titleId = request.param('id')
    const title = yield Title.find(titleId)

	
    if (!title || title.deleted == true) {
	  yield response.notFound('title not found.')
	  return;
    } 
	
    if (title.created_by_id !== request.currentUser.id) {
      response.unauthorized('Access denied.')
    }

    yield title.related('category').load()
    yield title.related('created_by').load()

    const categories = yield Category.all()

    yield response.sendView('title_edit', { categories: categories.toJSON(), title: title.toJSON() })
  }

 
  * doEdit (request, response) {
    const titleId = request.param('id')
    const title = yield Title.find(titleId)

    if (!title || title.deleted) {
	  yield response.notFound('title not found.')
	  return;
    } 
	
    if (title.created_by_id !== request.currentUser.id) {
      yield response.unauthorized('Access denied.')
	  return;
    }
	  
    const titleData = request.all()
    const validation = yield Validator.validateAll(titleData, {
      name: 'required',
      description: 'required'
    })

    if (validation.fails()) {
      yield request
        .with({ errors: validation.messages() })
        .flash()

      yield response.route('title_edit', {id: title.id})
	  return;
    } 
      const category = yield Category.find(titleData.category)

    if (!category) {
      yield request
        .with({ errors: [{ message: 'category doesn\'t exist' }] })
        .flash()

      yield response.route('title_edit', {id: title.id})
	  return;
    } 
    const titleImage = request.file('image', { maxSize: '1mb', allowedExtensions: ['jpg', 'JPG'] })

    if (titleImage.clientSize() > 0) {
      yield titleImage.move(Helpers.publicPath() + '/images', `${title.id}.jpg`)

      if (!titleImage.moved()) {
        yield request
          .with({ errors: [{ message: titleImage.errors() }] })
          .flash()

        response.route('title_edit', {id: title.id})
        return
      }
    }

    title.name = titleData.name
    title.description = titleData.description
    title.category_id = titleData.category

    yield title.update()

    response.route('title_page', { id: title.id })
    
  }

  
  * doDelete (request, response) {
    const titleId = request.param('id')
    const title = yield Title.find(titleId)

    if (title) {
      if (title.created_by_id !== request.currentUser.id) {
        response.unauthorized('Access denied.')
      }

      title.deleted = true
      yield title.update()

      response.route('main')
    } else {
      response.notFound('title not found.')
    }
  }
}

function fileExists(fileName) {
  return new Promise((resolve, reject) => {
    fs.access(fileName, fs.constants.F_OK, err => {
      if (err) resolve(false)
      else resolve(true)
    })
  })
}

module.exports = TitleController
