'use strict'

const Event = use('Event')

Event.when('Http.error.*', 'Http.handleError')
Event.when('Http.start', 'Http.onStart')
