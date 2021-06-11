import { IAlunaModule } from '../core/IAlunaModule'
import { IAlunaKeyPermissionSchema } from '../schemas/IAlunaKeyPermissionSchema'



export interface IAlunaKeyModule extends IAlunaModule {

  validate (): Promise<boolean>
  getPermissions (): Promise<IAlunaKeyPermissionSchema>
  parsePermissions (params: { rawKey: any }): IAlunaKeyPermissionSchema

}
