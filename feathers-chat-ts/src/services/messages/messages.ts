// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  messageDataValidator,
  messagePatchValidator,
  messageQueryValidator,
  messageResolver,
  messageExternalResolver,
  messageDataResolver,
  messagePatchResolver,
  messageQueryResolver
} from './messages.schema'

import type { Application, HookContext } from '../../declarations'
import { MessageService, getOptions } from './messages.class'
import { messagePath, messageMethods } from './messages.shared'
import { logRuntime } from '../../hooks/log-runtime'
import { user } from '../users/users'

export * from './messages.class'
export * from './messages.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const message = (app: Application) => {
  // Register our service on the Feathers application
  app.use(messagePath, new MessageService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: messageMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(messagePath).hooks({
    around: {
      all: [
        logRuntime,
        authenticate('jwt'),
        schemaHooks.resolveExternal(messageExternalResolver),
        schemaHooks.resolveResult(messageResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(messageQueryValidator), schemaHooks.resolveQuery(messageQueryResolver)],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(messageDataValidator),
        schemaHooks.resolveData(messageDataResolver),

        // Some additional group functionality
        //
        async ({ app, params, data, result, id }: HookContext) => {
          if (data.text) {
            if (data.text == '?') {
              data.text = `Help information about groups:
               
            >groups create:<group name>  creates a new group
            >groups list  lists all your own groups

            To show a message in a group, pre-fix it with the group id and ":'. For example "5:How are you all?"
            `
            } else if (data.text.includes('>groups create:')) {
              const name = data.text.split(':')[1] || 'no name'
              const userId = params.user.id
              const response = await app.service('groups').create({ userId, name })
              data.text = `New group created: "${response.name}" and id ${response.id}.`
            } else if (data.text.includes('>groups list')) {
              const userId = params.user.id
              const response = await app.service('groups').find({ query: { userId } })
              if (response.total > 0) {
                const grpNames = response.data.map((grp) => grp.name)
                data.text = `All your groups: "${grpNames.join(', ')}"`
              } else {
                data.text = 'No groups. Make new with "groups new:<group_name>"'
              }
            } else if (data.text.includes(':')) {
              const nr = data.text.split(':')[0] * 1
              if (nr > 0) {
                data.groupIds = [nr]
                data.text = data.text + ` >> group ${nr}`
              }
            }
          }
        }
      ],
      patch: [schemaHooks.validateData(messagePatchValidator), schemaHooks.resolveData(messagePatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [messagePath]: MessageService
  }
}
